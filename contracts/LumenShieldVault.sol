// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IShieldPriceOracle {
    function latestPrice(bytes21 feedId) external view returns (uint256 value, int8 decimals, uint64 timestamp);
}

/// @notice FXRP/FAsset vault for principal-protected shield positions on Flare.
/// @dev Principal and yield are denominated in the configured ERC-20 asset.
/// Shields spend yield only; principal can be withdrawn even after shield losses.
contract LumenShieldVault {
    enum ShieldStatus {
        None,
        Open,
        Settled
    }

    struct ShieldPosition {
        address user;
        bytes21 feedId;
        uint256 stake;
        uint256 entryPrice;
        int8 entryPriceDecimals;
        uint64 entryPriceTimestamp;
        int256 pnl;
        ShieldStatus status;
    }

    address public immutable owner;
    IERC20 public immutable asset;
    string public assetSymbol;
    IShieldPriceOracle public priceOracle;
    uint64 public maxPriceAge;

    uint256 public nextShieldId = 1;

    mapping(address => uint256) public principalBalance;
    mapping(address => uint256) public yieldBudget;
    mapping(address => uint256) public totalYieldEarned;
    mapping(uint256 => ShieldPosition) public shieldPositions;

    event Deposited(address indexed user, address indexed asset, uint256 amount);
    event YieldCredited(address indexed user, address indexed asset, uint256 amount, bool funded);
    event ShieldOpened(
        address indexed user,
        uint256 indexed shieldId,
        bytes21 indexed feedId,
        uint256 stake,
        uint256 entryPrice,
        int8 entryPriceDecimals,
        uint64 entryPriceTimestamp
    );
    event ShieldSettled(
        address indexed user,
        uint256 indexed shieldId,
        int256 pnl,
        uint256 returnedToYieldBudget
    );
    event PrincipalWithdrawn(address indexed user, address indexed asset, uint256 amount);
    event PriceOracleSet(address indexed oracle, uint64 maxPriceAge);

    error NotOwner();
    error ZeroAmount();
    error ZeroAddress();
    error AssetTransferFailed();
    error InsufficientYieldBudget(uint256 requested, uint256 available);
    error InsufficientPrincipal(uint256 requested, uint256 available);
    error ShieldNotOpen(uint256 shieldId);
    error OracleNotConfigured();
    error StalePrice(bytes21 feedId, uint64 updatedAt, uint64 maxAge);
    error InvalidPrice(bytes21 feedId);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address initialOwner, IERC20 asset_, string memory assetSymbol_) {
        if (address(asset_) == address(0)) revert ZeroAddress();

        owner = initialOwner == address(0) ? msg.sender : initialOwner;
        asset = asset_;
        assetSymbol = assetSymbol_;
    }

    function setPriceOracle(IShieldPriceOracle oracle, uint64 maxAgeSeconds) external onlyOwner {
        if (address(oracle) == address(0)) revert ZeroAddress();
        if (maxAgeSeconds == 0) revert ZeroAmount();

        priceOracle = oracle;
        maxPriceAge = maxAgeSeconds;

        emit PriceOracleSet(address(oracle), maxAgeSeconds);
    }

    function deposit(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        _pullAsset(msg.sender, amount);
        principalBalance[msg.sender] += amount;

        emit Deposited(msg.sender, address(asset), amount);
    }

    /// @notice Admin credit for realized asset yield transferred into the vault.
    function creditYield(address user, uint256 amount) external onlyOwner {
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        _pullAsset(msg.sender, amount);
        yieldBudget[user] += amount;
        totalYieldEarned[user] += amount;

        emit YieldCredited(user, address(asset), amount, true);
    }

    /// @notice Testnet/demo-only accrual hook for simulated yield.
    /// @dev Kept separate from funded credits so evidence can distinguish demo state.
    function accrueSimulatedYield(address user, uint256 amount) external onlyOwner {
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        yieldBudget[user] += amount;
        totalYieldEarned[user] += amount;

        emit YieldCredited(user, address(asset), amount, false);
    }

    function openShield(bytes21 feedId, uint256 stake) external returns (uint256 shieldId) {
        if (stake == 0) revert ZeroAmount();

        (uint256 price, int8 decimals, uint64 timestamp) = _readFreshPrice(feedId);

        uint256 available = yieldBudget[msg.sender];
        if (stake > available) revert InsufficientYieldBudget(stake, available);

        yieldBudget[msg.sender] = available - stake;
        shieldId = nextShieldId++;
        shieldPositions[shieldId] = ShieldPosition({
            user: msg.sender,
            feedId: feedId,
            stake: stake,
            entryPrice: price,
            entryPriceDecimals: decimals,
            entryPriceTimestamp: timestamp,
            pnl: 0,
            status: ShieldStatus.Open
        });

        emit ShieldOpened(msg.sender, shieldId, feedId, stake, price, decimals, timestamp);
    }

    /// @notice Settles a shield. Losses consume shield stake and never principal.
    function settleShield(uint256 shieldId, int256 pnl) external onlyOwner {
        ShieldPosition storage position = shieldPositions[shieldId];
        if (position.status != ShieldStatus.Open) revert ShieldNotOpen(shieldId);

        position.status = ShieldStatus.Settled;
        position.pnl = pnl;

        uint256 returnedToBudget;
        if (pnl >= 0) {
            returnedToBudget = position.stake + uint256(pnl);
        } else {
            uint256 loss = uint256(-pnl);
            returnedToBudget = loss >= position.stake ? 0 : position.stake - loss;
        }

        if (returnedToBudget > 0) {
            yieldBudget[position.user] += returnedToBudget;
        }

        emit ShieldSettled(position.user, shieldId, pnl, returnedToBudget);
    }

    function withdrawPrincipal(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        uint256 available = principalBalance[msg.sender];
        if (amount > available) revert InsufficientPrincipal(amount, available);

        principalBalance[msg.sender] = available - amount;
        _pushAsset(msg.sender, amount);

        emit PrincipalWithdrawn(msg.sender, address(asset), amount);
    }

    function _readFreshPrice(bytes21 feedId) private view returns (uint256 price, int8 decimals, uint64 timestamp) {
        IShieldPriceOracle oracle = priceOracle;
        if (address(oracle) == address(0)) revert OracleNotConfigured();

        (price, decimals, timestamp) = oracle.latestPrice(feedId);
        if (price == 0) revert InvalidPrice(feedId);
        if (timestamp + maxPriceAge < block.timestamp) {
            revert StalePrice(feedId, timestamp, maxPriceAge);
        }
    }

    function _pullAsset(address from, uint256 amount) private {
        if (!asset.transferFrom(from, address(this), amount)) revert AssetTransferFailed();
    }

    function _pushAsset(address to, uint256 amount) private {
        if (!asset.transfer(to, amount)) revert AssetTransferFailed();
    }
}
