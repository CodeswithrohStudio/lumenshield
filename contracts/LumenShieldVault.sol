// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/// @notice Placeholder for a Flare FTSO-style price oracle adapter.
/// @dev The MVP vault does not claim live oracle integration. Production code
/// should adapt the current Flare contracts for Coston2/mainnet explicitly.
interface IFlarePriceOracle {
    function latestPrice(bytes32 symbol) external view returns (uint256 price, uint64 updatedAt);
}

/// @notice Placeholder for an FAssets or external yield source adapter.
/// @dev Yield is credited by the owner in this MVP so tests can prove principal
/// isolation without pretending to integrate a live yield protocol.
interface IFAssetYieldSource {
    function realizedYield(address user) external view returns (uint256 amount);
}

/// @notice Minimal Coston2-oriented vault for principal-protected shield positions.
/// @dev Deposits and yield are denominated in native testnet FLR units. A shield
/// can only be funded from yieldBudget, never from principalBalance.
contract LumenShieldVault {
    enum ShieldStatus {
        None,
        Open,
        Settled
    }

    struct ShieldPosition {
        address user;
        bytes32 market;
        uint256 stake;
        int256 pnl;
        ShieldStatus status;
    }

    address public immutable owner;
    IFlarePriceOracle public priceOracle;
    IFAssetYieldSource public yieldSource;

    uint256 public nextShieldId = 1;

    mapping(address => uint256) public principalBalance;
    mapping(address => uint256) public yieldBudget;
    mapping(address => uint256) public totalYieldEarned;
    mapping(uint256 => ShieldPosition) public shieldPositions;

    event Deposited(address indexed user, uint256 amount);
    event YieldCredited(address indexed user, uint256 amount, bool funded);
    event ShieldOpened(
        address indexed user,
        uint256 indexed shieldId,
        bytes32 indexed market,
        uint256 stake
    );
    event ShieldSettled(
        address indexed user,
        uint256 indexed shieldId,
        int256 pnl,
        uint256 returnedToYieldBudget
    );
    event PrincipalWithdrawn(address indexed user, uint256 amount);
    event PriceOracleSet(address indexed oracle);
    event YieldSourceSet(address indexed yieldSource);

    error NotOwner();
    error ZeroAmount();
    error InsufficientYieldBudget(uint256 requested, uint256 available);
    error InsufficientPrincipal(uint256 requested, uint256 available);
    error ShieldNotOpen(uint256 shieldId);
    error NotShieldOwner(uint256 shieldId, address caller);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address initialOwner) {
        owner = initialOwner == address(0) ? msg.sender : initialOwner;
    }

    receive() external payable {
        deposit();
    }

    function setPriceOracle(IFlarePriceOracle oracle) external onlyOwner {
        priceOracle = oracle;
        emit PriceOracleSet(address(oracle));
    }

    function setYieldSource(IFAssetYieldSource source) external onlyOwner {
        yieldSource = source;
        emit YieldSourceSet(address(source));
    }

    function deposit() public payable {
        if (msg.value == 0) revert ZeroAmount();

        principalBalance[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Admin credit for realized yield that is transferred into the vault.
    function creditYield(address user) external payable onlyOwner {
        if (msg.value == 0) revert ZeroAmount();

        yieldBudget[user] += msg.value;
        totalYieldEarned[user] += msg.value;

        emit YieldCredited(user, msg.value, true);
    }

    /// @notice Testnet/demo-only accrual hook for simulated yield.
    /// @dev This is intentionally owner-gated and marked unfunded in the event.
    function accrueSimulatedYield(address user, uint256 amount) external onlyOwner {
        if (amount == 0) revert ZeroAmount();

        yieldBudget[user] += amount;
        totalYieldEarned[user] += amount;

        emit YieldCredited(user, amount, false);
    }

    function openShield(bytes32 market, uint256 stake) external returns (uint256 shieldId) {
        if (stake == 0) revert ZeroAmount();

        uint256 available = yieldBudget[msg.sender];
        if (stake > available) revert InsufficientYieldBudget(stake, available);

        yieldBudget[msg.sender] = available - stake;
        shieldId = nextShieldId++;
        shieldPositions[shieldId] = ShieldPosition({
            user: msg.sender,
            market: market,
            stake: stake,
            pnl: 0,
            status: ShieldStatus.Open
        });

        emit ShieldOpened(msg.sender, shieldId, market, stake);
    }

    /// @notice Settles a shield. Negative pnl consumes shield stake first and
    /// cannot touch principal because principal is tracked separately.
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

        (bool sent,) = msg.sender.call{value: amount}("");
        require(sent, "PRINCIPAL_WITHDRAW_FAILED");

        emit PrincipalWithdrawn(msg.sender, amount);
    }
}
