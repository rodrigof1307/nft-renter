// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./GenericRentHolder.sol";

/* Errors */
error NonCollateralizedRentHolder__UnsufficientValue(uint _paidValue, uint _hours, uint _ratePerHour);
error NonCollateralizedRentHolder__RentalPeriodNotOver(uint _blockTimestamp, uint _currRentEndDate);

contract NonCollateralizedRentHolder is GenericRentHolder {
  // Constructor
  constructor(
    address _nftAddress,
    uint _nftID,
    uint _ratePerHour,
    address _marketplaceAddress
  ) GenericRentHolder(_nftAddress, _nftID, _ratePerHour, 0, _marketplaceAddress) {}

  // External & Public Functions
  function rent(uint8 _hours) external payable override {
    if (msg.value < s_ratePerHour * _hours) {
      revert NonCollateralizedRentHolder__UnsufficientValue(msg.value, _hours, s_ratePerHour);
    }
    if (block.timestamp < s_currRentEndDate) {
      revert NonCollateralizedRentHolder__RentalPeriodNotOver(block.timestamp, s_currRentEndDate);
    }
    processOwnerPayment(s_ratePerHour * _hours);
    s_currRenter = msg.sender;
    s_currRentEndDate = block.timestamp + _hours * 1 hours;
    s_currRentPeriod = _hours;
    ERC721 originalNFT = ERC721(i_nftAddress);
    string memory originalNFTuri = originalNFT.tokenURI(i_nftId);
    WrappedNFT wrappedNFTCollection = WrappedNFT(i_wrappedCollectionAddress);
    wrappedNFTCollection.safeMint(msg.sender, originalNFTuri);

    emit NFTRented(i_nftOwner, i_nftAddress, i_nftId, s_currRenter, s_currRentEndDate, s_currRentPeriod);
  }
}
