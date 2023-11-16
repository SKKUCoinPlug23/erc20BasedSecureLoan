// MetaMaskContext.js
import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const MetaMaskContext = createContext();

export const MetaMaskProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    // 다른 상태들도 필요하다면 여기에 추가

    useEffect(() => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            provider.send("eth_requestAccounts", [])
                .then(accounts => {
                    setAccount(accounts[0]);
                    // 다른 상태 설정
                })
                .catch(err => {
                    console.log(err);
                    // 에러 처리
                });
        }
    }, []);

    return (
        <MetaMaskContext.Provider value={{ account }}>
            {children}
        </MetaMaskContext.Provider>
    );
};
