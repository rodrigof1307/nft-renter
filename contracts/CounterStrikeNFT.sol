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

/**
 * @title A simple NFT collection Counter Strike skins
 * @author Rodrigo Fernandes
 * @notice This contract is meant to support the NFT collection of Counter Strike skins
 */
contract CounterStrikeNFT is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  // State variables
  Counters.Counter private _tokenIdCounter;
  mapping(string => uint8) private s_existingURIs;

  // Constructor
  constructor() ERC721("CounterStrike", "CSGO") {}

  // Internal Functions
  /**
   * @notice This function returns the base URI for the NFT collection
   */
  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://QmXhwaFTLVYZLr3KkqscnEvPvmDgqW3W8Hg9rH91dKCChY/";
  }

  /**
   * @notice This function is used to burn a NFT
   * @param tokenId the id of the NFT to be burned
   */
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  // Public Functions
  /**
   * @notice This function is used to check if a given URI is already owned by a NFT
   * @param uri the URI to be checked
   * @return boolean variable that is true if the URI is already owned by a NFT, false otherwise
   */
  function isContentOwned(string memory uri) public view returns (bool) {
    return s_existingURIs[uri] == 1;
  }

  /**
   * @notice This function is used to get the total number of NFTs minted
   * @return the total number of NFTs minted
   */
  function count() public view returns (uint256) {
    return _tokenIdCounter.current();
  }

  /**
   * @notice This function is used to mint a new NFT
   * @param recipient the address of the recipient of the NFT
   * @return the id of the newly minted NFT
   */
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

  /**
   * @notice This function is used to get the URI of a given NFT
   * @param tokenId the id of the NFT whose URI is to be returned
   */
  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  /**
   * @notice This function is used to check if a given interface is supported by the contract
   * @param interfaceId the ID of the interface that is being checked
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  // External Functions - OnlyOwner
  /**
   * @notice This function is used to mint a new NFT for free and can only be called by the owner of the contract
   * @param recipient the address of the recipient of the NFT
   * @return the id of the newly minted NFT
   */
  function safeMint(address recipient) external onlyOwner returns (uint256) {
    uint256 newItemId = _tokenIdCounter.current();
    string memory metadataURI = string(abi.encodePacked("skin", Strings.toString(newItemId + 1), ".json"));

    if (newItemId > 38) {
      revert CounterStrikeNFT__MaxSupplyReached();
    }
    if (s_existingURIs[metadataURI] == 1) {
      revert CounterStrikeNFT__NFTAlreadyMinted();
    }

    _tokenIdCounter.increment();
    s_existingURIs[metadataURI] = 1;

    _safeMint(recipient, newItemId);
    _setTokenURI(newItemId, metadataURI);

    return newItemId;
  }

  /**
   * @notice This function is used to withdraw the funds of the contract and can only be called by the owner of the contract
   */
  function withdraw() external onlyOwner {
    uint256 balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }
}
