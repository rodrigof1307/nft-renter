// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface IRentHolder{
    struct relevantRentInfo {
        address rentHolderSC;
        address nftOwner;
        address nftAddress;
        uint nftId;
        uint pricePerDay;
        uint ownerPenalty;
        uint renterPenalty;
        uint expirationDate;

        address currRenter;
        uint currRentEndDate;
    }

    function returnRentInfo() external view returns(relevantRentInfo memory);
}

//This contract is used to hold an NFT and manage the rental of it
contract MarketplaceTracker {
    address[] public rentSCs;

    function addRentSC() external {
        rentSCs.push(msg.sender);
    }

    function getRentSCs() external view returns (IRentHolder.relevantRentInfo[] memory) {
        IRentHolder.relevantRentInfo[] memory rentInfoArray = new IRentHolder.relevantRentInfo[](rentSCs.length);
        for(uint i = 0; i < rentSCs.length; i++){
            IRentHolder.relevantRentInfo memory rentInfo = IRentHolder(rentSCs[i]).returnRentInfo();
            rentInfoArray[i] = rentInfo;
        }
        return rentInfoArray;
    }

    function removeRentSC() external {
        for(uint i = 0; i < rentSCs.length; i++){
            if(rentSCs[i] == msg.sender){
                rentSCs[i] = rentSCs[rentSCs.length - 1];
                rentSCs.pop();
                break;
            }
        }
    }
}

