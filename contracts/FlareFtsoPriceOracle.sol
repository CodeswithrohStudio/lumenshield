// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IShieldPriceOracle} from "./LumenShieldVault.sol";

interface IFlareContractRegistry {
    function getContractAddressByName(string calldata name) external view returns (address);
}

interface IFtsoV2 {
    function getFeedsById(bytes21[] calldata feedIds)
        external
        view
        returns (uint256[] memory values, int8[] memory decimals, uint64 timestamp);
}

/// @notice FTSOv2 adapter resolved through Flare's cross-network registry.
contract FlareFtsoPriceOracle is IShieldPriceOracle {
    IFlareContractRegistry public constant FLARE_CONTRACT_REGISTRY =
        IFlareContractRegistry(0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019);

    IFtsoV2 public immutable ftsoV2;

    constructor() {
        ftsoV2 = IFtsoV2(FLARE_CONTRACT_REGISTRY.getContractAddressByName("FtsoV2"));
    }

    function latestPrice(bytes21 feedId)
        external
        view
        returns (uint256 value, int8 decimals, uint64 timestamp)
    {
        bytes21[] memory feedIds = new bytes21[](1);
        feedIds[0] = feedId;

        uint256[] memory values;
        int8[] memory feedDecimals;
        (values, feedDecimals, timestamp) = ftsoV2.getFeedsById(feedIds);

        value = values[0];
        decimals = feedDecimals[0];
    }
}
