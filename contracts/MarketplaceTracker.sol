// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./GenericRentHolder.sol";

contract MarketplaceTracker {
  // State Variables
  address private immutable i_feeCollector;
  uint private immutable i_feePercentage;
  address private immutable i_wrappedCollectionAddress;

  address[] private s_collateralizedRentHolderSCs;
  address[] private s_nonCollateralizedRentHolderSCs;

  // Constructor
  constructor(uint _feePercentage, address _wrappedCollectionAddress) {
    i_feeCollector = msg.sender;
    i_feePercentage = _feePercentage;
    i_wrappedCollectionAddress = _wrappedCollectionAddress;
  }

  // Internal & Private Functions
  function _removeRentHolder(address[] storage _rentHolderSCs) internal {
    uint length = _rentHolderSCs.length;
    for (uint i = 0; i < length; i++) {
      if (_rentHolderSCs[i] == msg.sender) {
        _rentHolderSCs[i] = _rentHolderSCs[length - 1];
        _rentHolderSCs.pop();
        break;
      }
    }
  }

  function _compareStrings(string memory _a, string memory _b) internal pure returns (bool) {
    return (keccak256(abi.encodePacked((_a))) == keccak256(abi.encodePacked((_b))));
  }

  function _listRelevantInfoHelperFilter(
    GenericRentHolder.RelevantRentInfo memory _rentInfo,
    string memory _mode,
    bool _collateralized,
    address _actor
  ) internal view returns (bool) {
    if (_compareStrings(_mode, "lented")) {
      return _rentInfo.nftOwner == _actor;
    } else if (_compareStrings(_mode, "rented") && !_collateralized) {
      return _rentInfo.currRenter == _actor && _rentInfo.currRentEndDate > block.timestamp;
    } else if (_compareStrings(_mode, "rented") && _collateralized) {
      return _rentInfo.currRenter == _actor;
    } else {
      return true;
    }
  }

  function _listRelevantInfo(
    bool _collateralized,
    bool _nonCollateralized,
    string memory _mode,
    address _actor
  ) internal view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    GenericRentHolder.RelevantRentInfo[] memory helperRentInfoArray = new GenericRentHolder.RelevantRentInfo[](
      s_collateralizedRentHolderSCs.length + s_nonCollateralizedRentHolderSCs.length
    );
    uint count = 0;
    if (_collateralized) {
      uint collateralizedLength = s_collateralizedRentHolderSCs.length;
      for (uint i = 0; i < collateralizedLength; i++) {
        GenericRentHolder.RelevantRentInfo memory rentInfo = GenericRentHolder(
          payable(s_collateralizedRentHolderSCs[i])
        ).getRentInfo();
        if (_listRelevantInfoHelperFilter(rentInfo, _mode, true, _actor)) {
          helperRentInfoArray[count] = rentInfo;
          count++;
        }
      }
    }
    if (_nonCollateralized) {
      uint nonCollateralizedLength = s_nonCollateralizedRentHolderSCs.length;
      for (uint i = 0; i < nonCollateralizedLength; i++) {
        GenericRentHolder.RelevantRentInfo memory rentInfo = GenericRentHolder(
          payable(s_nonCollateralizedRentHolderSCs[i])
        ).getRentInfo();
        if (_listRelevantInfoHelperFilter(rentInfo, _mode, false, _actor)) {
          helperRentInfoArray[count] = rentInfo;
          count++;
        }
      }
    }
    GenericRentHolder.RelevantRentInfo[] memory rentInfoArray = new GenericRentHolder.RelevantRentInfo[](count);
    for (uint i = 0; i < count; i++) {
      rentInfoArray[i] = helperRentInfoArray[i];
    }
    return rentInfoArray;
  }

  // External & Public Functions
  function getFeeInfo() external view returns (address, uint) {
    return (i_feeCollector, i_feePercentage);
  }

  function getWrappedCollectionAddress() external view returns (address) {
    return i_wrappedCollectionAddress;
  }

  function addCollateralizedRentHolderSC() external {
    s_collateralizedRentHolderSCs.push(msg.sender);
  }

  function addNonCollateralizedRentHolderSC() external {
    s_nonCollateralizedRentHolderSCs.push(msg.sender);
  }

  function removeCollateralizedRentSC() external {
    _removeRentHolder(s_collateralizedRentHolderSCs);
  }

  function removeNonCollateralizedRentSC() external {
    _removeRentHolder(s_nonCollateralizedRentHolderSCs);
  }

  function listLentedRelevantInfo(address _lenter) external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(true, true, "lented", _lenter);
  }

  function listRentedRelevantInfo(address _renter) external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(true, true, "rented", _renter);
  }

  function listAllCollateralizedRelevantInfo() external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(true, false, "none", address(0));
  }

  function listAllNonCollateralizedRelevantInfo() external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(false, true, "none", address(0));
  }

  function listAllRelevantInfo() external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(true, true, "none", address(0));
  }
}
