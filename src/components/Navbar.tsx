import { Button } from './Button'
import Link from 'next/link'

const Navbar = () => (
  <nav className="flex flex-row justify-between items-center h-[7vw] px-[4vw] z-20 relative initial-animation">
    <ul className="text-white text-xl flex flex-row w-1/4 justify-between">
      <li className="hover-line">
        <Link href="/marketplace">Marketplace</Link>
      </li>
      <li className="hover-line">
        <Link href="/my-collection">My collection</Link>
      </li>
    </ul>
    <Button tone="purple" roundness="full" size="medium">
      Connect to Wallet
    </Button>
  </nav>
)

export default Navbar
