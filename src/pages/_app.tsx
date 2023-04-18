import "@/styles/globals.css";

import type { AppProps } from "next/app";
import localFont from "@next/font/local";
import { Lora } from "@next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${monumentExtended.variable} ${lora.variable} bg-gradient-to-br from-backgroundPurple1 via-backgroundPurple2 to-backgroundPurple3 font-sans`}
    >
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </main>
  );
}
