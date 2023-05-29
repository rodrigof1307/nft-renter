import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/image";
import { Header3, Header4 } from "./utils/Headers";
import { cn, dateFormater } from "@/utils/utils";
import { X, ChevronLeft } from "lucide-react";
import { ReactNode, useState } from "react";
import { ButtonNFT, IconButton } from "./utils/Buttons";
import { FilledInput, NumericInput } from "./utils/Input";
import ShadedBackground from "./utils/ShadedBackground";
import { erc721ABI, useChainId, useContractRead } from "wagmi";
import { ethers } from "ethers";
import { useQueryClient } from "react-query";
import {
  performClaimCollateral,
  performCollateralizedRentPublish,
  performNonCollateralizedRentPublish,
  performWithdrawNFT,
  performReturn,
  performRent,
  performBurn,
} from "@/actions/actions";
import { wrappedNftABI } from "@/consts";
import * as addresses from "../../addresses.json";

const collateralizedRentDescription =
  "On Collaterlized Rentals, the renter pays the rental value but also deposits a collateral value on an escrow smart contract in order to become the NFT owner. At the end of the rental period you are able to collect the rental value. If the renter doesn’t return the NFT before the expiration date you will be able to also collect the collateral.";

const nonCollateralizedRentDescription =
  "On Non-collaterlized Rentals, the renter pays the rental value and receives a wrapped token with the NFT properties. Your NFT remains on an escrow smart contract. Once the rental period ends you can collect the rental value and optionally also withdraw the NFT.";

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
        "fixed left-[50%] top-[50%] z-40 flex max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] flex-col justify-between rounded-[2vw] border-[0.4vw] bg-gradient-to-br from-shadedBackgroundPurple1 via-shadedBackgroundPurple2 to-shadedBackgroundPurple3 p-[1.5vw] focus:outline-none data-[state=open]:animate-contentShow md:h-[46vw] md:w-[68vw] md:flex-row md:rounded-[1.5vw] md:border-[0.2vw]",
        borderTone === "pink" && "border-brightPink",
        borderTone === "blue" && "border-brightBlue"
      )}
    >
      <div className="flex flex-row justify-start md:w-1/2 md:flex-col">
        <div className="relative mx-auto h-[35vw] w-[35vw] md:h-[21vw] md:w-[21vw]">
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
        <div className="m-auto text-center md:m-0 md:text-left">
          <Header3 className="mx-auto mb-[0.4vh] mt-[1vh] md:mx-0 md:mb-[0.4vw] md:mt-[0.9vw] md:whitespace-normal">
            {NFT.title}
          </Header3>
          <p className="text-mb-lg italic md:text-lg">{NFT.collectionName}</p>
          <p className="mt-[1.4vw] text-mb-md md:text-sm">{NFT.description}</p>
          {NFT.attributes && (
            <>
              <Header4 className="mx-auto mt-[1.4vh] md:mx-0 md:mt-[1.4vw]">Traits</Header4>
              {NFT.attributes.map((attribute, index) => (
                <p key={index} className="my-[0.6vw] text-mb-md md:text-sm">
                  {attribute.trait_type}: <span className="font-medium">{attribute.value}</span>
                </p>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="md:relative md:w-1/2">
        <AlertDialog.Cancel asChild>
          <X
            color="white"
            className="absolute right-[1vw] top-[1vw] hover:cursor-pointer md:right-0 md:top-0 md:h-[2.2vw] md:w-[2.2vw]"
          />
        </AlertDialog.Cancel>
        <div className="flex h-full w-full flex-col justify-start px-[2vw] pt-[2.5vw] md:px-0">{children}</div>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
);

const NFTRentalKeyInformation = ({ NFT }: NFTDialogProps) => {
  const showDate =
    NFT.expirationDate && NFT.expirationDate !== "0" && (NFT.collateral || NFT.expirationDate > Date.now().toString());
  const isCollateralized = NFT.collateral !== undefined;

  return (
    <>
      <Header4 className="mx-auto mb-[1.5vw]">
        {isCollateralized ? "Collateralized Rental" : "Non-Collateralized Rental"}
      </Header4>
      <p className="mb-[1.5vw] text-mb-md md:text-md">
        {isCollateralized ? collateralizedRentDescription : nonCollateralizedRentDescription}
      </p>
      <FilledInput label="Rent Rate:" value={NFT.rentRate?.toString()} unit="ETH/HOUR" />
      <FilledInput label="Collateral:" value={NFT.collateral?.toString()} unit="ETH" />
      {showDate && <FilledInput label="Expires on:" value={dateFormater(NFT.expirationDate)} unit="" />}
      {showDate && <FilledInput label="Total rent period:" value={NFT.rentPeriod?.toString()} unit="HOURS" />}
    </>
  );
};

interface NFTDialogProps {
  NFT: NFTInfo;
}

const WrappedTokenAction = ({ NFT }: NFTDialogProps) => {
  const { data } = useContractRead({
    address: NFT.address as `0x${string}`,
    abi: wrappedNftABI,
    functionName: "isTokenIDOwnerValid",
    args: [ethers.BigNumber.from(NFT.tokenID)],
  });

  const queryClient = useQueryClient();

  const [buttonText, setButtonText] = useState("BURN");

  const handleBurn = async () => {
    await performBurn(setButtonText, NFT, queryClient);
  };

  return (
    <>
      <p className="my-auto px-[4vw] text-center text-mb-lg font-medium md:text-lg">
        This item is a wrapped NFT that as been minted as part of our non-collateralized rentals and therefore you are
        not able to rent it in our platform.
      </p>
      {data === false && (
        <>
          <p className="absolute bottom-[5vw] left-[50%] w-4/5 translate-x-[-50%] text-center text-mb-lg font-medium md:text-lg">
            This rent isn&apos;t valid anymore. do you want to burn the wrapped NFT?
          </p>
          <ButtonNFT
            tone={"blue"}
            mode="dialog"
            className="absolute bottom-0 left-[50%] translate-x-[-50%]"
            onClick={handleBurn}
          >
            {buttonText}
          </ButtonNFT>
        </>
      )}
    </>
  );
};

const NFTDialogOwned = ({ NFT }: NFTDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<"collateralized" | "nonCollateralized" | undefined>();
  const [rentRate, setRentRate] = useState<string | undefined>();
  const [collateral, setCollateral] = useState<string | undefined>();
  const [collateralizedButtonText, setCollateralizedButtonText] = useState("RENT");
  const [nonCollateralizedButtonText, setNonCollateralizedButtonText] = useState("RENT");

  const chainId = useChainId();

  const isWrappedToken =
    NFT.address.toLowerCase() === addresses[chainId.toString() as keyof typeof addresses].WrappedNFT.toLowerCase();

  const queryClient = useQueryClient();

  const handleCollateralizedRent = async () => {
    if (!collateral || !rentRate) return;

    performCollateralizedRentPublish(setCollateralizedButtonText, NFT, rentRate, collateral, queryClient);
  };

  const handleNonCollateralizedRent = async () => {
    if (!rentRate) return;

    performNonCollateralizedRentPublish(setNonCollateralizedButtonText, NFT, rentRate, queryClient);
  };

  return (
    <NFTDialogBasis NFT={NFT} borderTone="blue">
      {isWrappedToken && <WrappedTokenAction NFT={NFT} />}
      {!selectedOption && !isWrappedToken && (
        <>
          <Header4 className="mx-auto mb-[1.5vw]">Choose your option</Header4>
          <div className="flex flex-1 flex-col justify-between">
            <Header4 className="mx-auto">Collateralized Rental</Header4>
            <p className="py-[1.5vh] text-mb-md md:py-0 md:text-md">{collateralizedRentDescription}</p>
            <ButtonNFT
              className="my-[0.5vh] md:my-0"
              tone={"blue"}
              mode="dialog"
              onClick={() => setSelectedOption("collateralized")}
            >
              SELECT
            </ButtonNFT>
          </div>
          <div className="my-[1.5vw] h-[0.1vw] w-full bg-brightBlue" />
          <div className="flex flex-1 flex-col justify-between">
            <Header4 className="mx-auto">Non-Collateralized Rental</Header4>
            <p className="py-[1.5vh] text-mb-md md:py-0 md:text-md">{nonCollateralizedRentDescription}</p>
            <ButtonNFT
              className="my-[0.5vh] md:my-0"
              tone={"blue"}
              mode="dialog"
              onClick={() => setSelectedOption("nonCollateralized")}
            >
              SELECT
            </ButtonNFT>
          </div>
        </>
      )}
      {selectedOption === "collateralized" && (
        <>
          <button onClick={() => setSelectedOption(undefined)}>
            <ChevronLeft
              color="white"
              className="absolute left-[1vw] top-[1vw] hover:cursor-pointer md:right-0 md:top-0 md:h-[2.2vw] md:w-[2.2vw]"
            />
          </button>
          <Header4 className="mx-auto mb-[1.5vw]">Collateralized Rental</Header4>
          <p className="mb-[1.5vw] py-[1.5vh] text-mb-md md:py-0 md:text-md">{collateralizedRentDescription}</p>
          <NumericInput label="Rent Rate:" unit="ETH/HOUR" value={rentRate} setterFunction={setRentRate} />
          <NumericInput label="Collateral:" unit="ETH" value={collateral} setterFunction={setCollateral} />
          <ButtonNFT
            tone={"blue"}
            mode="dialog"
            className="mb-[0.5vh] mt-[1.5vh] md:absolute md:bottom-0 md:left-[50%] md:translate-x-[-50%]"
            onClick={handleCollateralizedRent}
          >
            {collateralizedButtonText}
          </ButtonNFT>
        </>
      )}
      {selectedOption === "nonCollateralized" && (
        <>
          <button onClick={() => setSelectedOption(undefined)}>
            <ChevronLeft
              color="white"
              className="absolute left-[1vw] top-[1vw] hover:cursor-pointer md:right-0 md:top-0 md:h-[2.2vw] md:w-[2.2vw]"
            />
          </button>
          <Header4 className="mx-auto mb-[1.5vw]">Non-Collateralized Rental</Header4>
          <p className="mb-[1.5vw] py-[1.5vh] text-mb-md md:py-0 md:text-md">{nonCollateralizedRentDescription}</p>
          <NumericInput label="Rent Rate:" unit="ETH/HOUR" value={rentRate} setterFunction={setRentRate} />
          <ButtonNFT
            tone={"blue"}
            mode="dialog"
            className="mb-[0.5vh] mt-[1.5vh] md:absolute md:bottom-0 md:left-[50%] md:translate-x-[-50%]"
            onClick={handleNonCollateralizedRent}
          >
            {nonCollateralizedButtonText}
          </ButtonNFT>
        </>
      )}
    </NFTDialogBasis>
  );
};

const LentedAction = ({ NFT }: NFTDialogProps) => {
  const [buttonText, setButtonText] = useState("");

  const queryClient = useQueryClient();

  const { data: dataERC721 } = useContractRead({
    address: NFT.address as `0x${string}`,
    abi: erc721ABI,
    functionName: "ownerOf",
    args: [ethers.BigNumber.from(NFT.tokenID)],
  });

  // If the NFT is withdrawable
  if (
    (NFT.collateral && dataERC721 === NFT.rentSCAddress) ||
    (!NFT.collateral && Date.now().toString() > (NFT.expirationDate ?? "0"))
  ) {
    const handleWithdraw = async () => {
      if (buttonText !== "") return;
      await performWithdrawNFT(setButtonText, NFT, queryClient);
    };

    return (
      <ButtonNFT
        tone={"blue"}
        mode="dialog"
        className="mb-[0.5vh] mt-[1.5vh] md:absolute md:bottom-0 md:left-[50%] md:translate-x-[-50%]"
        onClick={handleWithdraw}
      >
        {buttonText || "WITHDRAW"}
      </ButtonNFT>
    );
  }

  // If the NFT is not withdrawable but its collateral is claimable
  if (NFT.collateral && NFT.expirationDate && Date.now().toString() > NFT.expirationDate) {
    const handleClaim = async () => {
      if (buttonText !== "") return;
      await performClaimCollateral(setButtonText, NFT, queryClient);
    };

    return (
      <>
        <p className="py-[1.5vh] text-center text-mb-lg font-medium md:absolute md:bottom-[5vw] md:left-[50%] md:translate-x-[-50%] md:py-0 md:text-lg">
          You can claim the collateral since the renter hasn&apos;t returned the NFT yet
        </p>
        <ButtonNFT
          tone={"blue"}
          mode="dialog"
          className="mb-[0.5vh] mt-[0vh] md:absolute md:bottom-0 md:left-[50%] md:translate-x-[-50%]"
          onClick={handleClaim}
        >
          {buttonText || "CLAIM"}
        </ButtonNFT>
      </>
    );
  }

  // If the NFT rental is still valid and therefore it's not withdrawable nor claimable
  return (
    <p className="py-[1.5vh] text-center text-mb-lg font-medium md:absolute md:bottom-[1.5vw] md:left-[50%] md:translate-x-[-50%] md:py-0 md:text-lg">
      Since this NFT is currently rented you are unable to withdraw it
    </p>
  );
};

const NFTDialogLented = ({ NFT }: NFTDialogProps) => {
  return (
    <NFTDialogBasis NFT={NFT} borderTone="blue">
      <NFTRentalKeyInformation NFT={NFT} />
      <LentedAction NFT={NFT} />
    </NFTDialogBasis>
  );
};

const NFTDialogRented = ({ NFT }: NFTDialogProps) => {
  const queryClient = useQueryClient();

  const [buttonText, setButtonText] = useState("RETURN");

  const handleReturnNFT = async () => {
    if (buttonText !== "RETURN") return;
    await performReturn(setButtonText, NFT, queryClient);
  };

  return (
    <NFTDialogBasis NFT={NFT} borderTone="pink">
      <NFTRentalKeyInformation NFT={NFT} />
      {NFT.collateral ? (
        <ButtonNFT
          tone={"pink"}
          mode="dialog"
          className="mb-[0.5vh] mt-[1.5vh] md:absolute md:bottom-0 md:left-[50%] md:translate-x-[-50%]"
          onClick={handleReturnNFT}
        >
          {buttonText}
        </ButtonNFT>
      ) : (
        <p className="py-[1.5vh] text-center text-mb-lg font-medium md:absolute md:bottom-[1.5vw] md:left-[50%] md:w-4/5 md:translate-x-[-50%] md:py-0 md:text-lg">
          Once the rental period is over your wrapped token will become automatically invalid
        </p>
      )}
    </NFTDialogBasis>
  );
};

const NFTDialogMarketplace = ({ NFT }: NFTDialogProps) => {
  const [rentHours, setRentHours] = useState<number | undefined>(1);
  const [buttonText, setButtonText] = useState("RENT");

  const queryClient = useQueryClient();

  const handleRent = () => {
    if (!rentHours || buttonText !== "RENT") return;
    performRent(setButtonText, NFT, rentHours, queryClient);
  };

  const handleRentHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setRentHours(undefined);
      return;
    }
    if (!Number(event.target.value)) {
      setRentHours((prev) => prev);
      return;
    }
    setRentHours(Number(event.target.value));
  };

  const decreaseRentHours = () => {
    if (rentHours === undefined || rentHours === 1) {
      return;
    }
    // We can use the nullish coalescing operator here because we know that rentHours is not undefined
    setRentHours((prev) => prev! - 1);
  };

  const increaseRentHours = () => {
    if (rentHours === undefined) {
      setRentHours(1);
      return;
    }
    // We can use the nullish coalescing operator here because we know that rentHours is not undefined
    setRentHours((prev) => prev! + 1);
  };

  const calculateTotalValue = () => ((rentHours ?? 0) * (NFT.rentRate ?? 0) + (NFT.collateral ?? 0)).toFixed(2);

  return (
    <NFTDialogBasis NFT={NFT} borderTone="pink">
      <NFTRentalKeyInformation NFT={NFT} />
      <p className="mx-auto py-[1.5vh] text-mb-lg md:py-[1.5vw] md:text-lg">{"Rent period (hours)"}</p>
      <div className="mx-auto flex w-[25vw] flex-row items-center justify-between md:w-[13vw]">
        <IconButton iconType="minus" onClick={decreaseRentHours} />
        <ShadedBackground className="flex h-[8vw] w-[8vw] items-center justify-center rounded-[1.2vw] border-[0.3vw] bg-black/25 bg-none md:h-[4vw] md:w-[4vw] md:rounded-[0.6vw] md:border-[0.15vw]">
          <input
            value={rentHours ?? ""}
            type={"string"}
            onChange={handleRentHoursChange}
            className="w-[7vw] bg-transparent text-center font-highlight text-mb-2xl outline-none md:w-[3.5vw] md:text-2xl"
          />
        </ShadedBackground>
        <IconButton iconType="plus" onClick={increaseRentHours} />
      </div>
      <FilledInput
        className="pb-[0.5vh] pt-[1vh] md:absolute md:bottom-[5vw] md:left-0 md:py-0"
        label="Total Value:"
        unit="ETH"
        value={calculateTotalValue()}
      />
      <ButtonNFT
        tone={"pink"}
        mode="dialog"
        className="my-[1vh] md:absolute md:bottom-0 md:left-[50%] md:my-0 md:translate-x-[-50%]"
        onClick={handleRent}
      >
        {buttonText}
      </ButtonNFT>
    </NFTDialogBasis>
  );
};

export { NFTDialogOwned, NFTDialogLented, NFTDialogRented, NFTDialogMarketplace };
