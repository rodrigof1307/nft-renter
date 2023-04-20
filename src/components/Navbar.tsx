import Link from "next/link";
import CustomConnectButton from "./CustomConnectButton";

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
    <CustomConnectButton />
  </nav>
);

export default Navbar;
