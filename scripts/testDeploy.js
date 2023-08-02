const hre = require("hardhat");

async function main() {
    try {
        console.log("\x1b[43m%s\x1b[0m", "\n Testing Smart Contract Deployment Start");
        
        const [owner, user1, user2] = await ethers.getSigners();
        console.log("\x1b[43m%s\x1b[0m", "\n Getting Sepolia Testnet Account");

        // Libraries
        const SampleToken = await ethers.getContractFactory("SampleToken");
        const hardhatSampleToken = await SampleToken.deploy();
        
        await hardhatSampleToken.deployed();
        console.log("\x1b[43m%s\x1b[0m", "\n SampleToken Deployed on Sepolia Testnet");
        
    } catch (error) {
        console.error("\x1b[41m%s\x1b[0m", "\n Error encountered during deployment: ");
        console.error(error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
