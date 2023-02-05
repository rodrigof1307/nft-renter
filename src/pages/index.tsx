import Layout from '@/components/layout'
import Link from 'next/link'

export default function IndexPage() {
  
  return (
    <Layout title="NFT Renter">
      <main className="bg-gray-800 flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="text-3xl text-yellow-300 mb-10">Welcome to NFT Renter!</h1>
        <div className='flex flex-row justify-between items-center'>
          <div className='border-pink-600 bg-gray-900 rounded-lg border-2 p-4 mx-4'>
            <h2 className='font-bold text-xl text-pink-400'>I want to rent NFTs!</h2>
            <p className='py-4 text-gray-200'>Rent a gaming NFT for a fun and unique gaming experience! Explore rare assets and show them off to other players. Check a trusted NFT marketplace now!</p>
            <button className='bg-pink-400 rounded-md border-2 px-5 py-3 my-3 text-white hover:bg-pink-500'>Check Marketplace</button>
          </div>
          <div className='border-sky-600 bg-gray-900 rounded-lg border-2 p-4 mx-4'>
            <h2 className='font-bold text-xl text-sky-400'>I want to lend NFTs!</h2>
            <p className='py-4 text-gray-200'>Lend your NFTs to other players to start earning passive income! Check your collection and choose your lending terms on our secure protocol!</p>
            <Link href={'/collection'}>
              <button className='bg-sky-400 rounded-md border-2 px-5 py-3 my-3 text-white hover:bg-sky-500'>
                My Collection
              </button>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  )

}
