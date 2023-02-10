import { AppProps } from 'next/app'
import { useState } from 'react'

import SignerContext from '@/context/signerContext'
import Navbar from '@/components/navbar'

import { Poppins } from '@next/font/google'
import { Chakra_Petch } from '@next/font/google'

import { ethers } from 'ethers'

import '@/styles/index.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra',
})

export default function MyApp({ Component, pageProps }: AppProps) {
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined)

  return (
  <SignerContext.Provider value={{signer, setSigner}}>
    <div className={`min-h-screen flex flex-col ${chakra.variable} ${poppins.variable} font-sans`}>
      <Navbar/>
      <Component {...pageProps} />
    </div>
  </SignerContext.Provider>)
}
