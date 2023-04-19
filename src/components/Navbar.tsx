import { Button } from "./utils/Button";
import Link from "next/link";

const Navbar = () => (
  <nav className="relative z-20 flex h-[7vw] flex-row items-center justify-between px-[4vw]">
    <ul className="flex w-1/4 flex-row justify-between text-xl text-white">
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
);

export default Navbar;
