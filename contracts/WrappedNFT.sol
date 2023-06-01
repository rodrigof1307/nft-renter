// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./GenericRentHolder.sol";

/**
 * @title An NFT that meant to mimic the metadata of an NFT that is being rented on the platform
 * @author Rodrigo Fernandes
 * @notice This contract is used to mint NFTs with the metadata of non-collateralized rentals. It also provides a function to check if the owner
 * of the NFT is a valid renter of the rental contract that the NFT represents
 */
contract WrappedNFT is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  // State variables
  Counters.Counter private _tokenIdCounter;
  mapping(uint256 => address) public tokenIDtoRentHolderSC;

  // Constructor
  constructor() ERC721("Wrapped NFT - NFT Renter", "NFTR") {}

  // External functions
  /**
   * @notice This function mints an NFT with the metadata of a non-collateralized rental
   * @param to the address of the renter
   * @param uri the URI of the NFT that is being rented
   */
  function safeMint(address to, string memory uri) external {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    tokenIDtoRentHolderSC[tokenId] = msg.sender;
  }

  /**
   * Get the token URI of a given NFT
   * @param tokenId the ID of the NFT that is being checked
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

  // Public functions
  /**
   * @notice This function returns the number of NFTs that were minted
   */
  function count() public view returns (uint256) {
    return _tokenIdCounter.current();
  }

  /**
   * @notice This function checks if the owner of the NFT is a valid renter of the rental contract that the NFT represents
   * @param tokenId the ID of the NFT that is being checked
   */
  function isTokenIDOwnerValid(uint256 tokenId) public view returns (bool) {
    GenericRentHolder.CurrRenterInfo memory _currRenterInfo = GenericRentHolder(payable(tokenIDtoRentHolderSC[tokenId]))
      .getCurrRenterInfo();
    return _currRenterInfo.currRenter == ownerOf(tokenId) && _currRenterInfo.currRentEndDate > block.timestamp;
  }

  // Internal functions
  /**
   * @notice This function is used to set the base URI of the NFTs
   */
  function _baseURI() internal pure override returns (string memory) {
    return "";
  }

  /**
   * @notice This function is used to burn an NFT
   * @param tokenId the ID of the NFT that is being burned
   */
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }
}
