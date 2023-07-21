// src/app.js
import './App.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import LendingBoardArtifact from "./artifacts/contracts/lendingboard/LendingBoard.sol/LendingBoard.json";
import CoreLibraryArtifact from './artifacts/contracts/libraries/CoreLibrary.sol/CoreLibrary.json';

const lbAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const CoreLibraryAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {
  const [tokenData, setTokenData] = useState({});
  const [amount, setAmount] = useState(0);
  const [companyAccountId, setCompanyAccountId] = useState();
  const [userAccountId, setUserAccountId] = useState();
  const [reserveIsActive, setReserveIsActive] = useState(true);
  

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  async function _intializeContract(init) {
    const contract = new ethers.Contract(
      lbAddress,
      LendingBoardArtifact.abi,
      init
    );
    const coreLibrary = new ethers.Contract(
      CoreLibraryAddress, 
      CoreLibraryArtifact.abi, 
      init
    );

    return { contract, coreLibrary };
  }

  async function _getUserAccountData() {
    const { contract } = await _intializeContract(signer);
    const name = await contract.getReserves();
    setTokenData({ name: name.toString() });
  }

  // useEffect(() => {
  //   checkReserveStatus();
  // }, []);

  // async function checkReserveStatus() {
  //   await requestAccount();
  //   const { coreLibrary } = await _intializeContract(signer);
  //   const isActive = await coreLibrary.reserveIsActive();
  //   setReserveIsActive(isActive);
  // }

  async function Repay() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();

      const formattedCompanyAccountId = ethers.utils.getAddress(companyAccountId);
      const formatteduserAccountId = ethers.utils.getAddress(userAccountId);
      const formattedAmount = ethers.utils.parseEther(amount);

      const { contract } = await _intializeContract(signer);
      const transaction = await contract.repay(
        formattedCompanyAccountId,
        formattedAmount,
        formatteduserAccountId,
        { gasLimit: 5000000 }
      );
      await transaction.wait();
    }
  }

  const InterestRateMode = {
    NONE: 0,
    VARIABLE: 1,
    STABLE: 2
};

  async function Borrow() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const nonce = await signer.getTransactionCount("latest");

      const formattedCompanyAccountId = ethers.utils.getAddress(companyAccountId);
      if (!amount || isNaN(amount)) {
        console.error('Invalid amount');
        return;
    }
    
      const formattedAmount = ethers.utils.parseEther(amount);

      const { contract } = await _intializeContract(signer);
    try {
      const transaction = await contract.borrow(
        formattedCompanyAccountId,
        formattedAmount,
        InterestRateMode.NONE,
        { 
          gasLimit: 5000000,
          nonce: nonce
        }
      );
      await transaction.wait();
    } catch (error) {
      console.error('Borrow Error', error);
    }
    }
  }

  async function fetchUserAccountData() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const { contract } = await _intializeContract(signer);
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const result = await contract.getUserAccountData(account);
            
            // 적절한 로그 메시지를 출력하기 위해 각 값을 분리합니다.
            const [
                totalLiquidityETH,
                totalCollateralETH,
                totalBorrowsETH,
                totalFeesETH,
                availableBorrowsETH,
                currentLiquidationThreshold,
                ltv,
                healthFactor
            ] = result;

            console.log("Total Liquidity ETH: ", totalLiquidityETH.toString());
            // 다른 값들에 대해서도 로그를 출력할 수 있습니다...

        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    // 이 부분은 함수 내부에서 정의되거나 할당되지 않았습니다.
    // 그러므로 이 로그 메시지를 출력하기 전에 해당 변수들이 적절하게 정의되어야 합니다.
    console.log("amount:", amount);
    console.log("userAccountId:", userAccountId);
    console.log("companyAccountId:", companyAccountId);
}



  return (
    <div className="App">
      <header className="App-header">
        <button onClick={_getUserAccountData}>get UserAccount data</button>
        <h1>{tokenData.name}</h1>
        {/* <h1>Reserve Status: {reserveIsActive ? 'Active' : 'Inactive'}</h1> */}

        <button onClick={fetchUserAccountData}>Get Balance</button>
        <button onClick={Repay}>Repay</button>
        <button onClick={Borrow}>Borrow</button>
        <input onChange={e => setUserAccountId(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setCompanyAccountId(e.target.value)} placeholder="Company ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <p> {amount && `${amount}만큼 `}
            {userAccountId && `${userAccountId}가 `}
            {companyAccountId && `${companyAccountId}로 송금했습니다`}
        </p>
      </header>
    </div>
  );
}

export default App;
