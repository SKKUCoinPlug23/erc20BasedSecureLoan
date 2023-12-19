require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const USER1_WALLET_PRIVATE_KEY = process.env.USER1_WALLET_PRIVATE_KEY;
const USER2_WALLET_PRIVATE_KEY = process.env.USER2_WALLET_PRIVATE_KEY;
const USER3_WALLET_PRIVATE_KEY = process.env.USER3_WALLET_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // loggingEnabled: true,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      loggingEnabled: true,
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [
        USER1_WALLET_PRIVATE_KEY,
        USER2_WALLET_PRIVATE_KEY,
        USER3_WALLET_PRIVATE_KEY,
      ],
    },
    tb: {
      loggingEnabled: true,
      url: `http://106.240.238.226:10188`,
      accounts: [
        USER1_WALLET_PRIVATE_KEY,
        USER2_WALLET_PRIVATE_KEY,
        USER3_WALLET_PRIVATE_KEY,
      ],
      gasPrice: 80000000000,
    },
    metadium: {
      loggingEnabled: true,
      url: `https://api.metadium.com/dev`,
      accounts: [
        USER1_WALLET_PRIVATE_KEY,
        USER2_WALLET_PRIVATE_KEY,
        USER3_WALLET_PRIVATE_KEY,
      ],
      gasPrice: 80000000000,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      {
        version: "0.8.6",
        settings: {
          optimizer: {
            enabled: true,
            details: {
              yulDetails: {
                optimizerSteps: "u",
              },
            },
            runs: 200,
          },
          viaIR: true,
        },
      },
    ],
  },
};
