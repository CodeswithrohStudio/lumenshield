// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {LumenShieldVault} from "../contracts/LumenShieldVault.sol";

contract VaultUser {
    LumenShieldVault private immutable vault;

    constructor(LumenShieldVault vault_) payable {
        vault = vault_;
    }

    receive() external payable {}

    function deposit(uint256 amount) external {
        vault.deposit{value: amount}();
    }

    function openShield(bytes32 market, uint256 stake) external returns (uint256) {
        return vault.openShield(market, stake);
    }

    function withdrawPrincipal(uint256 amount) external {
        vault.withdrawPrincipal(amount);
    }

    function balance() external view returns (uint256) {
        return address(this).balance;
    }
}

contract LumenShieldVaultTest {
    LumenShieldVault private vault;
    VaultUser private user;

    bytes32 private constant BTC_USD = bytes32("BTC/USD");

    function setUp() public {
        vault = new LumenShieldVault(address(this));
        user = new VaultUser{value: 20 ether}(vault);
    }

    function testDepositTracksPrincipalOnly() public {
        user.deposit(10 ether);

        _assertEq(vault.principalBalance(address(user)), 10 ether, "principal");
        _assertEq(vault.yieldBudget(address(user)), 0, "yield budget");
        _assertEq(vault.totalYieldEarned(address(user)), 0, "total yield");
    }

    function testAdminFundedYieldCredit() public {
        user.deposit(10 ether);

        vault.creditYield{value: 1 ether}(address(user));

        _assertEq(vault.principalBalance(address(user)), 10 ether, "principal unchanged");
        _assertEq(vault.yieldBudget(address(user)), 1 ether, "yield budget");
        _assertEq(vault.totalYieldEarned(address(user)), 1 ether, "total yield");
    }

    function testSimulatedYieldAccrual() public {
        user.deposit(10 ether);

        vault.accrueSimulatedYield(address(user), 0.5 ether);

        _assertEq(vault.principalBalance(address(user)), 10 ether, "principal unchanged");
        _assertEq(vault.yieldBudget(address(user)), 0.5 ether, "yield budget");
        _assertEq(vault.totalYieldEarned(address(user)), 0.5 ether, "total yield");
    }

    function testOpenShieldConsumesYieldBudgetNeverPrincipal() public {
        user.deposit(10 ether);
        vault.creditYield{value: 1 ether}(address(user));

        uint256 shieldId = user.openShield(BTC_USD, 0.4 ether);

        (
            address shieldUser,
            bytes32 market,
            uint256 stake,
            int256 pnl,
            LumenShieldVault.ShieldStatus status
        ) = vault.shieldPositions(shieldId);

        _assertEq(shieldUser, address(user), "shield user");
        _assertEq(market, BTC_USD, "market");
        _assertEq(stake, 0.4 ether, "stake");
        _assertEq(pnl, 0, "pnl");
        _assertEq(uint256(status), uint256(LumenShieldVault.ShieldStatus.Open), "status");
        _assertEq(vault.yieldBudget(address(user)), 0.6 ether, "remaining yield");
        _assertEq(vault.principalBalance(address(user)), 10 ether, "principal unchanged");
    }

    function testCannotOpenShieldFromPrincipal() public {
        user.deposit(10 ether);

        try user.openShield(BTC_USD, 1 ether) returns (uint256) {
            revert("expected revert");
        } catch {}

        _assertEq(vault.principalBalance(address(user)), 10 ether, "principal unchanged");
        _assertEq(vault.yieldBudget(address(user)), 0, "yield unchanged");
    }

    function testSettleLosingShieldAndWithdrawPrincipalAfterLoss() public {
        user.deposit(10 ether);
        vault.creditYield{value: 1 ether}(address(user));

        uint256 shieldId = user.openShield(BTC_USD, 1 ether);
        vault.settleShield(shieldId, -1 ether);

        (,,,, LumenShieldVault.ShieldStatus status) = vault.shieldPositions(shieldId);

        _assertEq(uint256(status), uint256(LumenShieldVault.ShieldStatus.Settled), "status");
        _assertEq(vault.yieldBudget(address(user)), 0, "yield consumed");
        _assertEq(vault.principalBalance(address(user)), 10 ether, "principal protected");

        uint256 userBalanceBefore = user.balance();
        user.withdrawPrincipal(10 ether);

        _assertEq(vault.principalBalance(address(user)), 0, "principal withdrawn");
        _assertEq(user.balance(), userBalanceBefore + 10 ether, "user received principal");
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
