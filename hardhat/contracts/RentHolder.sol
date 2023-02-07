// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IMarketplaceTracker {
    function addRentSC() external;
    function removeRentSC() external;
}

// This contract is used to hold an NFT and manage the rental of it
contract RentHolder {
    address public nftOwner;
    address public nftAddress;
    uint public nftId;
    uint public pricePerDay;
    uint public ownerPenalty;
    uint public renterPenalty;
    uint public expirationDate;

    address public currRenter;
    uint public currRentEndDate;

    address public feeCollector = 0xE2c36ED0DFB0B0abFDb92d500Adcf4ffE81523B5;
    uint public feeValue = 1;

    address marketplaceAddress = 0xC6166805035cAF58523F2e62A6E8d9469Ef70064;

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

    constructor(address _nftAddress, uint _nftID, uint _pricePerDay, uint _ownerPenalty, uint _renterPenalty, uint _expirationDate) payable {
        require(msg.value >= 0.05 ether, 'You must pay at least 0.05 ETH to pay potential gas fees');
        require(block.timestamp < _expirationDate, 'The expiration date must be in the future');
        nftOwner = msg.sender;
        nftAddress = _nftAddress;
        nftId = _nftID;
        pricePerDay = _pricePerDay;
        ownerPenalty = _ownerPenalty;
        renterPenalty = _renterPenalty;
        expirationDate = _expirationDate;
    }

    receive() external payable {}

    // This modifier is used to make sure that only the feeCollector of the contract can call a function
    modifier onlyFeeCollector() {
        require(msg.sender == feeCollector, 'Only the fee collector can call this function');
        _;
    }

    // This modifier is used to make sure that only the owner of the contract can call a function
    modifier onlyOwner() {
        require(msg.sender == nftOwner, 'Only the NFT owner can call this function');
        _;
    }

    // This modifier is used to make sure that only the current renter of the contract can call a function. It also checks that the rental period has not ended.
    modifier onlyCurrRenter() {
        require(msg.sender == currRenter, 'Only the valid current renter can call this function');
        require(block.timestamp < currRentEndDate, 'The rental period has ended');
        _;
    }

    // This function allows the owner to change the owner penalty
    function changeOwnerPenalty(uint _newOwnerPenalty) public onlyOwner {
        ownerPenalty = _newOwnerPenalty;
    }

    // This function allows the owner to change the renter penalty
    function changeRenterPenalty(uint _newRenterPenalty) public onlyOwner {
        renterPenalty = _newRenterPenalty;
    }

    // This function allows the owner to change the price per day
    function changePricePerDay(uint _newPricePerDay) public onlyOwner {
        pricePerDay = _newPricePerDay;
    }

    // This function allows the owner to change the expiration date
    function changeExpirationDate(uint _newExpirationDate) public onlyOwner {
        require(block.timestamp < _newExpirationDate, 'The expiration date must be in the future');
        expirationDate = _newExpirationDate;
    }

    // This function allows the fee collector to change the which account receives the fees
    function changeFeeCollector(address _newFeeCollector) public onlyFeeCollector {
        feeCollector = _newFeeCollector;
    }

    // This function allows the fee collector to change the value of the fees
    function changeFeeValue(uint _newFeeValue) public onlyFeeCollector {
        feeValue = _newFeeValue;
    }

    function transferNFT() external {
        ERC721 token = ERC721(nftAddress); 
        token.transferFrom(nftOwner, address(this), nftId); 

        IMarketplaceTracker marketplace = IMarketplaceTracker(marketplaceAddress);
        marketplace.addRentSC();
    }
    
    // This function allows anyone to rent the NFT for a certain number of days. 
    // It checks that the renter pays the correct amount, that the contract has not expired, and that the contract is not currently rented.
    // It then calls the withdrawFunds function to send the funds to the owner since this function is not triggered when the previous rent ends.
    // Finally it then sets the current renter and the current rent end date.
    function rent(uint _days) public payable {
        require(msg.value == pricePerDay * _days, 'You must pay the price per day times the number of days you want to rent for');
        require(block.timestamp + _days * 1 days < expirationDate, 'This contract will expire before your rental ends');
        require(block.timestamp > currRentEndDate, 'This contract is currently rented');
        withdrawFunds();
        currRenter = msg.sender;
        currRentEndDate = block.timestamp + _days * 1 days;
    }

    // This function allows the current renter to stop the rental early.
    // It checks that the rental period has not ended and then calculates the penalty that the renter will have to pay.
    // It then sends the remaining funds to the renter, calls the withdrawFunds function to send the funds to the owner and resets the rent properties.
    function stopRentEarly() public onlyCurrRenter {
        require(block.timestamp < currRentEndDate, 'You have already paid for the full rental period');
        uint daysLeft = (currRentEndDate - block.timestamp) / 1 days;
        // renterPenalty is the integer percentage of the pricePerDay that the renter doesnt get back if he stops the rent early
        uint penalty = daysLeft * pricePerDay * renterPenalty / 100;
        if(pricePerDay * daysLeft - penalty > 0) {
            payable(currRenter).transfer(pricePerDay * daysLeft - penalty);
        }
        // sends the funds back to the owner
        withdrawFunds();
        currRenter = address(0);
        currRentEndDate = 0;
    }

    // This function sends the funds to the owner. It checks that the contract has more than 0.05 ETH in order to leave enough to conver potential gas fees 
    // It then sends the remaining funds to the owner.
    function withdrawFunds() public {
        require(address(this).balance > 0.05 ether, 'At least 0.05 ETH must remain in the contract to pay potential gas fees');
        payFeeCollector();
        payable(nftOwner).transfer(address(this).balance - 0.05 ether);
    }

    // This function sends the fees to the fee collector. It checks that the contract has more than 0.05 ETH in order to leave enough to conver potential gas fees
    function payFeeCollector() internal {
        if(address(this).balance > 0.05 ether) {
            payable(feeCollector).transfer((address(this).balance - 0.05 ether) * feeValue / 100);
        }
    }

    // This function allows the owner to withdraw the NFT.
    // It checks that the rental period has ended and then sends the funds to the renter, with a penalty being applied to the owner for withdrawing the NFT before the rental is over.
    // It then transfers the NFT to the owner and sends the remaining funds to the owner.
    function withdrawNFT() external onlyOwner {
        if(block.timestamp < currRentEndDate) {
            uint daysLeft = (currRentEndDate - block.timestamp) / 1 days;
            // ownerPenalty is the integer percentage of the pricePerDay that the owner doesnt get from the days that have pased if he withdraws the NFT during a rental
            uint refundValue = daysLeft * pricePerDay + (address(this).balance - 0.05 ether) * ownerPenalty / 100;
            payable(currRenter).transfer(refundValue);
        }
        ERC721 token = ERC721(nftAddress); 
        token.transferFrom(address(this), nftOwner, nftId); 
        payFeeCollector();
        IMarketplaceTracker marketplace = IMarketplaceTracker(marketplaceAddress);
        marketplace.removeRentSC();
        selfdestruct(payable(nftOwner));
    }

    // This function gets the current renter of the contract. It returns 0 if the rental period has ended.
    // It is used so that other dApps can check if the NFT can be used by someone other than the actual NFT holder which will be this Smart Contract.
    function getRenter() public view returns(address) {
        if(block.timestamp > currRentEndDate) {
            return address(0);
        }
        return currRenter;
    }

    function returnRentInfo() external view returns(relevantRentInfo memory) {
        return relevantRentInfo(address(this), nftOwner, nftAddress, nftId, pricePerDay, ownerPenalty, renterPenalty, expirationDate, currRenter, currRentEndDate);
    }
}

