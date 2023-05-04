// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface IRentHolder {
    struct relevantRentInfo {
        address rentHolderSC;
        address nftOwner;
        address nftAddress;
        uint nftId;
        uint ratePerHour;
        uint collateral;

        address currRenter;
        uint currRentEndDate;
        uint currRentPeriod;
    }

    function returnRentInfo() external view returns(relevantRentInfo memory);
}

// This Smart contract keeps track of all the rent holder smart contracts
contract MarketplaceTracker {
    address[] public collateralizedRentHolderSCs;
    address[] public nonCollateralizedRentHolderSCs;

    function addCollateralizedRentHolderSC() external {
        collateralizedRentHolderSCs.push(msg.sender);
    }

    function addNonCollateralizedRentHolderSC() external {
        nonCollateralizedRentHolderSCs.push(msg.sender);
    }

    function _removeRentHolder(address[] storage rentHolderSCs) private {
        for(uint i = 0; i < rentHolderSCs.length; i++) {
            if(rentHolderSCs[i] == msg.sender) {
                rentHolderSCs[i] = rentHolderSCs[rentHolderSCs.length - 1];
                rentHolderSCs.pop();
                break;
            }
        }
    }

    function removeCollateralizedRentSC() external {
        _removeRentHolder(collateralizedRentHolderSCs);
    }

    function removeNonCollateralizedRentSC() external {
        _removeRentHolder(nonCollateralizedRentHolderSCs);
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function listRelevantInfoHelperFilter(IRentHolder.relevantRentInfo memory _rentInfo, string memory _mode, bool collateralized, address _actor) internal view returns(bool) {
        if(compareStrings(_mode,"lented")) {
            return _rentInfo.nftOwner == _actor;
        } else if(compareStrings(_mode,"rented") && !collateralized) {
            return _rentInfo.currRenter == _actor && _rentInfo.currRentEndDate > block.timestamp;
        } else if(compareStrings(_mode, "rented") && collateralized) {
            return _rentInfo.currRenter == _actor;
        } else {
            return true;
        }
    }

    function listRelevantInfo(bool _collateralized, bool _nonCollateralized, string memory _mode, address _actor) internal view returns(IRentHolder.relevantRentInfo[] memory) {
        IRentHolder.relevantRentInfo[] memory helperRentInfoArray = new IRentHolder.relevantRentInfo[](collateralizedRentHolderSCs.length + nonCollateralizedRentHolderSCs.length);
        uint count = 0;
        if(_collateralized) {
            for(uint i = 0; i < collateralizedRentHolderSCs.length; i++){
                IRentHolder.relevantRentInfo memory rentInfo = IRentHolder(collateralizedRentHolderSCs[i]).returnRentInfo();
                if(listRelevantInfoHelperFilter(rentInfo, _mode, true, _actor)) {
                    helperRentInfoArray[count] = rentInfo;
                    count++;
                }
            }
        }
        if(_nonCollateralized) {
            for(uint i = 0; i < nonCollateralizedRentHolderSCs.length; i++){
                IRentHolder.relevantRentInfo memory rentInfo = IRentHolder(nonCollateralizedRentHolderSCs[i]).returnRentInfo();
                if(listRelevantInfoHelperFilter(rentInfo, _mode, false, _actor)) {
                    helperRentInfoArray[count] = rentInfo;
                    count++;
                }
            }
        }
        IRentHolder.relevantRentInfo[] memory rentInfoArray = new IRentHolder.relevantRentInfo[](count);
        for(uint i = 0; i < count; i++) {
            rentInfoArray[uint(i)] = helperRentInfoArray[uint(i)];
        }
        return rentInfoArray;
    }

    function listLentedRelevantInfo( address _lenter ) external view returns(IRentHolder.relevantRentInfo[] memory) {
        return listRelevantInfo(true, true, "lented", _lenter);
    }

    function listRentedRelevantInfo( address _renter ) external view returns(IRentHolder.relevantRentInfo[] memory) {
        return listRelevantInfo(true, true, "rented", _renter);
    }

    function listAllCollateralizedRelevantInfo() external view returns(IRentHolder.relevantRentInfo[] memory) {
        return listRelevantInfo(true, false, "none", address(0));
    }

    function listAllNonCollateralizedRelevantInfo() external view returns(IRentHolder.relevantRentInfo[] memory) {
        return listRelevantInfo(false, true, "none", address(0));
    }

    function listAllRelevantInfo() external view returns(IRentHolder.relevantRentInfo[] memory) {
        return listRelevantInfo(true, true, "none", address(0));
    }
}

