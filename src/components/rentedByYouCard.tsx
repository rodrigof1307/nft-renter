import NFTCard from "./nftCard";
import { ethers } from 'ethers';
import rentHolderJSON from '../artifacts/contracts/RentHolder.sol/RentHolder.json'
import { useState } from "react";

export default function RentedByYouCard({rentInfo}: {rentInfo: FinalRentInfo}) {

  const [buttonText, setButtonText] = useState('Stop Rent')

  const generateDate = (isoDate: string) => {
    const date = new Date(isoDate)
    if(new Date().toISOString() > date.toISOString()) return 'N/A'
    return `${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ${date.toLocaleDateString()}`
  }

  const stopRentEarly = async (rentHolderSC: string) => {
    if(!window.ethereum) return alert('Please install Metamask')
    setButtonText('Stopping Rent')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(rentHolderSC, rentHolderJSON.abi, signer)
    const tx = await contract.stopRentEarly()
    await tx.wait();
    setButtonText('Done!')
  }

  return(
    <div className="bg-gray-900 rounded-xl p-7 my-5 w-80 flex flex-col items-center justify-between" style={{height: '28.5rem'}}>
      <NFTCard tokenData={rentInfo.nft} />
      <p className="text-white">Daily Rate: <b>{rentInfo.pricePerDay} ETH</b></p>
      <div className="flex flex-row w-80 px-5 box-border items-center justify-between">
        <p className="text-white text-sm">Owner Penalty: {rentInfo.ownerPenalty}%</p>
        <p className="text-white text-sm">Renter Penalty: {rentInfo.renterPenalty}%</p>
      </div>
      { generateDate(rentInfo.currRentEndDate) !== 'N/A' ?
        <p className="text-white italic font-semibold">Rented until {generateDate(rentInfo.currRentEndDate)}</p>
        :
        <p className="text-white italic font-semibold">Not Rented</p>
      }
      <button className='w-3/4 bg-sky-400 rounded-md border-2 border-transparent px-5 py-2 mt-2 text-white hover:bg-sky-500'
        onClick={() => stopRentEarly(rentInfo.rentHolderSC)}>
        { (buttonText !== 'Stop Rent' && buttonText !== 'Done!') ?
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