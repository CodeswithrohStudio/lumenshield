// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {LumenShieldVault} from "../contracts/LumenShieldVault.sol";

contract DeployLumenShieldVault {
    function deploy(address owner) external returns (LumenShieldVault) {
        return new LumenShieldVault(owner);
    }
}
