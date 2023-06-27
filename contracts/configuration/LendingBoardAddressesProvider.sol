//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
// import "../libraries/openzeppelin-upgradeability/InitializableAdminUpgradeabilityProxy.sol";

import "./AddressStorage.sol";
import "../interfaces/ILendingBoardAddressesProvider.sol";

/**
* @title LendingPoolAddressesProvider contract
* @notice Is the main registry of the protocol. All the different components of the protocol are accessible
* through the addresses provider.
* @author Aave
**/

contract LendingBoardAddressesProvider is Ownable, ILendingPoolAddressesProvider, AddressStorage {
    //events
    event LendingBoardUpdated(address indexed newAddress);
    event LendingBoardCoreUpdated(address indexed newAddress);
    event LendingBoardParametersProviderUpdated(address indexed newAddress);
    event LendingBoardManagerUpdated(address indexed newAddress);
    event LendingBoardConfiguratorUpdated(address indexed newAddress);
    event LendingBoardLiquidationManagerUpdated(address indexed newAddress);
    event LendingBoardDataProviderUpdated(address indexed newAddress);
    event EthereumAddressUpdated(address indexed newAddress);
    event PriceOracleUpdated(address indexed newAddress);
    event LendingRateOracleUpdated(address indexed newAddress);
    event FeeProviderUpdated(address indexed newAddress);
    event TokenDistributorUpdated(address indexed newAddress);

    event ProxyCreated(bytes32 id, address indexed newAddress);

    bytes32 private constant LENDING_BOARD = "LENDING_BOARD";
    bytes32 private constant LENDING_BOARD_CORE = "LENDING_BOARD_CORE";
    bytes32 private constant LENDING_BOARD_CONFIGURATOR = "LENDING_BOARD_CONFIGURATOR";
    bytes32 private constant LENDING_BOARD_PARAMETERS_PROVIDER = "PARAMETERS_PROVIDER";
    bytes32 private constant LENDING_BOARD_MANAGER = "LENDING_BOARD_MANAGER";
    bytes32 private constant LENDING_BOARD_LIQUIDATION_MANAGER = "LIQUIDATION_MANAGER";
    bytes32 private constant LENDING_BOARD_FLASHLOAN_PROVIDER = "FLASHLOAN_PROVIDER";
    bytes32 private constant DATA_PROVIDER = "DATA_PROVIDER";
    bytes32 private constant ETHEREUM_ADDRESS = "ETHEREUM_ADDRESS";
    bytes32 private constant PRICE_ORACLE = "PRICE_ORACLE";
    bytes32 private constant LENDING_RATE_ORACLE = "LENDING_RATE_ORACLE";
    bytes32 private constant FEE_PROVIDER = "FEE_PROVIDER";
    bytes32 private constant WALLET_BALANCE_PROVIDER = "WALLET_BALANCE_PROVIDER";
    bytes32 private constant TOKEN_DISTRIBUTOR = "TOKEN_DISTRIBUTOR";


    /**
    * @dev returns the address of the LendingPool proxy
    * @return the lending pool proxy address
    **/
    function getLendingBoard() public view returns (address) {
        return getAddress(LENDING_BOARD);
    }


    /**
    * @dev updates the implementation of the lending board
    * @param _board the new lending board implementation
    **/
    function setLendingBoardImpl(address _board) public onlyOwner {
        updateImplInternal(LENDING_BOARD, _board);
        emit LendingBoardUpdated(_board);
    }

    /**
    * @dev returns the address of the LendingBoardCore proxy
    * @return the lending board core proxy address
     */
    function getLendingBoardCore() public view returns (address payable) {
        address payable core = address(uint160(getAddress(LENDING_BOARD_CORE)));
        return core;
    }

    /**
    * @dev updates the implementation of the lending board core
    * @param _lendingBoardCore the new lending board core implementation
    **/
    // function setLendingBoardCoreImpl(address _lendingBoardCore) public onlyOwner {
    //     updateImplInternal(LENDING_BOARD_CORE, _lendingBoardCore);
    //     emit LendingBoardCoreUpdated(_lendingBoardCore);
    // }

    /**
    * @dev returns the address of the LendingBoardConfigurator proxy
    * @return the lending board configurator proxy address
    **/
    function getLendingBoardConfigurator() public view returns (address) {
        return getAddress(LENDING_BOARD_CONFIGURATOR);
    }

    /**
    * @dev updates the implementation of the lending board configurator
    * @param _configurator the new lending board configurator implementation
    **/
    // function setLendingBoardConfiguratorImpl(address _configurator) public onlyOwner {
    //     updateImplInternal(LENDING_BOARDL_CONFIGURATOR, _configurator);
    //     emit LendingBoardlConfiguratorUpdated(_configurator);
    // }

    /**
    * @dev returns the address of the LendingBoardDataProvider proxy
    * @return the lending board data provider proxy address
     */
    function getLendingBoardDataProvider() public view returns (address) {
        return getAddress(DATA_PROVIDER);
    }

    /**
    * @dev updates the implementation of the lending board data provider
    * @param _provider the new lending board data provider implementation
    **/
    // function setLendingboardDataProviderImpl(address _provider) public onlyOwner {
    //     updateImplInternal(DATA_PROVIDER, _provider);
    //     emit LendingboardDataProviderUpdated(_provider);
    // }

    /**
    * @dev returns the address of the LendingBoardParametersProvider proxy
    * @return the address of the Lending board parameters provider proxy
    **/
    function getLendingBoardParametersProvider() public view returns (address) {
        return getAddress(LENDING_BOARD_PARAMETERS_PROVIDER);
    }

    /**
    * @dev updates the implementation of the lending Board parameters provider
    * @param _parametersProvider the new lending Board parameters provider implementation
    **/
    // function setLendingBoardParametersProviderImpl(address _parametersProvider) public onlyOwner {
    //     updateImplInternal(LENDING_Board_PARAMETERS_PROVIDER, _parametersProvider);
    //     emit LendingBoardParametersProviderUpdated(_parametersProvider);
    // }

    /**
    * @dev returns the address of the FeeProvider proxy
    * @return the address of the Fee provider proxy
    **/
    function getFeeProvider() public view returns (address) {
        return getAddress(FEE_PROVIDER);
    }

    /**
    * @dev updates the implementation of the FeeProvider proxy
    * @param _feeProvider the new lending Board fee provider implementation
    **/
    // function setFeeProviderImpl(address _feeProvider) public onlyOwner {
    //     updateImplInternal(FEE_PROVIDER, _feeProvider);
    //     emit FeeProviderUpdated(_feeProvider);
    // }

    /**
    * @dev returns the address of the LendingBoardLiquidationManager. Since the manager is used
    * through delegateCall within the LendingBoard contract, the proxy contract pattern does not work properly hence
    * the addresses are changed directly.
    * @return the address of the Lending Board liquidation manager
    **/

    function getLendingBoardLiquidationManager() public view returns (address) {
        return getAddress(LENDING_BOARD_LIQUIDATION_MANAGER);
    }

    /**
    * @dev updates the address of the Lending Board liquidation manager
    * @param _manager the new lending Board liquidation manager address
    **/
    function setLendingBoardLiquidationManager(address _manager) public onlyOwner {
        _setAddress(LENDING_BOARD_LIQUIDATION_MANAGER, _manager);
        emit LendingBoardLiquidationManagerUpdated(_manager);
    }

    /**
    * @dev the functions below are storing specific addresses that are outside the context of the protocol
    * hence the upgradable proxy pattern is not used
    **/


    function getLendingBoardManager() public view returns (address) {
        return getAddress(LENDING_BOARD_MANAGER);
    }

    function setLendingBoardManager(address _lendingBoardManager) public onlyOwner {
        _setAddress(LENDING_BOARD_MANAGER, _lendingBoardManager);
        emit LendingBoardManagerUpdated(_lendingBoardManager);
    }

    function getPriceOracle() public view returns (address) {
        return getAddress(PRICE_ORACLE);
    }

    function setPriceOracle(address _priceOracle) public onlyOwner {
        _setAddress(PRICE_ORACLE, _priceOracle);
        emit PriceOracleUpdated(_priceOracle);
    }

    function getLendingRateOracle() public view returns (address) {
        return getAddress(LENDING_RATE_ORACLE);
    }

    function setLendingRateOracle(address _lendingRateOracle) public onlyOwner {
        _setAddress(LENDING_RATE_ORACLE, _lendingRateOracle);
        emit LendingRateOracleUpdated(_lendingRateOracle);
    }


    function getTokenDistributor() public view returns (address) {
        return getAddress(TOKEN_DISTRIBUTOR);
    }

    function setTokenDistributor(address _tokenDistributor) public onlyOwner {
        _setAddress(TOKEN_DISTRIBUTOR, _tokenDistributor);
        emit TokenDistributorUpdated(_tokenDistributor);
    }


    /**
    * @dev internal function to update the implementation of a specific component of the protocol
    * @param _id the id of the contract to be updated
    * @param _newAddress the address of the new implementation
    **/
    // function updateImplInternal(bytes32 _id, address _newAddress) internal {
    //     address payable proxyAddress = address(uint160(getAddress(_id)));

    //     InitializableAdminUpgradeabilityProxy proxy = InitializableAdminUpgradeabilityProxy(proxyAddress);
    //     bytes memory params = abi.encodeWithSignature("initialize(address)", address(this));

    //     if (proxyAddress == address(0)) {
    //         proxy = new InitializableAdminUpgradeabilityProxy();
    //         proxy.initialize(_newAddress, address(this), params);
    //         _setAddress(_id, address(proxy));
    //         emit ProxyCreated(_id, address(proxy));
    //     } else {
    //         proxy.upgradeToAndCall(_newAddress, params);
    //     }
    // }
}