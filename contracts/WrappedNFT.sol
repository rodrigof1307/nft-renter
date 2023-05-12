// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IRentHolder {
    struct currRenterInfo {
        address currRenter;
        uint currRentEndDate;
    }

    function returnCurrRenterInfo() external view returns(currRenterInfo memory);
}

contract WrappedNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => address) public tokenIDtoRentHolderSC;

    constructor() ERC721("Wrapped NFT - NFT Renter", "NFTR") {}

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function safeMint(address to, string memory uri) external {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        tokenIDtoRentHolderSC[tokenId] = msg.sender;
    }

    // The following functions are overrides required by Solidity.
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function isTokenIDOwnerValid (uint256 tokenId) public view returns (bool) {
        IRentHolder.currRenterInfo memory _currRenterInfo = IRentHolder(tokenIDtoRentHolderSC[tokenId]).returnCurrRenterInfo();
        return _currRenterInfo.currRenter == ownerOf(tokenId) && _currRenterInfo.currRentEndDate > block.timestamp;
    }
}
