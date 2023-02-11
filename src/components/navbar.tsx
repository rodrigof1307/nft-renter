import SignerContext from "@/context/signerContext";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";
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
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', [])
            const signer = provider.getSigner();
            setSigner(signer)
        } else {
            alert("Please install MetaMask to use this application.");
        }
    }

    const disconnectWallet = async () => {
        setSigner(undefined)
    }
    
    return (
        <div className="flex justify-between items-center rounded-b-2xl p-4 md:p-5 lg:p-6 bg-gray-900 navbar-gradient">
            <div className="w-36 md:w-52 lg:w-72 relative">
                <Link href={'/'}>
                    <Image src="/images/logo.png" alt="NFT Renter" width={250} height={40} layout="responsive"/>
                </Link>
            </div>
            { signerAddress ?
            <div className="flex flex-row justify-end items-center h-10 md:h-11 lg:h-14">
                <p className="text-gradient text-xs md:text-sm lg:text-md xl:text-lg">{"Welcome " + signerAddress.substring(0,6) + "..." + signerAddress.slice(-4) + "!"}</p>
                <button className='button-gradient w-9 h-9 md:w-11 md:h-11 xl:w-12 xl:h-12 ml-2 md:ml-3 lg:md-4 rounded-md flex justify-center items-center' onClick={disconnectWallet}>
                    <svg width="0" height="0">
                        <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop stopColor="#E879F9" offset="0%" />
                            <stop stopColor="#00A8FF" offset="100%" />
                        </linearGradient>
                    </svg>
                    <FiLogOut style={{ stroke: "url(#gradient)" }} />
                </button>
            </div>
            :
            <button className='button-gradient w-36 md:w-40 lg:w-52 h-10 md:h-11 lg:h-14 lg:text-lg rounded-md lg:rounded-lg'
                onClick={connectWallet}>
                <p className="font-chakra font-semibold text-gradient text-sm md:text-md lg:text-lg font-medium w-36 md:w-40 lg:w-52 h-10 md:h-11 lg:h-14" style={{paddingBottom: 4}}>
                    Connect Wallet
                </p>
            </button>
            }
        </div>
    );
}