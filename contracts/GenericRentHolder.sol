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

/**
 * @title A generic template for the escrow contract to aid NFT rentals
 * @author Rodrigo Fernandes
 * @notice This contract supports the basic setup and functionalities of an escrow contract for NFT rentals, considering both collateralized and non-collateralized rents
 * @dev This contract is abstract and should be inherited by other contracts to create a completely functional rental escrow contract
 */
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
    // This information is retrieved from the MarketplaceTracker contract
    i_wrappedCollectionAddress = MarketplaceTracker(_marketplaceAddress).getWrappedCollectionAddress();
    (i_feeCollector, i_feePercentage) = MarketplaceTracker(_marketplaceAddress).getFeeInfo();
  }

  // Internal functions
  /**
   * @notice This function processes payments regarding the rental service. On every payment the fee collector receives the fee percentage and the NFT
   * owner receives the rest
   * @param _totalPaymentValue The total value to be processed
   */
  function processOwnerPayment(uint _totalPaymentValue) internal {
    if (_totalPaymentValue > address(this).balance) {
      revert GenericRentHolder__WithdrawValueGreaterThanContractBalance(_totalPaymentValue, address(this).balance);
    }
    payable(i_feeCollector).transfer((_totalPaymentValue * i_feePercentage) / 100);
    payable(i_nftOwner).transfer((_totalPaymentValue * (100 - i_feePercentage)) / 100);
  }

  // Public functions
  /**
   * @notice this function returns the current account that is actually owning the NFT
   */
  function getCurrentNFTOwner() public view returns (address) {
    ERC721 nftContract = ERC721(i_nftAddress);
    address currNFTOwner = nftContract.ownerOf(i_nftId);
    return currNFTOwner;
  }

  // External functions
  receive() external payable {}

  /**
   * @notice This function publishes the NFT to be rented by transfering it to the escrow contract and updating the MarketplaceTracker contract
   */
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

  /**
   * @notice This function will perform the rental action
   * @param _hours The number of hours to rent the NFT
   * @dev This function is virtual and should be overriden by the inheriting contract in order to tailor it to the type of rental
   */
  function rent(uint8 _hours) external payable virtual {}

  /**
   * @notice This function withdraws the NFT from the escrow contract to the owner and updates the MarketplaceTracker contract
   */
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

  /**
   * @notice This function changes the rental values
   * @param _newRatePerHour The new rate per hour
   * @param _newCollateralValue The new collateral value
   */
  function changeRentalValues(uint _newRatePerHour, uint _newCollateralValue) external onlyOwner {
    s_ratePerHour = _newRatePerHour;
    s_collateralValue = _newCollateralValue;

    emit NFTRentalValuesChanged(i_nftOwner, i_nftAddress, i_nftId, s_ratePerHour, s_collateralValue);
  }

  /**
   * @notice This function returns the important information about a given rental contract
   * @return The relevant rental information
   */
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

  /**
   * @notice This function returns the current renter and the current rent end date
   * @return The current renter and the current rent end date
   */
  function getCurrRenterInfo() external view returns (CurrRenterInfo memory) {
    return CurrRenterInfo(s_currRenter, s_currRentEndDate);
  }

  // Modifiers
  /**
   * @notice This modifier checks if the caller is the original NFT owner
   */
  modifier onlyOwner() {
    if (msg.sender != i_nftOwner) {
      revert GenericRentHolder__OnlyOwnerCanCall();
    }
    _;
  }

  /**
   * @notice This modifier checks if the caller is user that is currently renting the NFT
   */
  modifier onlyRenter() {
    if (msg.sender != s_currRenter) {
      revert GenericRentHolder__OnlyRenterCanCall();
    }
    _;
  }
}
