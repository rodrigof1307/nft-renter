import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import localFont from "@next/font/local";
import { Lora } from "@next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lines from "../../public/lines.svg";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

import { QueryClient, QueryClientProvider } from "react-query";

import { cn } from "@/utils/utils";
import { useEffect } from "react";

const monumentExtended = localFont({
  src: [
    {
      path: "./../fonts/MonumentExtended/MonumentExtended-Ultrabold.otf",
      weight: "800",
    },
    {
      path: "./../fonts/MonumentExtended/MonumentExtended-Regular.otf",
      weight: "400",
    },
  ],
  variable: "--font-monumentExtended",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

const { chains, provider } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://rpc2.sepolia.org`,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "NFT Renter dApp",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  // We need to add the fonts to the body so that certain Radix Primitives can use them
  useEffect(() => {
    document.body.classList.add(monumentExtended.variable);
    document.body.classList.add(lora.variable);
    document.body.classList.add("font-sans");
    document.body.classList.add("text-white");
    document.body.classList.add("text-md");
  }, []);

  useEffect(() => {
    const home = document.getElementById("home");
    const mainWrapper = document.getElementById("main-wrapper");
    if (mainWrapper === null) return;
    if (home !== null) {
      mainWrapper.classList.add("initial-animation");
    } else {
      mainWrapper.classList.remove("initial-animation");
    }
  }, [Component]);

  const queryClient = new QueryClient();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <main
            className={
              "body-min-height initial-animation relative bg-gradient-to-br from-backgroundPurple1 via-backgroundPurple2 to-backgroundPurple3 pb-[3vh] md:pb-[5vw]"
            }
            id="main-wrapper"
          >
            <Navbar />
            <Lines className="absolute right-0 top-0" width={"28.34vw"} height={"80vw"} viewBox="0 0 524 1482" />
            <Component {...pageProps} />
            <Footer />
          </main>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
