# erc20BasedSecureLoan
SKKU - Coinplug 2023

---
$ git clone {repository address}
$ cd erc20BasedSecureLoan
$ npm install
---
Create .env file and add your wallet's private key following the below format

USER_WALLET_PRIVATE_KEY{n} # n = [1,2,3]

---
$ npx hardhat compile # Compile Smart Contracts in 'contracts' directory. Takes a while since the Smart Contract size is quite large.
$ npx hardhat test test/LendingBoardProposeModeTest.js # Test for setting initial Lend Board service and testing basic functions
$ npx hardhat run --network localhost scripts/LendingBoardDeployment.js # Test deploying compile Smart Contracts on localhost network 
---