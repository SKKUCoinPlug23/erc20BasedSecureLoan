
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
      signer : owner,
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
    await hardhatLendingBoardAddressesProvider.setLendingBoardManager(owner.address);
    // 
    // await hardhatLendingBoardAddressesProvider.setPriceOracle();
    // await hardhatLendingBoardAddressesProvider.setLendingRateOracle();
    // await hardhatLendingBoardAddressesProvider.setTokenDistributor();

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
    await hardhatLendingBoardConfigurator.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardDataProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardParametersProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardFeeProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    // await hardhatLendingBoardLiquidationManager.initialize(hardhatLendingBoardAddressesProvider.address);

    // SampleToken Deployment for Testing
    const SampleToken = await ethers.getContractFactory("SampleToken");
    const hardhatSampleToken = await SampleToken.deploy();
    await hardhatSampleToken.deployed();
    



    // Fixtures can return anything you consider useful for your tests
    return { owner, addr1, addr2, LendingBoard, hardhatLendingBoard,hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator, hardhatSampleToken};
  }

  describe("<Initializations>", function () {

    it("Should Deploy Successfully and Set the proper address", async function () {
      const { hardhatLendingBoard, owner } = await loadFixture(deployLendingBoardFixture);
      

      // expect(await hardhatLendingBoard.owner()).to.equal(owner.address);
    });
  });

  // You can nest describe calls to create subsections.
  describe("<Lending Board Interaction>", function () {

    it("Depositing DAI Token to Service For the First Time", async function () {
      // const DAIaddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // Testing with DAI(Stable Token)
      const { owner,addr1, hardhatLendingBoard, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken } = await loadFixture(deployLendingBoardFixture);

      const STKNaddress = hardhatSampleToken.address;

      // // AToken deploy with Matching Input Token
      // const AToken = await ethers.getContractFactory("AToken");
      // const hardhatAToken = await AToken.deploy(hardhatLendingBoardAddressesProvider.address,STKNaddress,18,"SampleToken","aSTKN");
      // await hardhatAToken.deployed();
      // const aSTKNaddress = hardhatAToken.address;

      console.log("STKNaddress : ",STKNaddress);
      // console.log("aSTKNaddress : ",aSTKNaddress);

      // Default Reserve Interest-Rate Strategy Contract
      const DefaultReserveInterestRateStrategy = await ethers.getContractFactory("DefaultReserveInterestRateStrategy");
      const hardhatDefaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(STKNaddress,hardhatLendingBoardAddressesProvider.address,1,1,1,1,1);
      await hardhatDefaultReserveInterestRateStrategy.deployed();
      const strategyAddress = hardhatDefaultReserveInterestRateStrategy.address;

      console.log("Initializing Reserve for STKN");
      await hardhatLendingBoardConfigurator.initReserve(STKNaddress,18,strategyAddress);

      console.log("AToken 및 LendingBoardCore reserve Initialization done");

      // Approve LendingBoard contract to spend tokens
      const approveAmount = ethers.utils.parseEther('1000');
      // Send the approval transaction. The address should be LBCore not LB itself.
      const approvalResult = await hardhatSampleToken.connect(owner).approve(hardhatLendingBoardCore.address, approveAmount);
      // Wait for the transaction to be mined
      await approvalResult.wait();

      const balanceOfOwner = await hardhatSampleToken.connect(owner).balanceOf(owner.address);
      console.log("Balance of Owner : ",balanceOfOwner.toString());

      // const balanceOfAddr1 = await hardhatSampleToken.connect(addr1).balanceOf(addr1.address);
      // console.log("Balance of Address1 User : ",balanceOfAddr1.toString());

      // Retrieve and log the allowance
      const allowance = await hardhatSampleToken.allowance(owner.address, hardhatLendingBoardCore.address);
      console.log("Allowance after approval: ", allowance.toString()); // allowance는 정상적으로 incremented
      console.log("Reserve Address : ",STKNaddress);
      console.log("LB Address : ",hardhatLendingBoard.address);
      console.log("LBCore Address : ",hardhatLendingBoardCore.address);

      console.log("STKN Approval for LendingBoard Contract Done");

      // WIP : Make a deposit => Error 발생
      const depositAmount = ethers.utils.parseEther('10');
      console.log("Deposit Amount : ",depositAmount.toString());
      await hardhatLendingBoard.connect(owner).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0


    });
  });


});