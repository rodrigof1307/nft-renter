import { useState } from "react";

import NFTCard from "./nftCard";

import { ethers, ContractFactory } from 'ethers';
import rentHolderJSON from '../artifacts/contracts/RentHolder.sol/RentHolder.json'
import ERC721JSON from '../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json'

export default function LendCard({tokenData}: {tokenData: NFTInfo}) {

    const [buttonText, setButtonText] = useState('Lend')
    const [dailyRate, setDailyRate] = useState(0.00)
    const [ownerPenalty, setOwnerPenalty] = useState(0)
    const [renterPenalty, setRenterPenalty] = useState(0)

    const lendNFT = async (tokenData: NFTInfo) => {
      if(buttonText !== 'Lend') return
      if(!window.ethereum) return alert('Please install Metamask')
      setButtonText('Deploying Contract')
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const rentHolderFactory = new ContractFactory(rentHolderJSON.abi, rentHolderJSON.bytecode, signer)
      const rentHolder = await rentHolderFactory.deploy(tokenData.address, tokenData.tokenID, ethers.utils.parseEther(dailyRate.toString()), ownerPenalty, renterPenalty, 1683475160, { value: ethers.utils.parseEther('0.05') });
      await rentHolder.deployed();
      setButtonText('Approving Transfer')
      const nftContract = new ethers.Contract(tokenData.address, ERC721JSON.abi, signer)
      const givingApproval = await nftContract.approve(rentHolder.address, tokenData.tokenID)
      await givingApproval.wait()
      setButtonText('Executing Transfer')
      const transfer = await rentHolder.transferNFT()
      await transfer.wait()
      setButtonText('Done!')
    }
    
    return(
    <div className="bg-gray-900 rounded-xl p-7 my-5 w-80 flex flex-col items-center justify-between" style={{height: '28.5rem'}}>
      <NFTCard tokenData={tokenData} />
      <p className="text-white mt-2">
        Daily Rate:<input type={'number'} className='w-10 bg-gray-900 border-0 border-b-2 mx-1 text-center' onChange={(e) => setDailyRate(parseFloat(e.target.value))}/>ETH
      </p>
      <p className="text-white">
        Owner Penalty:<input type={'number'} className='w-10 bg-gray-900 border-0 border-b-2 mx-1 text-center' onChange={(e) => setOwnerPenalty(parseFloat(e.target.value))}/>%  
      </p>
      <p className="text-white">
        Renter Penalty:<input type={'number'} className='w-10 bg-gray-900 border-0 border-b-2 mx-1 text-center' onChange={(e) => setRenterPenalty(parseFloat(e.target.value))}/>%
      </p>
      <button className='w-3/4 bg-sky-400 rounded-md border-2 border-transparent px-3 py-2 mt-2 text-white hover:bg-sky-500' onClick={() => lendNFT(tokenData)}>
        { (buttonText !== 'Lend' && buttonText !== 'Done!') ?
        <>
          <span className="ml-1 mr-0.5 loading">{buttonText}</span>
        </>
        :
        buttonText
        }
      </button>
    </div>
    )
}
