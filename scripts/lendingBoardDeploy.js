async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const token = await ethers.deployContract("SampleToken");
  
    console.log("Token decimals:", await token.decimals());
    console.log("Test Deploy Script");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });