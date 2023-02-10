import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

import { useContext, useState, useEffect } from 'react';

import Layout from '@/components/layout'

import marketplaceTrackerJSON from '../artifacts/contracts/MarketplaceTracker.sol/MarketplaceTracker.json'
import MarketplaceCard from '@/components/marketplaceCard';
import SignerContext from '@/context/signerContext';

export default function Marketplace({finalRentableNFTs} : {finalRentableNFTs: FinalRentInfo[]}) {

  const { signer } = useContext(SignerContext)!;

  const [signerAddress, setSignerAddress] = useState('')

  useEffect(() => {
      const getAddress = async () => {
          const response = await signer?.getAddress() ?? ''
          setSignerAddress(response)
      }
      getAddress()
  }, [signer])

  return (
    <Layout title="Marketplace">
      <main className="w-full flex flex-col items-center justify-start text-center">
        <div className='grid my-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-8'>
        {finalRentableNFTs.map((finalRentableNFT, index) => (
          <div key={index}>
            <MarketplaceCard rentInfo={finalRentableNFT} isOwner={signerAddress === finalRentableNFT.nftOwner} />
          </div>
        ))}
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const marketplaceTrackerAddress = '0xC6166805035cAF58523F2e62A6E8d9469Ef70064'

  const provider = new ethers.providers.AlchemyProvider('goerli', 't5NI7d-VTVUnXqInKpwXjqUTTeZmyZ4_')
  
  const marketplaceTracker = new ethers.Contract( marketplaceTrackerAddress , marketplaceTrackerJSON.abi, provider )
  const responseMarketplaceTracker = await marketplaceTracker.getRentSCs();

  const rentSCs = responseMarketplaceTracker.map((rawRentSC: any) => 
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

  const config = {
    apiKey: 't5NI7d-VTVUnXqInKpwXjqUTTeZmyZ4_',
    network: Network.ETH_GOERLI,
  };

  const alchemy = new Alchemy(config);

  const getNFTsPromises = []

  for (let rentSC of rentSCs) {
    getNFTsPromises.push(alchemy.nft.getNftsForOwner(rentSC.rentHolderSC))
  }

  const responseGetNFTsPromises = await Promise.all(getNFTsPromises)

  const tokenDataPromises = []

  for (let responseGetNFT of responseGetNFTsPromises) {
      const tokenData = alchemy.nft.getNftMetadata(
        responseGetNFT.ownedNfts[0].contract.address,
        responseGetNFT.ownedNfts[0].tokenId
      );
      tokenDataPromises.push(tokenData);
  }

  const responseTokenDataPromises = await Promise.all(tokenDataPromises)

  const finalRentableNFTs: FinalRentInfo[] = []

  for(let i=0; i < rentSCs.length; i++){
    finalRentableNFTs.push({
      rentHolderSC: rentSCs[i].rentHolderSC,
      nftOwner: rentSCs[i].nftOwner,
      nft: {
        address: responseTokenDataPromises[i].contract.address,
        collectionName: responseTokenDataPromises[i].contract.name,
        tokenID: parseFloat(responseTokenDataPromises[i].tokenId),
        title: responseTokenDataPromises[i].title,
        description: responseTokenDataPromises[i].description,
        image: responseTokenDataPromises[i].rawMetadata?.image,
        attributes: responseTokenDataPromises[i].rawMetadata?.attributes,
      },
      pricePerDay: rentSCs[i].pricePerDay,
      ownerPenalty: rentSCs[i].ownerPenalty,
      renterPenalty: rentSCs[i].renterPenalty,
      expirationDate: new Date(rentSCs[i].expirationDate * 1000).toISOString(),
      currRenter: rentSCs[i].currRenter,
      currRentEndDate: new Date(rentSCs[i].currRentEndDate * 1000).toISOString(),
    })
  }

  return {
    props: {
      finalRentableNFTs,
    },
    revalidate: 30,
  } 
}




