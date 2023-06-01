// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./GenericRentHolder.sol";

/* Errors */
error CollateralizedRentHolder__UnsufficientValue(
  uint _paidValue,
  uint _hours,
  uint _ratePerHour,
  uint _collateralValue
);
error CollateralizedRentHolder__RentalPeriodNotOver(uint _blockTimestamp, uint _currRentEndDate);
error CollateralizedRentHolder__NFTNotOwnedByContract(address _currNFTOwner);
error CollateralizedRentHolder__CollateralAlreadyWithdrawn();
error CollateralizedRentHolder__NFTOwnedByContract();

/**
 * @title An escrow contract for collateralized rents of NFTs
 * @author Rodrigo Fernandes
 * @notice This contract holds and manages the collateralized rental of NFTs, supporting rental, withdrawal and return functionalities
 */
contract CollateralizedRentHolder is GenericRentHolder {
  // Events
  event NFTReturned(address nftOwner, address indexed nftAddress, uint indexed nftID);

  event NFTCollateralClaimed(address nftOwner, address indexed nftAddress, uint indexed nftID);

  // Constructor
  constructor(
    address _nftAddress,
    uint _nftID,
    uint _ratePerHour,
    uint _collateralValue,
    address _marketplaceAddress
  ) GenericRentHolder(_nftAddress, _nftID, _ratePerHour, _collateralValue, _marketplaceAddress) {}

  // External Functions
  /**
   * @notice This function handles the rental of the NFT for a given amount of hours. It saves the collateral value and transfer the NFT to the renter
   * @param _hours The amount of hours the NFT will be rented for
   */
  function rent(uint8 _hours) external payable override {
    if (msg.value < s_ratePerHour * _hours + s_collateralValue) {
      revert CollateralizedRentHolder__UnsufficientValue(msg.value, _hours, s_ratePerHour, s_collateralValue);
    }
    if (block.timestamp < s_currRentEndDate) {
      revert CollateralizedRentHolder__RentalPeriodNotOver(block.timestamp, s_currRentEndDate);
    }

    ERC721 nftContract = ERC721(i_nftAddress);
    address currNFTOwner = nftContract.ownerOf(i_nftId);

    if (currNFTOwner != address(this)) {
      revert CollateralizedRentHolder__NFTNotOwnedByContract(currNFTOwner);
    }

    processOwnerPayment(s_ratePerHour * _hours);

    s_currRenter = msg.sender;
    s_currRentEndDate = block.timestamp + _hours * 1 hours;
    s_currRentPeriod = _hours;
    nftContract.transferFrom(address(this), msg.sender, i_nftId);

    emit NFTRented(i_nftOwner, i_nftAddress, i_nftId, s_currRenter, s_currRentEndDate, s_currRentPeriod);
  }

  /**
   * @notice This function allows the renter to return the NFT and withdraw the collateral if the
   * owner has not withdrawn the collateral yet.
   */
  function returnNFT() external onlyRenter {
    if (address(this).balance < s_collateralValue) {
      revert CollateralizedRentHolder__CollateralAlreadyWithdrawn();
    }

    ERC721 nftContract = ERC721(i_nftAddress);

    s_currRenter = address(0);
    s_currRentEndDate = 0;
    s_currRentPeriod = 0;
    nftContract.transferFrom(msg.sender, address(this), i_nftId);
    payable(s_currRenter).transfer(s_collateralValue);

    emit NFTReturned(i_nftOwner, i_nftAddress, i_nftId);
  }

  /**
   * @notice This function allows the owner to claim the collateral if the rental period is over and
   * the renter has not returned the NFT yet.
   */
  function claimCollateral() external onlyOwner {
    if (block.timestamp < s_currRentEndDate) {
      revert CollateralizedRentHolder__RentalPeriodNotOver(block.timestamp, s_currRentEndDate);
    }

    ERC721 nftContract = ERC721(i_nftAddress);
    address currNFTOwner = nftContract.ownerOf(i_nftId);

    if (currNFTOwner == address(this)) {
      revert CollateralizedRentHolder__NFTOwnedByContract();
    }
    if (address(this).balance < s_collateralValue) {
      revert CollateralizedRentHolder__CollateralAlreadyWithdrawn();
    }

    payable(i_nftOwner).transfer(s_collateralValue);

    MarketplaceTracker marketplace = MarketplaceTracker(i_marketplaceAddress);
    marketplace.removeCollateralizedRentSC();

    emit NFTCollateralClaimed(i_nftOwner, i_nftAddress, i_nftId);
  }
}
