// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20, IShieldPriceOracle, LumenShieldVault} from "../contracts/LumenShieldVault.sol";

interface Vm {
    function warp(uint256 timestamp) external;
}

contract MockAsset {
    string public name = "Coston2 FXRP";
    string public symbol = "FXRP";
    uint8 public decimals = 6;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        if (balanceOf[msg.sender] < amount) return false;

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed < amount || balanceOf[from] < amount) return false;

        allowance[from][msg.sender] = allowed - amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract MockOracle is IShieldPriceOracle {
    uint256 public value = 250_000;
    int8 public decimals = 5;
    uint64 public timestamp = uint64(block.timestamp);

    function setPrice(uint256 value_, int8 decimals_, uint64 timestamp_) external {
        value = value_;
        decimals = decimals_;
        timestamp = timestamp_;
    }

    function latestPrice(bytes21) external view returns (uint256, int8, uint64) {
        return (value, decimals, timestamp);
    }
}

contract VaultUser {
    LumenShieldVault private immutable vault;
    MockAsset private immutable asset;

    constructor(LumenShieldVault vault_, MockAsset asset_) {
        vault = vault_;
        asset = asset_;
    }

    function approveVault(uint256 amount) external {
        asset.approve(address(vault), amount);
    }

    function deposit(uint256 amount) external {
        vault.deposit(amount);
    }

    function openShield(bytes21 feedId, uint256 stake) external returns (uint256) {
        return vault.openShield(feedId, stake);
    }

    function withdrawPrincipal(uint256 amount) external {
        vault.withdrawPrincipal(amount);
    }
}

contract LumenShieldVaultTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    LumenShieldVault private vault;
    MockAsset private asset;
    MockOracle private oracle;
    VaultUser private user;

    bytes21 private constant XRP_USD = bytes21(0x015852502f55534400000000000000000000000000);
    uint256 private constant ONE_FXRP = 1_000_000;

    function setUp() public {
        vm.warp(1_000);

        asset = new MockAsset();
        oracle = new MockOracle();
        vault = new LumenShieldVault(address(this), IERC20(address(asset)), "FXRP");
        vault.setPriceOracle(oracle, 180);
        user = new VaultUser(vault, asset);

        asset.mint(address(user), 20 * ONE_FXRP);
        asset.mint(address(this), 10 * ONE_FXRP);
        user.approveVault(type(uint256).max);
        asset.approve(address(vault), type(uint256).max);
    }

    function testDepositTracksFAssetPrincipalOnly() public {
        user.deposit(10 * ONE_FXRP);

        _assertEq(vault.principalBalance(address(user)), 10 * ONE_FXRP, "principal");
        _assertEq(vault.yieldBudget(address(user)), 0, "yield budget");
        _assertEq(vault.totalYieldEarned(address(user)), 0, "total yield");
        _assertEq(asset.balanceOf(address(vault)), 10 * ONE_FXRP, "vault custody");
    }

    function testAdminFundedYieldCreditUsesSameAsset() public {
        user.deposit(10 * ONE_FXRP);

        vault.creditYield(address(user), ONE_FXRP);

        _assertEq(vault.principalBalance(address(user)), 10 * ONE_FXRP, "principal unchanged");
        _assertEq(vault.yieldBudget(address(user)), ONE_FXRP, "yield budget");
        _assertEq(vault.totalYieldEarned(address(user)), ONE_FXRP, "total yield");
        _assertEq(asset.balanceOf(address(vault)), 11 * ONE_FXRP, "vault custody");
    }

    function testSimulatedYieldAccrualIsUnfundedDemoState() public {
        user.deposit(10 * ONE_FXRP);

        vault.accrueSimulatedYield(address(user), ONE_FXRP / 2);

        _assertEq(vault.principalBalance(address(user)), 10 * ONE_FXRP, "principal unchanged");
        _assertEq(vault.yieldBudget(address(user)), ONE_FXRP / 2, "yield budget");
        _assertEq(asset.balanceOf(address(vault)), 10 * ONE_FXRP, "no extra custody");
    }

    function testOpenShieldConsumesYieldBudgetAndRecordsFtsoEntry() public {
        user.deposit(10 * ONE_FXRP);
        vault.creditYield(address(user), ONE_FXRP);

        uint256 shieldId = user.openShield(XRP_USD, 400_000);

        (
            address shieldUser,
            bytes21 feedId,
            uint256 stake,
            uint256 entryPrice,
            int8 entryPriceDecimals,
            uint64 entryPriceTimestamp,
            int256 pnl,
            LumenShieldVault.ShieldStatus status
        ) = vault.shieldPositions(shieldId);

        _assertEq(shieldUser, address(user), "shield user");
        _assertEq(bytes32(feedId), bytes32(XRP_USD), "feed");
        _assertEq(stake, 400_000, "stake");
        _assertEq(entryPrice, 250_000, "entry price");
        _assertEq(int256(entryPriceDecimals), int256(5), "entry decimals");
        _assertEq(uint256(entryPriceTimestamp), block.timestamp, "entry timestamp");
        _assertEq(pnl, 0, "pnl");
        _assertEq(uint256(status), uint256(LumenShieldVault.ShieldStatus.Open), "status");
        _assertEq(vault.yieldBudget(address(user)), 600_000, "remaining yield");
        _assertEq(vault.principalBalance(address(user)), 10 * ONE_FXRP, "principal unchanged");
    }

    function testCannotOpenShieldFromPrincipal() public {
        user.deposit(10 * ONE_FXRP);

        try user.openShield(XRP_USD, ONE_FXRP) returns (uint256) {
            revert("expected revert");
        } catch {}

        _assertEq(vault.principalBalance(address(user)), 10 * ONE_FXRP, "principal unchanged");
        _assertEq(vault.yieldBudget(address(user)), 0, "yield unchanged");
    }

    function testCannotOpenShieldWithStalePrice() public {
        vault.creditYield(address(user), ONE_FXRP);
        oracle.setPrice(250_000, 5, uint64(block.timestamp - 181));

        try user.openShield(XRP_USD, ONE_FXRP / 2) returns (uint256) {
            revert("expected stale revert");
        } catch {}

        _assertEq(vault.yieldBudget(address(user)), ONE_FXRP, "yield preserved");
    }

    function testSettleLosingShieldAndWithdrawPrincipalAfterLoss() public {
        user.deposit(10 * ONE_FXRP);
        vault.creditYield(address(user), ONE_FXRP);

        uint256 shieldId = user.openShield(XRP_USD, ONE_FXRP);
        vault.settleShield(shieldId, -int256(ONE_FXRP));

        (,,,,,,, LumenShieldVault.ShieldStatus status) = vault.shieldPositions(shieldId);

        _assertEq(uint256(status), uint256(LumenShieldVault.ShieldStatus.Settled), "status");
        _assertEq(vault.yieldBudget(address(user)), 0, "yield consumed");
        _assertEq(vault.principalBalance(address(user)), 10 * ONE_FXRP, "principal protected");

        user.withdrawPrincipal(10 * ONE_FXRP);

        _assertEq(vault.principalBalance(address(user)), 0, "principal withdrawn");
        _assertEq(asset.balanceOf(address(user)), 20 * ONE_FXRP, "user received principal");
    }

    function _assertEq(uint256 actual, uint256 expected, string memory message) private pure {
        require(actual == expected, message);
    }

    function _assertEq(int256 actual, int256 expected, string memory message) private pure {
        require(actual == expected, message);
    }

    function _assertEq(address actual, address expected, string memory message) private pure {
        require(actual == expected, message);
    }

    function _assertEq(bytes32 actual, bytes32 expected, string memory message) private pure {
        require(actual == expected, message);
    }
}
