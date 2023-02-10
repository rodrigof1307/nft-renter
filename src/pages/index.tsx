import LandingPageCard from '@/components/landingPageCard'
import Layout from '@/components/layout'
import Link from 'next/link'

export default function IndexPage() {
  
  return (
    <Layout title="NFT Renter">
      <main className="w-full flex flex-col justify-between items-center flex-1 p-5 lg:p-7 gap-5 lg:gap-7">
        <LandingPageCard tailwindBorderColor='border-fuchsia-400'>
          <h2 className='font-chakra font-semibold text-xl md:text-2xl lg:text-3xl text-fuchsia-400'>I want to rent NFTs!</h2>
          <p className='px-2 py-4 text-gray-200 md:text-lg lg:text-xl'>Rent a gaming NFT to unlock fun and unique gaming experiences! Explore rare assets and show them off to other players. Check our trusted NFT marketplace now!</p>
          <Link href={'/marketplace'}>
            <button className='bg-fuchsia-400 rounded-lg px-6 py-4 mt-5 text-white md:text-lg lg:text-xl hover:bg-fuchsia-500'>Check Marketplace</button>
          </Link>
        </LandingPageCard>
        <LandingPageCard tailwindBorderColor='border-sky-400'>
          <h2 className='font-chakra font-semibold text-xl md:text-2xl lg:text-3xl text-sky-400'>I want to lend NFTs!</h2>
          <p className='px-2 py-4 text-gray-200 md:text-lg lg:text-xl'>Lend your NFTs to other players to start earning passive income! Check your collection and choose your lending terms on our secure protocol!</p>
          <Link href={'/collection'}>
            <button className='bg-sky-400 rounded-lg px-6 py-4 mt-5 text-white md:text-lg lg:text-xl hover:bg-sky-500'>
              My Collection
            </button>
          </Link>
        </LandingPageCard>
      </main>
    </Layout>
  )

}
