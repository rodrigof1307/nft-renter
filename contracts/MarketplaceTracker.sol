// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface INonCollateralizedRentHolder {
    struct relevantRentInfo {
        address rentHolderSC;
        address nftOwner;
        address nftAddress;
        uint nftId;
        uint ratePerHour;

        address currRenter;
        uint currRentEndDate;
    }

    function returnRentInfo() external view returns(relevantRentInfo memory);
}

interface ICollateralizedRentHolder {
    struct relevantRentInfo {
        address rentHolderSC;
        address nftOwner;
        address nftAddress;
        uint nftId;
        uint ratePerHour;
        uint collateral;

        address currRenter;
        uint currRentEndDate;
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

    function getCollateralizedRentRelevantInfo() external view returns(ICollateralizedRentHolder.relevantRentInfo[] memory) {
        ICollateralizedRentHolder.relevantRentInfo[] memory rentInfoArray = new ICollateralizedRentHolder.relevantRentInfo[](collateralizedRentHolderSCs.length);
        for(uint i = 0; i < collateralizedRentHolderSCs.length; i++){
            ICollateralizedRentHolder.relevantRentInfo memory rentInfo = ICollateralizedRentHolder(collateralizedRentHolderSCs[i]).returnRentInfo();
            rentInfoArray[i] = rentInfo;
        }
        return rentInfoArray;
    }

    function getNonCollateralizedRentRelevantInfo() external view returns(INonCollateralizedRentHolder.relevantRentInfo[] memory) {
        INonCollateralizedRentHolder.relevantRentInfo[] memory rentInfoArray = new INonCollateralizedRentHolder.relevantRentInfo[](nonCollateralizedRentHolderSCs.length);
        for(uint i = 0; i < nonCollateralizedRentHolderSCs.length; i++){
            INonCollateralizedRentHolder.relevantRentInfo memory rentInfo = INonCollateralizedRentHolder(nonCollateralizedRentHolderSCs[i]).returnRentInfo();
            rentInfoArray[i] = rentInfo;
        }
        return rentInfoArray;
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

}

