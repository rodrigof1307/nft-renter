import Layout from '@/components/layout'
import Link from 'next/link'

export default function IndexPage() {
  
  return (
    <Layout title="NFT Renter">
      <main className="w-full flex flex-col justify-between items-center flex-1 p-8 gap-8">
        <div className='flex-1 flex flex-col justify-center items-center w-full p-4 bg-gray-900 border-pink-600 rounded-lg border-2'>
          <h2 className='font-bold text-2xl text-pink-400'>I want to rent NFTs!</h2>
          <p className='py-4 text-gray-200 text-lg'>Rent a gaming NFT for a fun and unique gaming experience! Explore rare assets and show them off to other players. Check a trusted NFT marketplace now!</p>
          <Link href={'/marketplace'}>
            <button className='bg-pink-400 rounded-lg px-6 py-4 mt-5 text-white text-lg hover:bg-pink-500'>Check Marketplace</button>
          </Link>
        </div>
        <div className='flex-1 flex flex-col justify-center items-center w-full p-4 bg-gray-900 border-sky-600 rounded-lg border-2'>
          <h2 className='font-bold text-2xl text-sky-400'>I want to lend NFTs!</h2>
          <p className='py-4 text-gray-200 text-lg'>Lend your NFTs to other players to start earning passive income! Check your collection and choose your lending terms on our secure protocol!</p>
          <Link href={'/collection'}>
            <button className='bg-sky-400 rounded-lg px-6 py-4 mt-5 text-white text-lg hover:bg-sky-500'>
              My Collection
            </button>
          </Link>
        </div>
      </main>
    </Layout>
  )

}
