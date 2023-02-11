import NFTCard from "./nftCard";
import { ethers } from 'ethers';
import rentHolderJSON from '../artifacts/contracts/RentHolder.sol/RentHolder.json'
import { useEffect, useState } from "react";
import { FiEdit, FiX } from "react-icons/fi";
import GradientButton from "./gradientButton";

export default function MarketplaceCard({rentInfo, isOwner}: {rentInfo: FinalRentInfo, isOwner: boolean}) {

  const [buttonText, setButtonText] = useState(isOwner ? 'Withdraw NFT' : 'Rent Now!')
  const [rentDays, setRentDays] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [dailyRate, setDailyRate] = useState(0.00)
  const [ownerPenalty, setOwnerPenalty] = useState(0)
  const [renterPenalty, setRenterPenalty] = useState(0)

  useEffect(() => {
    if(isOwner) {
      setButtonText('Withdraw NFT')
    } else {
      setButtonText('Rent Now!')
    }
  }, [isOwner])

  useEffect(() => {
    if(isOwner) {
      if(editMode) {
        setButtonText('Edit Rent Terms')
      } else {
        setButtonText('Withdraw NFT')
      }
    }
  }, [editMode])

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

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const editRent = async (rentHolderSC: string) => {
    if(!window.ethereum) return alert('Please install Metamask')
    setButtonText('Updating Rent')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(rentHolderSC, rentHolderJSON.abi, signer)
    const tx1 = contract.changePricePerDay(ethers.utils.parseEther(dailyRate.toString()))
    const tx2 = contract.changeOwnerPenalty(ownerPenalty)
    const tx3 = contract.changeRenterPenalty(renterPenalty)
    Promise.all([tx1, tx2, tx3]).then(async ([respTx1, respTx2, respTx3]) => {
      Promise.all([respTx1.wait(), respTx2.wait(), respTx3.wait()]).then(() => {
        setButtonText('Done!')
      })
    })
  }

  const buttonComponent = () => {
    if(isOwner) {
      if(editMode) {
        return( <GradientButton buttonText={buttonText} nonLoadingText={['Edit Rent Terms', 'Done!']}
          onClick={() => editRent(rentInfo.rentHolderSC)}/>)
      }
      return( <GradientButton buttonText={buttonText} nonLoadingText={['Withdraw NFT', 'Done!']}
        onClick={() => withdrawNFT(rentInfo.rentHolderSC)}/>)
    }
    if(generateDate(rentInfo.currRentEndDate) !== 'N/A') {
      return(<GradientButton buttonText={'Available Soon'} disabled/>)
    }
    console.log(rentInfo.nft.title)
    return( <GradientButton buttonText={buttonText} nonLoadingText={['Rent Now!', 'Done!']}
      onClick={() => startRent(rentInfo.rentHolderSC, rentInfo.pricePerDay)}/>)
  }

  return(
    <div className={`relative bg-gray-900 rounded-xl p-7 w-80 flex flex-col items-center justify-between hover-shadow box-gradient`}
      style={{height: '28.5rem'}}>
      { isOwner && generateDate(rentInfo.currRentEndDate) === 'N/A' &&
        <button className='absolute top-3 right-3 text-lg cursor-pointer' onClick={toggleEditMode}>
          <svg width="0" height="0">
            <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop stopColor="#E879F9" offset="0%" />
                <stop stopColor="#00A8FF" offset="100%" />
            </linearGradient>
          </svg>
          { editMode ?
            <FiX style={{ stroke: "url(#gradient)" }}/>
            :
            <FiEdit style={{ stroke: "url(#gradient)" }}/>
          }
        </button>
      }
      <NFTCard tokenData={rentInfo.nft} />
      { !editMode ?
      <div className="h-24 flex flex-col justify-between items-center">
        <p className="text-white">Daily Rate: <span className="font-chakra font-bold">{rentInfo.pricePerDay} ETH</span></p>
        <div className="flex flex-row w-80 px-5 box-border items-center justify-between">
          <p className="text-white text-sm">Owner Penalty: <span className="font-chakra font-bold">{rentInfo.ownerPenalty}%</span></p>
          <p className="text-white text-sm">Renter Penalty: <span className="font-chakra font-bold">{rentInfo.renterPenalty}%</span></p>
        </div>
        { generateDate(rentInfo.currRentEndDate) !== 'N/A' ?
          <p className="text-white italic font-chakra font-semibold" suppressHydrationWarning>Rented until {generateDate(rentInfo.currRentEndDate)}</p>
          :
          <p className="text-white italic font-chakra font-semibold">
            { isOwner ?
              "Not Rented"
            :
              <>
              <span>Rent for </span>
              <input type={'number'} className='w-10 bg-gray-900 border-0 border-b-2 mx-1 text-center' onChange={(e) => setRentDays(parseFloat(e.target.value))}/> 
              <span> days</span>
              </>
            }
          </p>
        }
      </div>
      :
      <div className="h-24 flex flex-col justify-between items-center">
        <p className="text-white">
          Daily Rate:
          <input 
            type={'number'} 
            className='w-10 bg-gray-900 border-0 border-b-2 mx-1 text-center font-chakra font-semibold' 
            onChange={(e) => setDailyRate(parseFloat(e.target.value))}
          />
          <span className="font-chakra font-semibold">ETH</span> 
        </p>
        <p className="text-white">
          Owner Penalty:
          <input 
            type={'number'}
            className='w-10 bg-gray-900 border-0 border-b-2 mx-1 text-center font-chakra font-semibold'
            onChange={(e) => setOwnerPenalty(parseFloat(e.target.value))}/>
          <span className="font-chakra font-semibold">%</span> 
        </p>
        <p className="text-white">
          Renter Penalty:
          <input 
            type={'number'}
            className='w-10 bg-gray-900 border-0 border-b-2 mx-1 text-center font-chakra font-semibold'
            onChange={(e) => setRenterPenalty(parseFloat(e.target.value))}/>
          <span className="font-chakra font-semibold">%</span> 
        </p>
      </div>
      }
      { buttonComponent() }
    </div>
  )
}