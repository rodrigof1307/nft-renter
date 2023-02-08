import Head from 'next/head'

type LayoutProps = {
  children: React.ReactNode
  title?: string
}

export default function Layout({
  children,
  title = 'This is the default title',
}: LayoutProps) {

  return (
    <div className='flex flex-1 bg-gray-800'>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
    </div>
  )
}
