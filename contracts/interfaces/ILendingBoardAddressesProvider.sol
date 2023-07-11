//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0; // SafeMath default in solidity over 0.8.0

/**
@title ILendingBoardAddressesProvider interface
@notice provides the interface to fetch the LendingBoardCore address
 */


interface ILendingBoardAddressesProvider { // WIP : Proxy Contract 관련 함수는 추후에 구현, 우선 주석처리

    function getLendingBoard() external view returns (address);
    // function setLendingBoardImpl(address _board) external;

    function getLendingBoardCore() external view returns (address payable);
    // function setLendingBoardCoreImpl(address _lendingBoardCore) external;

    function getLendingBoardConfigurator() external view returns (address);
    // function setLendingBoardConfiguratorImpl(address _configurator) external;

    function getLendingBoardDataProvider() external view returns (address);
    // function setLendingBoardDataProviderImpl(address _provider) external;

    function getLendingBoardParametersProvider() external view returns (address);
    // function setLendingBoardParametersProviderImpl(address _parametersProvider) external;

    function getLendingBoardNFT() external view returns (address);
    // function setLendingBoardNFTImpl(address _lendingBoardNFT) external;
    
    function getTokenDistributor() external view returns (address);
    function setTokenDistributor(address _tokenDistributor) external;


    function getFeeProvider() external view returns (address);
    // function setFeeProviderImpl(address _feeProvider) external;

    function getLendingBoardLiquidationManager() external view returns (address);
    function setLendingBoardLiquidationManager(address _manager) external;

    function getLendingBoardManager() external view returns (address);
    function setLendingBoardManager(address _lendingBoardManager) external;

    function getPriceOracle() external view returns (address);
    function setPriceOracle(address _priceOracle) external;

    function getLendingRateOracle() external view returns (address);
    function setLendingRateOracle(address _lendingRateOracle) external;


}