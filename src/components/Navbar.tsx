import Link from "next/link";
import CustomConnectButton from "./CustomConnectButton";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/utils/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

type NavbarLinksProps = {
  className?: string;
};

const NavbarLinks = ({ className }: NavbarLinksProps) => (
  <ul className={cn("flex w-full flex-col justify-between text-mb-3xl md:w-1/3 md:flex-row md:text-xl", className)}>
    <li className="hover-line py-[1vh] md:py-0">
      <Link className="flex flex-row items-center justify-between" href="/">
        Home
        <ChevronRight className="block h-6 w-6 md:hidden" />
      </Link>
    </li>
    <li className="hover-line py-[1vh] md:py-0">
      <Link className="flex flex-row items-center justify-between" href="/marketplace">
        Marketplace
        <ChevronRight className="block h-6 w-6 md:hidden" />
      </Link>
    </li>
    <li className="hover-line py-[1vh] md:py-0">
      <Link className="flex flex-row items-center justify-between" href="/my-collection">
        My Collection
        <ChevronRight className="block h-6 w-6 md:hidden" />
      </Link>
    </li>
  </ul>
);

const Navbar = () => {
  const [value, setValue] = useState("");

  const router = useRouter();

  useEffect(() => {
    setValue("");
  }, [router.pathname]);

  return (
    <nav className="relative z-20 mb-[-1vh] px-[4vw] py-[3vh] md:mb-0 md:h-[7vw] md:py-[3vh]">
      <Accordion.Root type="single" collapsible value={value} onValueChange={(val) => setValue(val)}>
        <Accordion.Item value="item-1">
          <div className="flex flex-row items-center justify-between">
            <NavbarLinks className="hidden md:flex" />
            <Accordion.Trigger className="group md:hidden">
              <Menu className="flex h-6 w-6 group-data-[state=close]:flex group-data-[state=open]:hidden" aria-hidden />
              <X className="hidden h-6 w-6 group-data-[state=open]:flex group-data-[state=close]:hidden" aria-hidden />
            </Accordion.Trigger>
            <CustomConnectButton />
          </div>
          <Accordion.Content className="overflow-hidden pt-[1vh] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown md:hidden">
            <NavbarLinks />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </nav>
  );
};
export default Navbar;
