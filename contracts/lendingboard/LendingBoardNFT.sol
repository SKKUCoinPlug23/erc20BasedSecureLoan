// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "hardhat/console.sol";

contract LendingBoardNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct Metadata {
        uint256 proposalId;
        address borrower;
        uint256 amount;
        uint256 dueDate;
        uint256 contractTimestamp;
        uint256 interestRate;
        uint256 paybackAmount;
    }

    // mapping for NFT TokenID -> metadata structure
    mapping(uint256 => Metadata) public mappedNFT;

    constructor() ERC721("NFT Bond", "NFTB") {}

    function mintNFT(
        address _recipient,
        uint256 _proposalId, 
        address _borrower, 
        uint256 _amount,
        uint256 _dueDate,
        uint256 _contractTimestamp,
        uint256 _interestRate,
        uint256 _paybackAmount
    )
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(_recipient, newItemId);
        setMetadataAndmappingNFTWithMetadata(
            newItemId, 
            _proposalId, 
            _borrower, 
            _amount, 
            _dueDate, 
            _contractTimestamp, 
            _interestRate, 
            _paybackAmount
        );

        return newItemId;
    }

    function burnNFT(uint256 tokenId) public {
        _burn(tokenId);
    }

    function setMetadataAndmappingNFTWithMetadata(
        uint256 _tokenId,
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
        mappedNFT[_tokenId] = Metadata(
            _proposalId,
            _borrower, 
            _amount, 
            _dueDate, 
            _contractTimestamp, 
            _interestRate, 
            _paybackAmount
        );
    }

    function getNFTmetadata(uint256 _tokenId) public view returns (Metadata memory) {
        return mappedNFT[_tokenId];
    }

    // Overriding ERC721Enumerable
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer( // have to be modified
        address from, 
        address to, 
        uint256 firstTokenId, 
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _afterTokenTransfer( // have to be modified
        address from, 
        address to, 
        uint256 firstTokenId, 
        uint256 batchSize
    ) internal virtual override {
        super._afterTokenTransfer(from, to, firstTokenId, batchSize);
    }
}

/**
  * Updates
 */
// 2023.07.13
// - ERC721Enumerable 을 사용하기 위하여 Overriding