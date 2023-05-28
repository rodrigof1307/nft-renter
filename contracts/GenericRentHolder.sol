// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./MarketplaceTracker.sol";
import "./WrappedNFT.sol";

/* Errors */
error GenericRentHolder__RatePerHourNotGreaterThanZero();
error GenericRentHolder__WithdrawValueGreaterThanContractBalance(uint _withdrawValue, uint _contractBalance);
error GenericRentHolder__RentalPeriodNotOver(uint _blockTimestamp, uint _currRentEndDate);
error GenericRentHolder__NFTNotOwnedByContract(address _currNFTOwner);
error GenericRentHolder__OnlyOwnerCanCall();
error GenericRentHolder__OnlyRenterCanCall();

abstract contract GenericRentHolder {
  //Events
  event NFTPublished(
    address nftOwner,
    address indexed nftAddress,
    uint indexed nftID,
    uint s_ratePerHour,
    uint s_collateralValue
  );

  event NFTRented(
    address nftOwner,
    address indexed nftAddress,
    uint indexed nftID,
    address indexed currRenter,
    uint currRentEndDate,
    uint currRentPeriod
  );

  event NFTWithdrawn(
    address nftOwner,
    address indexed nftAddress,
    uint indexed nftID,
    uint s_ratePerHour,
    uint s_collateralValue
  );

  event NFTRentalValuesChanged(
    address nftOwner,
    address indexed nftAddress,
    uint indexed nftID,
    uint s_ratePerHour,
    uint s_collateralValue
  );

  // State variables
  address internal immutable i_nftOwner;
  address internal immutable i_nftAddress;
  uint internal immutable i_nftId;

  uint internal s_ratePerHour;
  uint internal s_collateralValue;

  address internal s_currRenter;
  uint internal s_currRentEndDate;
  uint internal s_currRentPeriod;

  address internal i_marketplaceAddress;
  address internal i_wrappedCollectionAddress;

  address private immutable i_feeCollector;
  uint private immutable i_feePercentage;

  // Structs
  struct RelevantRentInfo {
    address rentHolderSC;
    address nftOwner;
    address nftAddress;
    uint nftId;
    uint ratePerHour;
    uint collateralValue;
    address currRenter;
    uint currRentEndDate;
    uint currRentPeriod;
  }

  struct CurrRenterInfo {
    address currRenter;
    uint currRentEndDate;
  }

  // Constructor
  constructor(address _nftAddress, uint _nftID, uint _ratePerHour, uint _collateralValue, address _marketplaceAddress) {
    if (_ratePerHour <= 0) {
      revert GenericRentHolder__RatePerHourNotGreaterThanZero();
    }

    i_nftOwner = msg.sender;
    i_nftAddress = _nftAddress;
    i_nftId = _nftID;
    s_ratePerHour = _ratePerHour;
    s_collateralValue = _collateralValue;
    i_marketplaceAddress = _marketplaceAddress;
    i_wrappedCollectionAddress = MarketplaceTracker(_marketplaceAddress).getWrappedCollectionAddress();
    (i_feeCollector, i_feePercentage) = MarketplaceTracker(_marketplaceAddress).getFeeInfo();
  }

  // Internal functions
  function processOwnerPayment(uint _totalValue) internal {
    if (_totalValue > address(this).balance) {
      revert GenericRentHolder__WithdrawValueGreaterThanContractBalance(_totalValue, address(this).balance);
    }
    payable(i_feeCollector).transfer((_totalValue * i_feePercentage) / 100);
    payable(i_nftOwner).transfer((_totalValue * (100 - i_feePercentage)) / 100);
  }

  // Public functions
  function getCurrentNFTOwner() public view returns (address) {
    ERC721 nftContract = ERC721(i_nftAddress);
    address currNFTOwner = nftContract.ownerOf(i_nftId);
    return currNFTOwner;
  }

  // External functions
  receive() external payable {}

  function publishNFT() external {
    ERC721 token = ERC721(i_nftAddress);
    token.transferFrom(i_nftOwner, address(this), i_nftId);

    MarketplaceTracker marketplaceTracker = MarketplaceTracker(i_marketplaceAddress);
    if (s_collateralValue > 0) {
      marketplaceTracker.addCollateralizedRentHolderSC();
    } else {
      marketplaceTracker.addNonCollateralizedRentHolderSC();
    }

    emit NFTPublished(i_nftOwner, i_nftAddress, i_nftId, s_ratePerHour, s_collateralValue);
  }

  function rent(uint8 _hours) external payable virtual {}

  function withdrawNFT() external onlyOwner {
    if (block.timestamp < s_currRentEndDate) {
      revert GenericRentHolder__RentalPeriodNotOver(block.timestamp, s_currRentEndDate);
    }
    ERC721 nftContract = ERC721(i_nftAddress);
    address currNFTOwner = nftContract.ownerOf(i_nftId);
    if (currNFTOwner != address(this)) {
      revert GenericRentHolder__NFTNotOwnedByContract(currNFTOwner);
    }

    nftContract.transferFrom(address(this), i_nftOwner, i_nftId);

    MarketplaceTracker marketplaceTracker = MarketplaceTracker(i_marketplaceAddress);
    if (s_collateralValue > 0) {
      marketplaceTracker.removeCollateralizedRentSC();
    } else {
      marketplaceTracker.removeNonCollateralizedRentSC();
    }

    emit NFTWithdrawn(i_nftOwner, i_nftAddress, i_nftId, s_ratePerHour, s_collateralValue);
  }

  function changeRentalValues(uint _newRatePerHour, uint _newCollateralValue) external onlyOwner {
    s_ratePerHour = _newRatePerHour;
    s_collateralValue = _newCollateralValue;

    emit NFTRentalValuesChanged(i_nftOwner, i_nftAddress, i_nftId, s_ratePerHour, s_collateralValue);
  }

  function getRentInfo() external view returns (RelevantRentInfo memory) {
    return
      RelevantRentInfo(
        address(this),
        i_nftOwner,
        i_nftAddress,
        i_nftId,
        s_ratePerHour,
        s_collateralValue,
        s_currRenter,
        s_currRentEndDate,
        s_currRentPeriod
      );
  }

  function getCurrRenterInfo() external view returns (CurrRenterInfo memory) {
    return CurrRenterInfo(s_currRenter, s_currRentEndDate);
  }

  // Modifiers
  modifier onlyOwner() {
    if (msg.sender != i_nftOwner) {
      revert GenericRentHolder__OnlyOwnerCanCall();
    }
    _;
  }

  modifier onlyRenter() {
    if (msg.sender != s_currRenter) {
      revert GenericRentHolder__OnlyRenterCanCall();
    }
    _;
  }
}
