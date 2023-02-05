import Layout from '@/components/layout'

export default function IndexPage() {
  return (
    <Layout title="NFT Renter">
      <main>
        <div className='flex min-h-screen flex-col items-center justify-center text-center'>
          <h1 className="text-2xl">Welcome to NFT Renter!</h1>
          <p className='mt-2 text-gray-800'>
            Soon you will be able to rent your favorite NFTs 🖼!
          </p>
        </div>
      </main>
    </Layout>
  )
}
