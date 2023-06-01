import { Header3, Header4 } from "./utils/Headers";
import ShadedBackground from "./utils/ShadedBackground";
import * as Toast from "@radix-ui/react-toast";
import { shortenHash } from "@/utils/utils";
import { Copy } from "lucide-react";
import { useState } from "react";

const ImportDemoAccount = () => {
  const [open, setOpen] = useState(false);

  const copyToClipboard = () => {
    setOpen(true);
    setTimeout(() => setOpen(false), 3000);
    navigator.clipboard.writeText("4d9325dc07fb1e6fd0b0fe323320892644524c21e0bbe5025f6aad092d2bfa0f");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-[0.75vw]">
      <Header3 className="overflow-hidden text-clip whitespace-normal  text-center text-mb-2xl md:truncate">
        Connect this demo account
      </Header3>
      <div className="flex items-center justify-center gap-[1.5vw]">
        <Header4 className="text-center text-mb-xl">Private Key</Header4>
        <ShadedBackground className="rounded-[0.75vw] border-opacity-70 px-[1.25vw] py-[0.75vw] hover:border-opacity-100 active:border-opacity-70">
          <Toast.Provider swipeDirection="right">
            <button
              className="flex items-center justify-center gap-[1.25vw] text-mb-xl active:opacity-70"
              onClick={copyToClipboard}
            >
              <Header4>{shortenHash("4d9325dc07fb1e6fd0b0fe323320892644524c21e0bbe5025f6aad092d2bfa0f")}</Header4>
              <Copy className="block h-6 w-6" />
            </button>
            <Toast.Root
              className="data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
              open={open}
              onOpenChange={setOpen}
            >
              <ShadedBackground className="rounded-[1vw] p-[1.25vw]">
                <Toast.Title className="text-center font-highlight">Private Key Copied to Clipboard</Toast.Title>
              </ShadedBackground>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-[1.75vw] right-[1.75vw]" />
          </Toast.Provider>
        </ShadedBackground>
      </div>
    </div>
  );
};

export default ImportDemoAccount;
