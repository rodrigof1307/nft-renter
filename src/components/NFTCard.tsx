import ShadedBackground from "./utils/ShadedBackground";
import { Header4 } from "./utils/Headers";
import { ButtonNFT } from "./utils/Buttons";
import Image from "next/image";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { NFTDialogLented, NFTDialogMarketplace, NFTDialogOwned, NFTDialogRented } from "./NFTDialog";
import { dateFormater } from "@/utils/utils";
import { useContractRead, erc721ABI } from "wagmi";
import { ethers } from "ethers";

import { ReactNode } from "react";
import { FilledInput } from "./utils/Input";

interface NFTLoadingCardProps {
  borderTone: "pink" | "blue";
}

const NFTLoadingCard = ({ borderTone }: NFTLoadingCardProps) => (
  <ShadedBackground
    borderTone={borderTone}
    className="relative box-border h-[46.2vw] w-[30vw] animate-pulse p-[1.4vw] md:h-[33vw] md:w-[20vw] md:p-[1vw]"
  >
    <div className="relative h-[17.6vw] w-[17.6vw] rounded-[1vw] bg-black/25" />
    <div className="relative mb-[0.4vw] mt-[0.9vw] h-[1.7vw] w-[17.6vw] rounded-[0.25vw] bg-black/25" />
    <div className="relative h-[1vw] w-[17.6vw] rounded-[0.25vw] bg-black/25" />
    <div className="absolute bottom-[1vw] left-[1vw] h-[4vw] w-[17.6vw] rounded-[0.6vw] bg-black/25" />
  </ShadedBackground>
);

interface NFTCardBasisProps {
  NFT: NFTInfo;
  borderTone: "pink" | "blue";
  children?: ReactNode;
}

const NFTCardBasis = ({ NFT, borderTone, children }: NFTCardBasisProps) => {
  const showDate =
    NFT.expirationDate && NFT.expirationDate !== "0" && (NFT.collateral || NFT.expirationDate > Date.now().toString());

  return (
    <ShadedBackground
      borderTone={borderTone}
      className="relative box-border h-[46.2vw] w-[30vw] p-[1.4vw] md:h-[33vw] md:w-[20vw] md:p-[1vw]"
    >
      <div className="relative mx-auto h-[22vw] w-[22vw] md:h-[17.6vw] md:w-[17.6vw]">
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
      <Header4 className="mb-[0.5vw] mt-[1.1vw] md:mb-[0.4vw] md:mt-[0.9vw]">{NFT.title}</Header4>
      <p className="text-mb-sm italic md:text-sm">{NFT.collectionName}</p>
      <FilledInput
        label="Rent Rate:"
        value={NFT.rentRate?.toString()}
        unit="ETH/HOUR"
        size="sm"
        className="text-mb-xs"
      />
      <FilledInput label="Collateral:" value={NFT.collateral?.toString()} unit="ETH" size="sm" className="text-mb-xs" />
      {showDate && (
        <FilledInput
          label="Expires on:"
          value={dateFormater(NFT.expirationDate)}
          unit=""
          size="sm"
          className="text-mb-xs"
        />
      )}
      {children}
    </ShadedBackground>
  );
};

interface NFTCardProps {
  NFT: NFTInfo;
}

const NFTCardOwned = ({ NFT }: NFTCardProps) => (
  <NFTCardBasis NFT={NFT} borderTone="blue">
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <ButtonNFT tone="blue" mode="card">
          LENT
        </ButtonNFT>
      </AlertDialog.Trigger>
      <NFTDialogOwned NFT={NFT} />
    </AlertDialog.Root>
  </NFTCardBasis>
);

const NFTCardLented = ({ NFT }: NFTCardProps) => {
  const { data: dataERC721 } = useContractRead({
    address: NFT.address as `0x${string}`,
    abi: erc721ABI,
    functionName: "ownerOf",
    args: [ethers.BigNumber.from(NFT.tokenID)],
  });

  const actionTitle = () => {
    if (
      (NFT.collateral && dataERC721 === NFT.rentSCAddress) ||
      (!NFT.collateral && Date.now().toString() > (NFT.expirationDate ?? "0"))
    ) {
      return "WITHDRAW";
    }
    if (NFT.collateral && NFT.expirationDate && Date.now().toString() > NFT.expirationDate) {
      return "CLAIM";
    }
    return "INFO";
  };

  return (
    <NFTCardBasis NFT={NFT} borderTone="blue">
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <ButtonNFT tone="blue" mode="card">
            {actionTitle()}
          </ButtonNFT>
        </AlertDialog.Trigger>
        <NFTDialogLented NFT={NFT} />
      </AlertDialog.Root>
    </NFTCardBasis>
  );
};

const NFTCardRented = ({ NFT }: NFTCardProps) => {
  return (
    <NFTCardBasis NFT={NFT} borderTone="pink">
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <ButtonNFT tone="pink" mode="card">
            {NFT.collateral ? "RETURN" : "INFO"}
          </ButtonNFT>
        </AlertDialog.Trigger>
        <NFTDialogRented NFT={NFT} />
      </AlertDialog.Root>
    </NFTCardBasis>
  );
};

const NFTCardMarketplace = ({ NFT }: NFTCardProps) => {
  return (
    <NFTCardBasis NFT={NFT} borderTone="pink">
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <ButtonNFT tone="pink" mode="card">
            RENT
          </ButtonNFT>
        </AlertDialog.Trigger>
        <NFTDialogMarketplace NFT={NFT} />
      </AlertDialog.Root>
    </NFTCardBasis>
  );
};

interface NFTCard {
  NFT: NFTInfo;
  NFTsType: NFTsType;
}

const NFTCard = ({ NFT, NFTsType }: NFTCard) => {
  switch (NFTsType) {
    case "myCollectionOwned":
      return <NFTCardOwned NFT={NFT} />;
    case "myCollectionLented":
      return <NFTCardLented NFT={NFT} />;
    case "myCollectionRented":
      return <NFTCardRented NFT={NFT} />;
    case "marketplace":
      return <NFTCardMarketplace NFT={NFT} />;
  }
};

export { NFTCard, NFTLoadingCard };
