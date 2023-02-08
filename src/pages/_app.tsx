import { AppProps } from 'next/app'
import { useState } from 'react'

import SignerContext from '@/context/signerContext'
import Navbar from '@/components/navbar'

import { ethers } from 'ethers'

import '@/styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined)

  return (
  <SignerContext.Provider value={{signer, setSigner}}>
    <div className='min-h-screen flex flex-col'>
      <Navbar/>
      <Component {...pageProps} />
    </div>
  </SignerContext.Provider>)
}
