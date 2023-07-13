// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

contract LendingBoardNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // mapping for NFT TokenID -> metadata structure
    mapping(uint256 => LendingBoardNFT.metadata) public nftMetadata;

    struct metadata {
        address borrower;
        uint256 amount;
        uint256 dueDate;
        uint256 contractTimestamp;
        uint256 interestRate;
        uint256 paybackAmount;
    }

    constructor() ERC721("NFT Bond", "NFTB") {}

    function mintNFT(
        address _recipient
    )
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_recipient, newItemId);
        // _setTokenURI(newItemId, _metadata);

        return newItemId;
    }

    function burnNFT(uint256 tokenId) public {
        _burn(tokenId);
    }

    function setNFTmetadatas(
        uint256 _proposalId, 
        address _borrower, 
        uint256 _amount,
        uint256 _dueDate,
        uint256 _contractTimestamp,
        uint256 _interestRate,
        uint256 _paybackAmount
    ) 
        public 
    {
        // add new mapping
        nftMetadata[_proposalId] = metadata(
            _borrower, 
            _amount, 
            _dueDate, 
            _contractTimestamp, 
            _interestRate, 
            _paybackAmount
        );
    }

    function getNFTmetadatas(uint256 _proposalId) public view returns (metadata memory) {
        return nftMetadata[_proposalId - 1];
    }
}