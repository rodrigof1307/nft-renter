// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IMarketplaceTracker {
    function addNonCollateralizedRentHolderSC() external;
    function removeNonCollateralizedRentSC() external;
}

interface IWrappedNFT {
    function safeMint(address to, string memory uri) external;
}

// This contract is used to hold an NFT and manage the rental of it
contract NonCollateralizedRentHolder {
    address public nftOwner;
    address public nftAddress;
    uint public nftId;
    uint public ratePerHour;

    address public currRenter;
    uint public currRentEndDate;
    uint8 public currRentPeriod;

    address public feeCollector = 0xE2c36ED0DFB0B0abFDb92d500Adcf4ffE81523B5;
    uint public feePercentage = 1;

    // address marketplaceAddress = 0xAac20e3fFEB4bDB37E5555CB1f7e68f3F8994105; Goerli Address
    address marketplaceAddress = 0x90dd4730A104e15c71ED9B82eb025AF801348860;
    address wrappedCollection = 0x8C33c4aa7b3848a677b4544c6a589be79A67268e;

    struct relevantRentInfo {
        address rentHolderSC;
        address nftOwner;
        address nftAddress;
        uint nftId;
        uint ratePerHour;
        uint collateralValue;

        address currRenter;
        uint currRentEndDate;
        uint8 currRentPeriod;
    }

    struct currRenterInfo {
        address currRenter;
        uint currRentEndDate;
    }

    constructor(address _nftAddress, uint _nftID, uint _ratePerHour) {
        require(_ratePerHour > 0, 'The rate per hour must be greater than 0');
        nftOwner = msg.sender;
        nftAddress = _nftAddress;
        nftId = _nftID;
        ratePerHour = _ratePerHour;
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

    // This function allows the owner to change the hourly rate and the collateral value of the contract
    function changeRentalValues(uint _newRatePerHour) public onlyOwner {
        ratePerHour = _newRatePerHour;
    }

    // This function does the initial publish of the NFT
    // It transfer the NFT from the owner to the contract and then calls the addRentSC function of the marketplace to add the contract to the list of rentable contracts
    function publishNFT() external {
        ERC721 token = ERC721(nftAddress); 
        token.transferFrom(nftOwner, address(this), nftId); 

        IMarketplaceTracker marketplace = IMarketplaceTracker(marketplaceAddress);
        marketplace.addNonCollateralizedRentHolderSC();
    }

    // This function sends the fees to the fee collector.
    function payFeeCollector(uint totalValue) internal {
        payable(feeCollector).transfer(totalValue * feePercentage / 100);
    }

    // This function process a payment to the owner of the NFT and the fee collector.
    function processOwnerPaymenmt(uint totalValue) internal {
        require(address(this).balance >= totalValue, 'The value being withdrawn must be equal or less than the contract balance');
        payFeeCollector(totalValue);
        payable(nftOwner).transfer(totalValue * (100 - feePercentage) / 100);
    }
    
    // This function allows anyone to rent the NFT for a certain number of days. 
    // It checks that the renter pays the correct amount, that the contract is not currently rented and that the contract currently owns the NFT
    // It then transfer the NFT to the renter and calls the processOwnerPayment function to send the rental rate funds to the owner.
    // Finally it then sets the current renter and the current rent end date.
    // The collateral is kept on the contract and is not transfered to the owner at this moment
    function rent(uint8 _hours) public payable {
        require(msg.value >= ratePerHour * _hours, 'You must pay the hourly times the number of hours you want to rent for');
        require(block.timestamp > currRentEndDate, 'This NFT is currently rented');
        processOwnerPaymenmt(ratePerHour * _hours);
        currRenter = msg.sender;
        currRentEndDate = block.timestamp + _hours * 1 hours;
        currRentPeriod = _hours;
        ERC721 originalNFT = ERC721(nftAddress); 
        string memory originalNFTuri = originalNFT.tokenURI(nftId);
        IWrappedNFT wrappedNFTCollection = IWrappedNFT(wrappedCollection);
        wrappedNFTCollection.safeMint(msg.sender, originalNFTuri);
    }

    // This function allows the owner to withdraw the NFT.
    // It checks that the contract currently owns the NFT and then transfer the NFT to the owner.
    // It also removes the contract from the list of rentable contracts in the marketplace.
    function withdrawNFT() external onlyOwner {
        require(block.timestamp > currRentEndDate, 'This NFT is currently rented');
        ERC721 nftContract = ERC721(nftAddress); 
        nftContract.transferFrom(address(this), nftOwner, nftId);
        IMarketplaceTracker marketplace = IMarketplaceTracker(marketplaceAddress);
        marketplace.removeNonCollateralizedRentSC();
    }

    // This returns all information considered important for the marketplace to display
    function returnRentInfo() external view returns(relevantRentInfo memory) {
        return relevantRentInfo(address(this), nftOwner, nftAddress, nftId, ratePerHour, 0, currRenter, currRentEndDate, currRentPeriod);
    }

    // This returns the current renter and the current rent end date
    function returnCurrRenterInfo() external view returns(currRenterInfo memory) {
        return currRenterInfo(currRenter, currRentEndDate);
    }
}

