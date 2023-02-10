import { useState, useContext, useEffect } from 'react';

import { Alchemy, Network, Nft } from 'alchemy-sdk';
import { ethers } from 'ethers';

import Layout from '@/components/layout'
import LendCard from '@/components/lendCard';

import SignerContext from '@/context/signerContext'

import marketplaceTrackerJSON from '../artifacts/contracts/MarketplaceTracker.sol/MarketplaceTracker.json'
import MarketplaceCard from '@/components/marketplaceCard';
import RentedByYouCard from '@/components/rentedByYouCard';

export default function Collection() {
  const { signer } = useContext(SignerContext)!;

  const [nonPublishedNFTs, setNonPublishedNFTs] = useState<NFTInfo[]>([]);

  const [publishedNFTs, setPublishedNFTs] = useState<FinalRentInfo[]>([]);
  const [rentedNFTs, setRentedNFTs] = useState<FinalRentInfo[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setNonPublishedNFTs([])
    setPublishedNFTs([])
    setRentedNFTs([])
    handleConnect()
  }, [signer])
  
  const handleConnect = async () => {
    if(signer) {
      setLoading(true)
      const signerAddress = await signer.getAddress();
    
      const config = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        network: Network.ETH_GOERLI,
      };
  
      const alchemy = new Alchemy(config);
      const data = await alchemy.nft.getNftsForOwner(signerAddress);
  
      const tokenDataPromises = [];
  
      for (let i = 0; i < data.ownedNfts.length; i++) {
        const tokenData = alchemy.nft.getNftMetadata(
          data.ownedNfts[i].contract.address,
          data.ownedNfts[i].tokenId
        );
        tokenDataPromises.push(tokenData);
      }
  
      const response = await Promise.all(tokenDataPromises)
      const filteredResponse = response.map((tokenData: Nft) => (
        {
          address: tokenData.contract.address,
          collectionName: tokenData.contract.name ?? '',
          tokenID: parseFloat(tokenData.tokenId),
          title: tokenData.rawMetadata?.name,
          description: tokenData.rawMetadata?.description,
          image: tokenData.media[0].thumbnail,
          attributes: tokenData.rawMetadata?.attributes,
        } as NFTInfo
      ))
  
      setNonPublishedNFTs(filteredResponse);

      const marketplaceTrackerAddress = '0xC6166805035cAF58523F2e62A6E8d9469Ef70064'

      const marketplaceTracker = new ethers.Contract( marketplaceTrackerAddress , marketplaceTrackerJSON.abi, signer )
      const responseMarketplaceTracker = await marketplaceTracker.getRentSCs();

      const rawPublishedNFTsSCs = []
      const rawRentedNFTsSCs = []

      const currentDate = new Date().getTime() / 1000

      for(let response of responseMarketplaceTracker) {
        if(response[1] === signerAddress) {
          rawPublishedNFTsSCs.push(response)
        } else if(response[8] === signerAddress && response[9].toNumber() > currentDate) {
          rawRentedNFTsSCs.push(response)
        }
      }

      const finalPublishedNFTs = await fetchRentNFTs(rawPublishedNFTsSCs)
      const finalRentedNFTs = await fetchRentNFTs(rawRentedNFTsSCs)

      setPublishedNFTs(finalPublishedNFTs)
      setRentedNFTs(finalRentedNFTs)
      setLoading(false)
    }
  }

  const fetchRentNFTs = async (rawSCs: any[]) => {

    const config = {
      apiKey: 't5NI7d-VTVUnXqInKpwXjqUTTeZmyZ4_',
      network: Network.ETH_GOERLI,
    };

    const alchemy = new Alchemy(config);

    const filteredSCs = rawSCs.map((rawRentSC: any) => 
      ({
        rentHolderSC: rawRentSC[0], 
        nftOwner: rawRentSC[1], 
        nftAddress: rawRentSC[2], 
        nftId: rawRentSC[3].toNumber(), 
        pricePerDay: parseFloat(ethers.utils.formatEther(rawRentSC[4])), 
        ownerPenalty: rawRentSC[5].toNumber(), 
        renterPenalty: rawRentSC[6].toNumber(), 
        expirationDate: rawRentSC[7].toNumber(), 
        currRenter: rawRentSC[8], 
        currRentEndDate: rawRentSC[9].toNumber() 
      } as MarketplaceTrackerRentInfo)
    )

    const getNFTPromises = []

    for (let SC of filteredSCs) {
      getNFTPromises.push(alchemy.nft.getNftsForOwner(SC.rentHolderSC))
    }
  
    const responseGetNFTPromises = await Promise.all(getNFTPromises)

    const tokenDataPromises = []

    for (let responseGetNFT of responseGetNFTPromises) {
        const tokenData = alchemy.nft.getNftMetadata(
          responseGetNFT.ownedNfts[0].contract.address,
          responseGetNFT.ownedNfts[0].tokenId
        );
        tokenDataPromises.push(tokenData);
    }

    const responseTokenDataPromises = await Promise.all(tokenDataPromises)

    const finalNFTs: FinalRentInfo[] = []

    for(let i=0; i < responseTokenDataPromises.length; i++){
      finalNFTs.push({
        rentHolderSC: filteredSCs[i].rentHolderSC,
        nftOwner: filteredSCs[i].nftOwner,
        nft: {
          address: responseTokenDataPromises[i].contract.address,
          collectionName: responseTokenDataPromises[i].contract.name,
          tokenID: parseFloat(responseTokenDataPromises[i].tokenId),
          title: responseTokenDataPromises[i].title,
          description: responseTokenDataPromises[i].description,
          image: responseTokenDataPromises[i].rawMetadata?.image,
          attributes: responseTokenDataPromises[i].rawMetadata?.attributes,
        },
        pricePerDay: filteredSCs[i].pricePerDay,
        ownerPenalty: filteredSCs[i].ownerPenalty,
        renterPenalty: filteredSCs[i].renterPenalty,
        expirationDate: new Date(filteredSCs[i].expirationDate * 1000).toISOString(),
        currRenter: filteredSCs[i].currRenter,
        currRentEndDate: new Date(filteredSCs[i].currRentEndDate * 1000).toISOString(),
      })
    }

    return finalNFTs
  }

  if(!signer) {
    return(
      <Layout title="Collection">
        <main className="flex w-full flex-col items-center justify-center text-center">
          <h1 className='text-white text-4xl font-chakra font-semibold'>Connect your Wallet to see your collection!</h1>
        </main>
      </Layout>
    )
  }

  if(loading) {
    return(
      <Layout title="Collection">
        <main className="flex w-full flex-col items-center justify-center text-center">
          <h1 className='text-white text-4xl font-chakra'>Loading ...</h1>
        </main>
      </Layout>
    )
  }

  return (
    <Layout title="Collection">
      <main className="flex w-full flex-col items-center justify-start text-center">
        <h2 className='text-sky-400 text-4xl font-chakra font-semibold text-left w-full my-4 pl-8'>Your NFTs</h2>
        <div className='w-100 grid my-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-6'>
        { nonPublishedNFTs.map((tokenData, index) => (
          <div key={index}>
            <LendCard tokenData={tokenData}/>
          </div>
        ))}
        </div>
        { nonPublishedNFTs.length === 0 &&
          <h1 className='text-white text-xl my-8'>You currently don't have any NFTs</h1>
        }
        <h2 className='text-sky-400 text-4xl font-chakra font-semibold text-left w-full my-4 pl-8'>Already on the Marketplace</h2>
        <div className='w-100 grid my-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-6'>
        {publishedNFTs.map((rentInfo, index) => (
          <div key={index}>
            <MarketplaceCard rentInfo={rentInfo} isOwner/>
          </div>
        ))}
        </div>
        { publishedNFTs.length === 0 &&
          <h1 className='text-white text-xl my-8'>You currently don't have any NFTs on the marketplace</h1>
        }
        <h2 className='text-sky-400 text-4xl font-chakra font-semibold text-left w-full my-4 pl-8'>Rented by you</h2>
        <div className='w-100 grid my-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-6'>
          {rentedNFTs.map((rentInfo, index) => (
            <div key={index}>
              <RentedByYouCard rentInfo={rentInfo}/>
            </div>
          ))}
        </div>
        { rentedNFTs.length === 0 &&
          <h1 className='text-white text-xl my-8'>You currently don't haven't rented any NFT</h1>
        }
      </main>
    </Layout>
  )
}

