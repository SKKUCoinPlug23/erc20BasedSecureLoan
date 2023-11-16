import Home from './pages/Home';
import Deposit_Page from "./pages/Deposit_Page";
import Deposit_Page_2 from "./pages/Deposit_Page_2";
import My_page from "./pages/My_page"
import LendBorrow_Page from "./pages/Lend & Borrow_Page"
import Lend_Lists_Page from "./pages/Lend_Lists_Page"
import Borrow_Lists_Page from "./pages/Borrow_Lists_Page"
import Lend_Proposal_Page from "./pages/Lend_Proposal_Page"
import Borrow_Proposal_Page from "./pages/Borrow_Proposal_Page"
import Liquidation_Lists_Page from "./pages/Liquidation_Lists_Page"
import My_Proposals from "./pages/My_Proposals"
import Homepage from "./pages/Homepage"
import My_Assets from "./pages/My_Assets"
import NFT_Page from "./pages/NFT_Page"
import { MetaMaskProvider } from './pages/MetaMaskContext';
import { useState, useEffect, useCallback } from "react";


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

  return (
  <MetaMaskProvider>
    <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/Deposit_Page" element={<Deposit_Page />}></Route>
          <Route path="/Deposit_Page_2" element={<Deposit_Page_2 />}></Route>
          <Route path="/My_page" element={<My_page />}></Route>
          <Route path="/Lend & Borrow_Page" element={<LendBorrow_Page />}></Route>
          <Route path="/Lend_Lists_Page" element={<Lend_Lists_Page />}></Route>
          <Route path="/Borrow_Lists_Page" element={<Borrow_Lists_Page />}></Route>
          <Route path="/Lend_Proposal_Page" element={<Lend_Proposal_Page />}></Route>
          <Route path="/Borrow_Proposal_Page" element={<Borrow_Proposal_Page />}></Route>
          <Route path="/Liquidation_Lists_Page" element={<Liquidation_Lists_Page />}></Route>
          <Route path="/My_Proposals" element={<My_Proposals />}></Route>
          <Route path="/My_Assets" element={<My_Assets />}></Route>
          <Route path="/My_Proposals" element={<My_Proposals />}></Route>
          <Route path="/NFT_Page" element={<NFT_Page />}></Route>


          
        </Routes>
    </div>
  </MetaMaskProvider>
  );
}
export default App;