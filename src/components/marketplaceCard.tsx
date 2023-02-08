import NFTCard from "./nftCard";
import { ethers } from 'ethers';
import rentHolderJSON from '../artifacts/contracts/RentHolder.sol/RentHolder.json'
import { useEffect, useState } from "react";

export default function MarketplaceCard({rentInfo, isOwner}: {rentInfo: FinalRentInfo, isOwner: boolean}) {

  const [buttonText, setButtonText] = useState(isOwner ? 'Withdraw NFT' : 'Rent Now!')
  const [rentDays, setRentDays] = useState(0)

  useEffect(() => {
    if(isOwner) {
      setButtonText('Withdraw NFT')
    } else {
      setButtonText('Rent Now!')
    }
  }, [isOwner])

  const generateDate = (isoDate: string) => {
    const date = new Date(isoDate)
    if(new Date().toISOString() > date.toISOString()) return 'N/A'
    return `${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ${date.toLocaleDateString()}`
  }

  const startRent = async (rentHolderSC: string, pricePerDay: number) => {
    if(!window.ethereum) return alert('Please install Metamask')
    setButtonText('Registering Rent')
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(rentHolderSC, rentHolderJSON.abi, signer);
    const tx = await contract.rent(rentDays , { value: ethers.utils.parseEther((pricePerDay * rentDays).toString())});
    await tx.wait();
    setButtonText('Done!')
  }

  const withdrawNFT = async (rentHolderSC: string) => {
    if(!window.ethereum) return alert('Please install Metamask')
    setButtonText('Withdrawing NFT')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(rentHolderSC, rentHolderJSON.abi, signer)
    const tx = await contract.withdrawNFT()
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
        <p className="text-white italic font-semibold" suppressHydrationWarning>Rented until {generateDate(rentInfo.currRentEndDate)}</p>
        :
        <>
          { isOwner ?
          <p className="text-white italic font-semibold">Not Rented</p>
          :
          <p className="text-white italic font-semibold">
            Rent for <input type={'number'} className='w-10 bg-gray-900 border-0 border-b-2 mx-1 text-center' onChange={(e) => setRentDays(parseFloat(e.target.value))}/> days
          </p>
          }
        </>
      }
      { isOwner ?
        <button className='w-3/4 bg-sky-400 rounded-md border-2 border-transparent px-5 py-2 mt-2 text-white hover:bg-sky-500'
          onClick={() => withdrawNFT(rentInfo.rentHolderSC)}>
          { (buttonText !== 'Withdraw NFT' && buttonText !== 'Done!') ?
          <>
            <span className="ml-1 mr-0.5 loading">{buttonText}</span>
          </>
          :
          buttonText
          }
        </button>
      :
        <>
          { generateDate(rentInfo.currRentEndDate) !== 'N/A' ?
            <button className='w-3/4  bg-sky-400 rounded-md border-2 border-transparent px-5 py-2 mt-2 text-white opacity-70' disabled>
              <span>Available Soon</span>
            </button>
            :
            <button className='w-3/4 bg-sky-400 rounded-md border-2 border-transparent px-5 py-2 mt-2 text-white hover:bg-sky-500'
              onClick={() => startRent(rentInfo.rentHolderSC, rentInfo.pricePerDay)}>
              { (buttonText !== 'Rent Now!' && buttonText !== 'Done!') ?
              <>
                <span className="ml-1 mr-0.5 loading">{buttonText}</span>
              </>
              :
              buttonText
              }
            </button>
          }
        </>
      }
    </div>
  )
}