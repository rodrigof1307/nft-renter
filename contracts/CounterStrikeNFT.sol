// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/* Errors */
error CounterStrikeNFT__MaxSupplyReached();
error CounterStrikeNFT__NFTAlreadyMinted();
error CounterStrikeNFT__NeedToPayUp();

contract CounterStrikeNFT is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  // State variables
  Counters.Counter private _tokenIdCounter;
  mapping(string => uint8) private s_existingURIs;

  // Constructor
  constructor() ERC721("CounterStrike", "CSGO") {}

  // Internal Functions
  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://QmXhwaFTLVYZLr3KkqscnEvPvmDgqW3W8Hg9rH91dKCChY/";
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  // Public Functions
  function isContentOwned(string memory uri) public view returns (bool) {
    return s_existingURIs[uri] == 1;
  }

  function count() public view returns (uint256) {
    return _tokenIdCounter.current();
  }

  function payToMint(address recipient) public payable returns (uint256) {
    uint256 newItemId = _tokenIdCounter.current();
    string memory metadataURI = string(abi.encodePacked("skin", Strings.toString(newItemId + 1), ".json"));

    if (newItemId > 38) {
      revert CounterStrikeNFT__MaxSupplyReached();
    }
    if (s_existingURIs[metadataURI] == 1) {
      revert CounterStrikeNFT__NFTAlreadyMinted();
    }
    if (msg.value < 0.01 ether) {
      revert CounterStrikeNFT__NeedToPayUp();
    }

    _tokenIdCounter.increment();
    s_existingURIs[metadataURI] = 1;

    _mint(recipient, newItemId);
    _setTokenURI(newItemId, metadataURI);

    return newItemId;
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  // External Functions - OnlyOwner
  function safeMint(address to, string memory uri) external onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    s_existingURIs[uri] = 1;
  }

  function withdraw() external onlyOwner {
    uint256 balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }
}
