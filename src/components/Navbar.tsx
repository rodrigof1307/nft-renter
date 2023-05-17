import Link from "next/link";
import CustomConnectButton from "./CustomConnectButton";

const Navbar = () => (
  <nav className="relative z-20 flex flex-row items-center justify-between px-[4vw] py-[3vh] md:h-[7vw] md:py-0">
    <ul className="flex flex-row justify-between text-[2.5vw] md:w-1/3 md:text-xl">
      <li className="hover-line">
        <Link href="/">Home</Link>
      </li>
      <li className="hover-line hidden md:block">
        <Link href="/marketplace">Marketplace</Link>
      </li>
      <li className="hover-line hidden md:block">
        <Link href="/my-collection">My collection</Link>
      </li>
    </ul>
    <CustomConnectButton />
  </nav>
);

export default Navbar;
