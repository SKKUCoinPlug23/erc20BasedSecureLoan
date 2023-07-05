// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "../interfaces/ILendingRateOracle.sol";

contract TestLendingRateOracle is ILendingRateOracle {
    mapping(address => uint256) private lendingRates;

    // @dev returns the asset price in wei(기존 ChainLink는 eth의 단위로 return하는듯)
    function getMarketBorrowRate(address _asset) public view override returns (uint256) {
        return lendingRates[_asset];
    }

    // @dev sets the asset price in wei(IPriceOracle에 따르면)
    function setMarketBorrowRate(address _asset, uint256 _lendingRate) public override {
        lendingRates[_asset] = _lendingRate;
    }
}
