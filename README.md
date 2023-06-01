<div align="center">
  <h3 align="center">NFT Renter</h3>

  <p align="center">
    The dApp to rent NFTs with collateralized and non-collateralized options
  </p>
</div>

## About The Project

The NFT Renter is a decentralized application that allows users to lent and rent NFTs from other users with both collateralized and non-collateralized options being available. It was initially developed as the final project of the "Ethereum Developer Bootcamp" from Alchemy University but it has since been further improved.

On collateralized loans, the owner defines the daily rate and collateral value, deploys a Rent Escrow Smart Contract and transfers his NFT to the Smart Contract. The renter must then pay the rental value and transfer the collateral to the escrow smart contract in order to receive the original NFT on his wallet. Once the rental is over, the renter must return the NFT in order to receive the collateral. With collateralized loans the lender must be aware that he runs the risk of losing the NFT however in this case he can claim the collateral.

On non-collateralized loans, the owner follows the same steps as in the collateralized option but doesn't define a collateral value. The renter will then pay the rental value and receive a wrapped NFT with the same metadata as the original one. Once the rental period is over, the wrapped token becomes invalid and the lender can withdraw the NFT.

The information about the available NFTs is tracked using a Marketplace Tracker smart contract meaning that the platform is fully decentralized.

The project is currently deployed on the Sepolia testnet and can be accessed at https://nft-renter.vercel.app/

### Built With

The project's frontend was built using:

- Next.js
- TypeScript
- TailwindCSS
- RadixUI
- wagmi
- viem

The project's smart contracts were developed using:

- Solidity
- Hardhat
- ethers.js

<!-- GETTING STARTED -->

## Getting Started

Follow the next steps to run the project

### Prerequisites

You must have node, npm and yarn installed on your machine

### Running the project

1. Clone the repo
   ```
   git clone https://github.com/rodrigof1307/nft-renter
   ```
2. Install the packages
   ```
   yarn install
   ```
3. Create a .env file where you fill the environemnt variables on the .env.example file
4. Run the project
   ```
   yarn dev
   ```
5. Access the project on http://localhost:3000/

## Usage

### For Renters

To rent NFTs the following steps must be followed:

- Connect your wallet
- Go to the [Marketplace page](https://nft-renter.vercel.app/marketplace)
- Select the NFT you want to rent
- Choose the number of hours you want to rent it for
- Click on the "Rent" button
- Confirm the transaction on your wallet

If it's a collateralized loan you will be transfering the collateral and the rental value while if it's a non-collateralized loan you will only transfer the rental value.

On collateralized rentals you receive the NFT while in non-collateralized rentals you receive a wrapped NFT with the same metadata as the original one.

Once the non-collateralized rental is over you can burn the wrapped NFT on the [My Collection page](https://nft-renter.vercel.app/my-collection) by selecting the wrapped NFT. If it is a collateralized rental you must return it before the rental period is over in order to receive the collateral.
If you don't return the NFT, the owner can claim the collateral.

Here's a video showing the process of renting an NFT:

https://github.com/rodrigof1307/nft-renter/assets/46696312/b3c56e05-ddee-4c7d-8196-bd73a305e752

### For Lenders

To lent NFTs the following steps must be followed:

- Connect your wallet
- Go to the [My Collection page](https://nft-renter.vercel.app/my-collection)
- Select the NFT you want to lent
- Choose the either do a collateralized or non-collateralized rental
- If it's a collateralized rental, choose the collateral value and the rental value and if it's a non-collateralized rental choose only the rental value
- Click on the "Lent" button
- Confirm the following three transactions:
  - Deployment of the Rent Escrow Smart Contract
  - Approval of the transfer of the NFT to the Rent Escrow Smart Contract
  - Transfer of the NFT and publishing of the rental on the Marketplace Tracker Smart Contract

On the [My Collection page](https://nft-renter.vercel.app/my-collection) you can manage your rentals. You can withdraw the NFT at anytime as long as it isn't rented and if during a collateralized rental the renter hasn't return the NFT after the rental period is over, you can claim the collateral.

Here's a video showing the process of lending an NFT:

https://github.com/rodrigof1307/nft-renter/assets/46696312/04bf5fba-319e-414c-99a6-89b324238475

## Contact

Github - [rodrigof1307](https://www.github.com/rodrigof1307)

Linkedin - [Rodrigo Fernandes](https://www.linkedin.com/in/rodrigof1307/)

Twitter - [@rodrigof1307](https://twitter.com/rodrigof1307)

Email - [rodrigo.fernandes.1307@gmail.com](mailto:rodrigo.fernandes.1307@gmail.com)
