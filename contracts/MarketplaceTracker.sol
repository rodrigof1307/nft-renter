// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./GenericRentHolder.sol";

/**
 * @title This contract is used to track the rentals on the marketplace
 * @author Rodrigo Fernandes
 * @notice This contract supports the addition, removal and listing of rental contracts
 */
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
  /**
   * @notice This function handles the removal of the rent contract that called the funtion from a list of rent contracts
   * @param _rentHolderSCs the array from which the rent contract that called this function will be removed
   */
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

  /**
   * @notice This function comapres if two strings are equal
   * @param _a one of the strings to be compared
   * @param _b the other string to be compared
   * @return true if the strings are equal, false otherwise
   */
  function _compareStrings(string memory _a, string memory _b) internal pure returns (bool) {
    return (keccak256(abi.encodePacked((_a))) == keccak256(abi.encodePacked((_b))));
  }

  /**
   * @notice This function provides a filter to decide if a given rent contract should be considered or not
   * @param _rentInfo the rent contract to be considered or not
   * @param _mode the mode under analysis. "lented" and "rented" have special considerations while other strings are treated as default
   * @param _collateralized a boolean indicating if the rent contract is collateralized or not
   * @param _actor the address of an actor that is under consideration to decide if the rent contract should be considered or not
   * @return true if the rent contract should be considered, false otherwise
   */
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

  /**
   * @notice This function lists the relevant information of the rent contracts
   * @param _collateralized a boolean indicating if the collateralized rent contracts should be considered or not
   * @param _nonCollateralized a boolean indicating if the non collateralized rent contracts should be considered or not
   * @param _mode the mode under analysis. "lented" and "rented" have special considerations while other strings are treated as default
   * @param _actor the address of an actor that is under consideration to decide if the rent contract should be considered or not
   * @return array of RelevantRentInfo structs who have passed the filter conditions
   */
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
  /**
   * @notice This function returns relevant information about the fee dynamic
   * @return The fee collector address and the fee percentage
   */
  function getFeeInfo() external view returns (address, uint) {
    return (i_feeCollector, i_feePercentage);
  }

  /**
   * @notice This function returns relevant information about the wrapped collection that is used on the non collateralized rentals
   * @return The wrapped collection address
   */
  function getWrappedCollectionAddress() external view returns (address) {
    return i_wrappedCollectionAddress;
  }

  /**
   * @notice This function adds the calling contract to the list of collateralized rent contracts
   */
  function addCollateralizedRentHolderSC() external {
    s_collateralizedRentHolderSCs.push(msg.sender);
  }

  /**
   * @notice This function adds the calling contract to the list of non collateralized rent contracts
   */
  function addNonCollateralizedRentHolderSC() external {
    s_nonCollateralizedRentHolderSCs.push(msg.sender);
  }

  /**
   * @notice This function removes the calling contract from the list of collateralized rent contracts
   */
  function removeCollateralizedRentSC() external {
    _removeRentHolder(s_collateralizedRentHolderSCs);
  }

  /**
   * @notice This function removes the calling contract from the list of non collateralized rent contracts
   */
  function removeNonCollateralizedRentSC() external {
    _removeRentHolder(s_nonCollateralizedRentHolderSCs);
  }

  /**
   * @notice This function lists the relevant information of all the rent contracts that are lented by the caller
   * @return array of RelevantRentInfo structs who are lented by the caller
   */
  function listLentedRelevantInfo(address _lenter) external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(true, true, "lented", _lenter);
  }

  /**
   * @notice This function lists the relevant information of all the rent contracts that are rented by the caller
   * @return array of RelevantRentInfo structs who are rented by the caller
   */
  function listRentedRelevantInfo(address _renter) external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(true, true, "rented", _renter);
  }

  /**
   * @notice This function lists the relevant information of all rent contracts that are collateralized
   * @return array of RelevantRentInfo structs which are collateralized
   */
  function listAllCollateralizedRelevantInfo() external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(true, false, "none", address(0));
  }

  /**
   * @notice This function lists the relevant information of all rent contracts that are not collateralized
   * @return array of RelevantRentInfo structs which are not collateralized
   */
  function listAllNonCollateralizedRelevantInfo() external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(false, true, "none", address(0));
  }

  /**
   * @notice This function lists the relevant information of all rent contracts
   * @return array of all RelevantRentInfo structs which are on the marketplace
   */
  function listAllRelevantInfo() external view returns (GenericRentHolder.RelevantRentInfo[] memory) {
    return _listRelevantInfo(true, true, "none", address(0));
  }
}
