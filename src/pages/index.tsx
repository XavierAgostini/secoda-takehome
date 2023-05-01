import { Inter } from 'next/font/google'
import CryptoTable from './CryptoTable'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h2 className='text-4xl text-black border-black border-4 px-4 py-2 rounded-md'>Top 10 Cryptocurrencies</h2>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <CryptoTable />
      </div>

    </main>
  )
}
