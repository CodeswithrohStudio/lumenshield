// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {FlareFtsoPriceOracle} from "../contracts/FlareFtsoPriceOracle.sol";
import {IERC20, LumenShieldVault} from "../contracts/LumenShieldVault.sol";

interface Vm {
    function envUint(string calldata name) external view returns (uint256);
    function envOr(string calldata name, address defaultValue) external view returns (address);
    function envOr(string calldata name, uint64 defaultValue) external view returns (uint64);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

contract DeployLumenShieldVault {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    address public constant COSTON2_FXRP = 0x0b6A3645c240605887a5532109323A3E12273dc7;
    uint64 public constant DEFAULT_MAX_PRICE_AGE = 180;

    function run() external returns (FlareFtsoPriceOracle oracle, LumenShieldVault vault) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address owner = vm.envOr("LUMENSHIELD_OWNER", address(0));
        address fxrp = vm.envOr("COSTON2_FXRP_ADDRESS", COSTON2_FXRP);
        uint64 maxPriceAge = vm.envOr("LUMENSHIELD_MAX_PRICE_AGE", DEFAULT_MAX_PRICE_AGE);

        vm.startBroadcast(deployerPrivateKey);

        oracle = new FlareFtsoPriceOracle();
        vault = new LumenShieldVault(owner, IERC20(fxrp), "FXRP");
        vault.setPriceOracle(oracle, maxPriceAge);

        vm.stopBroadcast();
    }
}
