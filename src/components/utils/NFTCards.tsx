import ShadedBackground from "./ShadedBackground";
import { Header4 } from "./Headers";
import { ButtonNFT } from "./Buttons";
import Image from "next/image";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { NFTDialogOwned } from "../NFTDialog";

import { ReactNode } from "react";

interface NFTLoadingCardProps {
  borderTone: "pink" | "blue";
}

const NFTLoadingCard = ({ borderTone }: NFTLoadingCardProps) => (
  <ShadedBackground borderTone={borderTone} className="relative box-border h-[32vw] w-[20vw] animate-pulse p-[1vw]">
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

const NFTCardBasis = ({ NFT, borderTone, children }: NFTCardBasisProps) => (
  <ShadedBackground borderTone={borderTone} className="relative box-border h-[32vw] w-[20vw] p-[1vw]">
    <div className="relative h-[17.6vw] w-[17.6vw]">
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
    <Header4 className="mb-[0.4vw] mt-[0.9vw]">{NFT.title}</Header4>
    <p className="text-sm italic">{NFT.collectionName}</p>
    {children}
  </ShadedBackground>
);

interface NFTCardOwnedProps {
  NFT: NFTInfo;
}

const NFTCardOwned = ({ NFT }: NFTCardOwnedProps) => (
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

type NFTsType = "myCollectionOwned" | "myCollectionLented" | "myCollectionRented" | "marketplace";

enum NFTsTypeColor {
  myCollectionOwned = "blue",
  myCollectionLented = "blue",
  myCollectionRented = "pink",
  marketplace = "pink",
}

interface NFTCard {
  NFT: NFTInfo;
  NFTsType: NFTsType;
}

const NFTCard = ({ NFT, NFTsType }: NFTCard) => {
  switch (NFTsType) {
    case "myCollectionOwned":
      return <NFTCardOwned NFT={NFT} />;
    case "myCollectionLented":
      return <NFTCardOwned NFT={NFT} />;
    case "myCollectionRented":
      return <NFTCardOwned NFT={NFT} />;
    case "marketplace":
      return <NFTCardOwned NFT={NFT} />;
  }
};

interface NFTsContainerProps {
  children: ReactNode;
}

const NFTsContainer = ({ children }: NFTsContainerProps) => (
  <div className="mb-[3vw] mt-[2vw] grid w-full grid-cols-4 gap-y-[2.5vw]">{children}</div>
);

interface NFTsDisplayerProps {
  NFTs: NFTInfo[];
  NFTsType: NFTsType;
  loading: boolean;
}

const NFTsDisplayer = ({ NFTs, NFTsType, loading }: NFTsDisplayerProps) => {
  if (loading) {
    return (
      <NFTsContainer>
        <NFTLoadingCard borderTone={NFTsTypeColor[NFTsType]} />
        <NFTLoadingCard borderTone={NFTsTypeColor[NFTsType]} />
        <NFTLoadingCard borderTone={NFTsTypeColor[NFTsType]} />
        <NFTLoadingCard borderTone={NFTsTypeColor[NFTsType]} />
      </NFTsContainer>
    );
  }

  return (
    <NFTsContainer>
      {NFTs.length === 0 ? (
        <p>Teste</p>
      ) : (
        <>
          {NFTs.map((NFT) => (
            <NFTCard NFT={NFT} NFTsType={NFTsType} key={NFT.address + NFT.tokenID} />
          ))}
        </>
      )}
    </NFTsContainer>
  );
};

export default NFTsDisplayer;
