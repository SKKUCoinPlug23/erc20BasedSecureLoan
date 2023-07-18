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
        _tokenIds.increment();                      // tokenId starts from 1
        uint256 newItemId = _tokenIds.current();
        
        _mint(_recipient, newItemId);               // mint NFT
        setMetadataAndmappingNFTWithMetadata(       // set metadata and mapping
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

    function getUserTokenList(address _user) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_user);
        uint256[] memory result = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++)
            result[i] = tokenOfOwnerByIndex(_user, i);

        return result;
    }

    function getNFTmetadata(uint256 _tokenId) public view returns (Metadata memory) {
        return mappedNFT[_tokenId];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override(ERC721Enumerable) returns (uint256) {
        return super.tokenOfOwnerByIndex(owner, index);
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

// Updates
// 2023.07.13
// - ERC721Enumerable 을 사용하기 위하여 Overriding
// - User의 토큰 리스트를 받아오기 위하여 getUserTokenList 함수 추가

// Enumerable.sol 을 inherit 하였으므로...
// Token Transfer가 일어날 때 마다 _beforeTokenTransfer, _afterTokenTransfer hook 발동
// 자동적으로 mapping이 수정되어 소유자를 관리할 수 있음
// repay에서는 LendingBoardNFT의 받아온 tokenId를 이용하여 ownerOf로써 소유자를 확인하고,
// 해당 소유자의 주소로 repay를 진행

// 이후에 Service 에서 NFT 거래까지 담당한다면 _transfer 를 이용하여
// 기존의 _beforeTokenTransfer, _afterTokenTransfer hook을 발동시켜 관리할 수 있음