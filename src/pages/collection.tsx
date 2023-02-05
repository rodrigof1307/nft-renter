import { useState } from 'react';

import { Alchemy, Network, Nft } from 'alchemy-sdk';
import { ethers } from 'ethers';

import Layout from '@/components/layout'

export default function Collection() {

  const [tokenDataObjects, setTokenDataObjects] = useState<Nft[]>([]);
  
  async function handleConnect() {
    if(window.ethereum) {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const address = await signer.getAddress();
    
      const config = {
        apiKey: 't5NI7d-VTVUnXqInKpwXjqUTTeZmyZ4_',
        network: Network.ETH_GOERLI,
      };
  
      const alchemy = new Alchemy(config);
      const data = await alchemy.nft.getNftsForOwner(address);
  
      const tokenDataPromises = [];
  
      for (let i = 0; i < data.ownedNfts.length; i++) {
        const tokenData = alchemy.nft.getNftMetadata(
          data.ownedNfts[i].contract.address,
          data.ownedNfts[i].tokenId
        );
        tokenDataPromises.push(tokenData);
      }
  
      const response = await Promise.all(tokenDataPromises)
  
      setTokenDataObjects(response);
    }
  }

  return (
    <Layout title="Collection">
      <main className="bg-gray-900 flex min-h-screen flex-col items-center justify-center text-center">
        <div className='flex flex-row items-center justify-center text-center'>
          <h1 className="text-2xl text-white mr-10">{"Collection"}</h1>
          <button className='bg-sky-400 rounded-md border-2 px-5 py-3 my-3 text-white hover:bg-sky-500' onClick={handleConnect}>
            Connect Wallet
          </button>
        </div>
        <div className='w-100 grid grid-cols-4 gap-x-8 gap-y-2'>
          {tokenDataObjects.map((tokenData, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-8 my-5 w-80 h-96 flex flex-col items-center justify-between">
              <img className='w-11/12 h-1/2 mx-auto object-contain' src={tokenData.media[0].thumbnail}/>
              <ImprovedHeading className='text-white text-lg font-bold' improvedText={tokenData.rawMetadata?.name}/>
              <ImprovedHeading className='text-white text-sm my-2' improvedText={tokenData.rawMetadata?.description}/>
              <div className='flex flex-row justify-around items-center mt-3 w-full'>
                {tokenData.rawMetadata?.attributes?.map((attribute, index) => (
                  <ImprovedHeading key={index} className='text-white text-sm bg-slate-500 rounded-md px-3 py-1' improvedText={attribute.value}/>
                ))}
              </div>
              <button className='w-11/12 bg-sky-400 rounded-md border-2 border-transparent px-5 py-2 mt-5 text-white hover:bg-sky-500'>Lend</button>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  )
}

const ImprovedHeading = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & {improvedText? : string}) => {
  const {improvedText, children, ...rest} = props;
  
  if(props.improvedText !== undefined){
    return <h6 {...rest}>{props.improvedText}</h6>
  } else {
    return null
  }
}

