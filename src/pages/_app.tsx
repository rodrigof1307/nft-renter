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
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

const monumentExtended = localFont({
  src: [
    {
      path: "./../fonts/MonumentExtended/MonumentExtended-UltraBold.otf",
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
  [goerli],
  [alchemyProvider({ apiKey: "llfowvw9cROhh7XIUWAmK7Jcy5RmJ_n_" })]
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
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <main
          className={`${monumentExtended.variable} ${lora.variable} initial-animation body-min-height relative bg-gradient-to-br from-backgroundPurple1 via-backgroundPurple2 to-backgroundPurple3 pb-[5vw] font-sans`}
        >
          <Navbar />
          <Lines
            className="absolute right-0 top-0"
            width={"28.34vw"}
            height={"80vw"}
            viewBox="0 0 524 1482"
          />
          <Component {...pageProps} />
          <Footer />
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
