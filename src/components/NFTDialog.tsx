import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/image";
import { Header3, Header4 } from "./utils/Headers";
import { cn } from "@/utils/utils";
import { X } from "lucide-react";
import { ReactNode, useState } from "react";
import { ButtonNFT } from "./utils/Buttons";

interface NFTDialogBasisProps {
  children: ReactNode;
  NFT: NFTInfo;
  borderTone: "pink" | "blue";
}

const NFTDialogBasis = ({ NFT, borderTone, children }: NFTDialogBasisProps) => (
  <AlertDialog.Portal>
    <AlertDialog.Overlay className="fixed inset-0 z-30 bg-black/80 data-[state=open]:animate-overlayShow" />
    <AlertDialog.Content
      className={cn(
        "fixed left-[50%] top-[50%] z-40 flex h-[46vw] max-h-[85vh] w-[68vw] translate-x-[-50%] translate-y-[-50%] flex-row justify-between rounded-[1.5vw] border-[0.2vw] bg-gradient-to-br from-shadedBackgroundPurple1 via-shadedBackgroundPurple2 to-shadedBackgroundPurple3 p-[1.5vw] focus:outline-none data-[state=open]:animate-contentShow",
        borderTone === "pink" && "border-brightPink",
        borderTone === "blue" && "border-brightBlue"
      )}
    >
      <div className="w-1/2">
        <div className="relative mx-auto h-[21vw] w-[21vw]">
          <Image
            fill
            style={{ objectFit: "contain" }}
            alt="NFT Image"
            src={NFT.image ?? ""}
            unoptimized={true}
            loading="eager"
            className="rounded-[1vw]"
          />
        </div>
        <Header3 className="mb-[0.4vw] mt-[0.9vw] whitespace-normal">{NFT.title}</Header3>
        <p className="text-lg italic">{NFT.collectionName}</p>
        <p className="mt-[1.4vw] text-sm">{NFT.description}</p>
        {NFT.attributes && (
          <>
            <Header4 className="mt-[1.4vw]">Traits</Header4>
            {NFT.attributes.map((attribute, index) => (
              <p key={index} className="my-[0.6vw] text-sm">
                {attribute.trait_type}: <span className="font-medium">{attribute.value}</span>
              </p>
            ))}
          </>
        )}
      </div>
      <div className="relative w-1/2">
        <AlertDialog.Cancel asChild>
          <X size={"2.2vw"} color="white" className="absolute right-0 top-0 hover:cursor-pointer" />
        </AlertDialog.Cancel>
        {children}
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
);

interface NFTDialogProps {
  NFT: NFTInfo;
}

const NFTDialogOwned = ({ NFT }: NFTDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<"collateralized" | "nonCollateralized" | undefined>();

  return (
    <NFTDialogBasis NFT={NFT} borderTone="blue">
      {!selectedOption && (
        <div className="flex w-full flex-col justify-start pt-[2.5vw]">
          <Header4 className="mx-auto mb-[1vw]">Choose your option</Header4>
          <Header4 className="mx-auto">Collateralized Rental</Header4>
          <p className="my-[1vw]">
            On Collaterlized Rentals, the renter pays the rental value but also deposits a collateral value on an escrow
            smart contract in order to become the NFT owner. At the end of the rental period you are able to collect the
            rental value. If the renter doesn’t return the NFT before the expiration date you will be able to also
            collect the collateral.
          </p>
          <ButtonNFT tone={"blue"} mode="dialog" onClick={() => setSelectedOption("collateralized")}>
            SELECT
          </ButtonNFT>
          <div className="my-[1.5vw] h-[0.1vw] w-full bg-brightBlue" />
          <Header4 className="mx-auto">Non-Collateralized Rental</Header4>
          <p className="my-[1vw]">
            On Non-collaterlized Rentals, the renter pays the rental value and receives a wrapped token with the NFT
            properties. Your NFT remains on an escrow smart contract. Once the rental period ends you can collect the
            rental value and optionally also withdraw the NFT.
          </p>
          <ButtonNFT tone={"blue"} mode="dialog" onClick={() => setSelectedOption("nonCollateralized")}>
            SELECT
          </ButtonNFT>
        </div>
      )}
      {selectedOption === "collateralized" && (
        <div className="flex w-full flex-col justify-start pt-[2.5vw]">
          <Header4 className="mx-auto">Collateralized Rental</Header4>
          <p className="my-[1vw]">
            On Collaterlized Rentals, the renter pays the rental value but also deposits a collateral value on an escrow
            smart contract in order to become the NFT owner. At the end of the rental period you are able to collect the
            rental value. If the renter doesn’t return the NFT before the expiration date you will be able to also
            collect the collateral.
          </p>
        </div>
      )}
      {selectedOption === "nonCollateralized" && (
        <div className="flex w-full flex-col justify-start pt-[2.5vw]">
          <Header4 className="mx-auto">Non-Collateralized Rental</Header4>
          <p className="my-[1vw]">
            On Non-collaterlized Rentals, the renter pays the rental value and receives a wrapped token with the NFT
            properties. Your NFT remains on an escrow smart contract. Once the rental period ends you can collect the
            rental value and optionally also withdraw the NFT.
          </p>
        </div>
      )}
    </NFTDialogBasis>
  );
};

export { NFTDialogOwned };
