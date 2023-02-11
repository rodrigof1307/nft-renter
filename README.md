# NFT Renter

This project was done as the final project of the "Ethereum Developer Bootcamp" from Alchemy University ( https://university.alchemy.com/overview/ethereum ). It's goal was to develop a decentralized application that allowed users to rent NFTs from other users.

The rental service works as follows:
- The NFT owner deploys a Rent Smart Contract and transfers his NFT to said Smart Contract.
- When a user want to rent that NFT, he will send to the smart contract the daily rental rate times the days he wishes to rent the NFT for. Afterwards, the user will be associated to the Smart Contract, proving that he can rightfully use the NFT.
- Once the rental ends the NFT owner is able to withdraw the funds from the Smart Contract.
- The owner is able to withdraw his NFT at any time however a penalty will be applied on the value he will receive from the elapsed rental period if someone his currently renting the NFT. This penalty is defined by the owner on the contract deployment through the owner penalty parameter which is a percentage. Thus if the owner withdraws the NFT in the middle of a rental he will receive (100 - ownerPenalty)/100 * (dailyRate * elapsedRentalTime).
- The renter is able to stop the rent at any time however a penalty will be applied and he will have to overpay for the days he used the NFT. This penalty is defined by the owner on the contract deployment through the renter penalty parameter which is a percentage. Thus if the renter stops the rental early, he will receive the following fraction from the total deposit he made: totalDeposit - (dailyRate * (100 + renterPenalty)/100)) * (elapsedRentalTime). If the renter stops the rent near the deadline, the mentioned equation might return a negative value which is discarded and instead the renter doesn't receive anything even though he stopped the rental early.

There is also a MarketplaceTracker Smart Contract that only stores an array with all the deployed Rent Smart Contracts addresses. It is possible to fetch all the Rent Smart Contracts relevant information through this contract's `getRentSCs` function. 

With this implementation all the information and implementation of the marketplace becomes decentralized!

The dApp's frontend was built using Next.js, TypeScript and Tailwind CSS
### Execution Instructions

1. Run `npm install` to install all the dependencies
2. Create a .env file on the root of the project
3. Add your Alchemy Goerli SDK Key with the following format `NEXT_PUBLIC_ALCHEMY_API_KEY=123456789abc`
4. Run `npm run dev` to run the dApp

You can use the following Goerli account to lent and rent NFTs
Public Key: 0xC666Bea89CaeaF34599285B63F1b1b1b6E484227
Private Key: 98422bf9aab6bc0abb8dfda3492d184543e9c9c13ad1085f7a08274e31ccad27
Don't use it for anything else since these keys are now public!