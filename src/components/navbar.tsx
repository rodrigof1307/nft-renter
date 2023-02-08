import SignerContext from "@/context/signerContext";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";


export default function Navbar() {
    const { signer, setSigner } = useContext(SignerContext)!;

    const [signerAddress, setSignerAddress] = useState('')

    useEffect(() => {
        const getAddress = async () => {
            const response = await signer?.getAddress() ?? ''
            setSignerAddress(response)
        }
        getAddress()
    }, [signer])

    const connectWallet = async () => {
        if (window.ethereum) {
            const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
            setSigner(signer)
        }
    }

    const disconnectWallet = async () => {
        setSigner(undefined)
    }
    
    return (
        <div className="flex justify-between items-center py-6 px-4 bg-gray-900">
            <Link href={'/'}>
                <div className="flex items-center">
                    <h1 className="text-2xl ml-2 text-white font-bold cursor-pointer">NFT Renter</h1>
                </div>
            </Link>
            { signerAddress ?
            <div className="flex flex-row justify-end items-center">
                <p className="text-emerald-400">{"Welcome " + signerAddress + "!"}</p>
                <button className='w-12 h-12 ml-4 bg-emerald-300 rounded-md flex justify-center items-center text-white hover:bg-emerald-400' onClick={disconnectWallet}>
                    <FiLogOut className="text-lg"/>
                </button>
            </div>
            :
            <button className='w-48 h-12 bg-emerald-300 rounded-md border-2 border-transparent px-5 py-2 text-white hover:bg-emerald-400'
                onClick={connectWallet}>
                Connect Wallet
            </button>
            }
        </div>
    );
}