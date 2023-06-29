
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("<LendingBoard Contract Test Implementation>", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployLendingBoardFixture() {
    // Get the ContractFactory and Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Libraries
    const CoreLibrary = await ethers.getContractFactory("CoreLibrary");
    const hardhatCoreLibrary = await CoreLibrary.deploy();
    await hardhatCoreLibrary.deployed();

    // Main Contracts
    const LendingBoard = await ethers.getContractFactory("LendingBoard");
    const LendingBoardCore = await ethers.getContractFactory("LendingBoardCore", {
      signer :owner,
      libraries : {
        CoreLibrary : hardhatCoreLibrary.address,
      },
    });
    const LendingBoardConfigurator = await ethers.getContractFactory("LendingBoardConfigurator");
    const LendingBoardDataProvider = await ethers.getContractFactory("LendingBoardDataProvider");
    const LendingBoardParametersProvider = await ethers.getContractFactory("LendingBoardParametersProvider");
    const LendingBoardFeeProvider = await ethers.getContractFactory("FeeProvider");
    const LendingBoardLiquidationManager = await ethers.getContractFactory("LendingBoardLiquidationManager");
    const LendingBoardAddressesProvider = await ethers.getContractFactory("LendingBoardAddressesProvider");

    const hardhatLendingBoard = await LendingBoard.deploy();
    await hardhatLendingBoard.deployed()

    const hardhatLendingBoardCore = await LendingBoardCore.deploy();
    await hardhatLendingBoardCore.deployed()

    const hardhatLendingBoardConfigurator = await LendingBoardConfigurator.deploy();
    await hardhatLendingBoardConfigurator.deployed()

    const hardhatLendingBoardDataProvider= await LendingBoardDataProvider.deploy();
    await hardhatLendingBoardDataProvider.deployed()

    const hardhatLendingBoardParametersProvider = await LendingBoardParametersProvider.deploy();
    await hardhatLendingBoardParametersProvider.deployed()

    const hardhatLendingBoardFeeProvider = await LendingBoardFeeProvider.deploy();
    await hardhatLendingBoardFeeProvider.deployed()
    
    const hardhatLendingBoardLiquidationManager = await LendingBoardLiquidationManager.deploy();
    await hardhatLendingBoardLiquidationManager.deployed()

    console.log("Lending Board Base Contracts Deployment Successful");

    const hardhatLendingBoardAddressesProvider = await LendingBoardAddressesProvider.deploy();
    await hardhatLendingBoardAddressesProvider.deployed();

    // Using LendingBoardAddressesProvider set the deployed Smart Contract address to the appropriate location
    await hardhatLendingBoardAddressesProvider.setLendingBoardImpl(hardhatLendingBoard.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardCoreImpl(hardhatLendingBoardCore.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardConfiguratorImpl(hardhatLendingBoardConfigurator.address);
    await hardhatLendingBoardAddressesProvider.setLendingboardDataProviderImpl(hardhatLendingBoardDataProvider.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardParametersProviderImpl(hardhatLendingBoardParametersProvider.address);
    await hardhatLendingBoardAddressesProvider.setFeeProviderImpl(hardhatLendingBoardFeeProvider.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardLiquidationManager(hardhatLendingBoardLiquidationManager.address);

    // Setting address for contracts that are outside the context of the protocol
    // await hardhatLendingBoardAddressesProvider.setLendingBoardManager();
    // await hardhatLendingBoardAddressesProvider.setPriceOracle();
    // await hardhatLendingBoardAddressesProvider.setLendingRateOracle();
    // await hardhatLendingBoardAddressesProvider.setTokenDistributor();

    const addressStoredInAddressesProvider = await hardhatLendingBoardAddressesProvider.getLendingBoard();
    console.log("LendingBoard address set : ",addressStoredInAddressesProvider);
    // check if the address setting is done.
    expect(addressStoredInAddressesProvider).to.equal(hardhatLendingBoard.address);

    await hardhatLendingBoard.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardCore.initialize(hardhatLendingBoardAddressesProvider.address);
    // await hardhatLendingBoardConfigurator.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardDataProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardParametersProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardFeeProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    // await hardhatLendingBoardLiquidationManager.initialize(hardhatLendingBoardAddressesProvider.address);
    



    // Fixtures can return anything you consider useful for your tests
    return { owner, addr1, addr2, LendingBoard, hardhatLendingBoard,};
  }

  describe("<Initializations>", function () {

    it("Should Deploy Successfully and Set the proper address", async function () {
      const { hardhatLendingBoard, owner } = await loadFixture(deployLendingBoardFixture);
      

      // expect(await hardhatLendingBoard.owner()).to.equal(owner.address);
    });
  });

  // You can nest describe calls to create subsections.
  describe("<Lending Board Interaction>", function () {

    it("Depositing DAI Token to Service", async function () {
      const { hardhatLendingBoard, owner } = await loadFixture(deployLendingBoardFixture);
      const DAIaddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
      await hardhatLendingBoard.deposit(DAIaddress,100,0);
      
    });
  });


});