import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/image";
import { Header3, Header4 } from "./utils/Headers";
import { cn, dateFormater } from "@/utils/utils";
import { X, ChevronLeft } from "lucide-react";
import { ReactNode, useState } from "react";
import { ButtonNFT, IconButton } from "./utils/Buttons";
import { FilledInput, NumericInput } from "./utils/Input";
import ShadedBackground from "./utils/ShadedBackground";

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
        <div className="flex h-full w-full flex-col justify-start pt-[2.5vw]">{children}</div>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
);

const NFTRentalKeyInformation = ({ NFT }: NFTDialogProps) => {
  const isWithdrawable = !NFT.expirationDate || new Date().toISOString() > NFT.expirationDate;
  const isCollateralized = NFT.collateral !== undefined;

  return (
    <>
      <Header4 className="mx-auto mb-[1.5vw]">
        {isCollateralized ? "Collateralized Rental" : "Non-Collateralized Rental"}
      </Header4>
      <p className="mb-[1.5vw]">
        {isCollateralized ? collateralizedRentDescription : nonCollateralizedRentDescription}
      </p>
      <FilledInput label="Rent Rate:" value={NFT.rentRate?.toString()} unit="ETH/HOUR" />
      <FilledInput label="Collateral:" value={NFT.collateral?.toString()} unit="ETH" />
      {!isWithdrawable && (
        <FilledInput label="Expires on:" value={dateFormater(NFT.expirationDate)} unit="" size="sm" />
      )}
      {!isWithdrawable && (
        <FilledInput label="Total rent period:" value={NFT.rentPeriod?.toString()} unit="DAYS" size="sm" />
      )}
    </>
  );
};

interface NFTDialogProps {
  NFT: NFTInfo;
}

const NFTDialogOwned = ({ NFT }: NFTDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<"collateralized" | "nonCollateralized" | undefined>();
  const [rentRate, setRentRate] = useState<number | undefined>();
  const [collateral, setCollateral] = useState<number | undefined>();

  return (
    <NFTDialogBasis NFT={NFT} borderTone="blue">
      {!selectedOption && (
        <>
          <Header4 className="mx-auto mb-[1.5vw]">Choose your option</Header4>
          <div className="flex flex-1 flex-col justify-between">
            <Header4 className="mx-auto">Collateralized Rental</Header4>
            <p>{collateralizedRentDescription}</p>
            <ButtonNFT tone={"blue"} mode="dialog" onClick={() => setSelectedOption("collateralized")}>
              SELECT
            </ButtonNFT>
          </div>
          <div className="my-[1.5vw] h-[0.1vw] w-full bg-brightBlue" />
          <div className="flex flex-1 flex-col justify-between">
            <Header4 className="mx-auto">Non-Collateralized Rental</Header4>
            <p>{nonCollateralizedRentDescription}</p>
            <ButtonNFT tone={"blue"} mode="dialog" onClick={() => setSelectedOption("nonCollateralized")}>
              SELECT
            </ButtonNFT>
          </div>
        </>
      )}
      {selectedOption === "collateralized" && (
        <>
          <button onClick={() => setSelectedOption(undefined)}>
            <ChevronLeft size={"2.2vw"} color="white" className="absolute left-0 top-0 hover:cursor-pointer" />
          </button>
          <Header4 className="mx-auto mb-[1.5vw]">Collateralized Rental</Header4>
          <p className="mb-[1.5vw]">{collateralizedRentDescription}</p>
          <NumericInput label="Rent Rate:" unit="ETH/HOUR" value={rentRate} setterFunction={setRentRate} />
          <NumericInput label="Collateral:" unit="ETH" value={collateral} setterFunction={setCollateral} />
          <ButtonNFT
            tone={"blue"}
            mode="dialog"
            className="absolute bottom-0 left-[50%] translate-x-[-50%]"
            onClick={() => setSelectedOption("nonCollateralized")}
          >
            LENT
          </ButtonNFT>
        </>
      )}
      {selectedOption === "nonCollateralized" && (
        <>
          <button onClick={() => setSelectedOption(undefined)}>
            <ChevronLeft size={"2.2vw"} color="white" className="absolute left-0 top-0 hover:cursor-pointer" />
          </button>
          <Header4 className="mx-auto mb-[1.5vw]">Non-Collateralized Rental</Header4>
          <p className="mb-[1.5vw]">{nonCollateralizedRentDescription}</p>
          <NumericInput label="Rent Rate:" unit="ETH/HOUR" value={rentRate} setterFunction={setRentRate} />
          <ButtonNFT
            tone={"blue"}
            mode="dialog"
            className="absolute bottom-0 left-[50%] translate-x-[-50%]"
            onClick={() => setSelectedOption("nonCollateralized")}
          >
            LENT
          </ButtonNFT>
        </>
      )}
    </NFTDialogBasis>
  );
};

const NFTDialogLented = ({ NFT }: NFTDialogProps) => {
  const isWithdrawable = !NFT.expirationDate || new Date().toISOString() > NFT.expirationDate;

  return (
    <NFTDialogBasis NFT={NFT} borderTone="blue">
      <NFTRentalKeyInformation NFT={NFT} />
      {isWithdrawable ? (
        <ButtonNFT tone={"blue"} mode="dialog" className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          WITHDRAW
        </ButtonNFT>
      ) : (
        <p className="absolute bottom-[1.5vw] left-[50%] w-4/5 translate-x-[-50%] text-center text-lg font-medium">
          Since this NFT is currently rented you are unable to withdraw it
        </p>
      )}
    </NFTDialogBasis>
  );
};

const NFTDialogRented = ({ NFT }: NFTDialogProps) => {
  return (
    <NFTDialogBasis NFT={NFT} borderTone="pink">
      <NFTRentalKeyInformation NFT={NFT} />
      {!NFT.collateral ? (
        <ButtonNFT tone={"pink"} mode="dialog" className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          RETURN
        </ButtonNFT>
      ) : (
        <p className="absolute bottom-[1.5vw] left-[50%] w-4/5 translate-x-[-50%] text-center text-lg font-medium">
          Once the rental period is over your wrapped token will become automatically invalid
        </p>
      )}
    </NFTDialogBasis>
  );
};

const NFTDialogMarketplace = ({ NFT }: NFTDialogProps) => {
  const [rentHours, setRentHours] = useState<number | undefined>(1);

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
      <p className="mx-auto py-[1.5vw] text-lg">{"Rent period (hours)"}</p>
      <div className="mx-auto flex w-[13vw] flex-row items-center justify-between">
        <IconButton iconType="minus" onClick={decreaseRentHours} />
        <ShadedBackground className="flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.6vw] border-[0.15vw] bg-black/25 bg-none">
          <input
            value={rentHours ?? ""}
            type={"string"}
            onChange={handleRentHoursChange}
            className="w-[3.5vw] bg-transparent text-center font-highlight text-2xl outline-none"
          />
        </ShadedBackground>
        <IconButton iconType="plus" onClick={increaseRentHours} />
      </div>
      <FilledInput
        className="absolute bottom-[5vw] left-0"
        label="Total Value:"
        unit="ETH"
        value={calculateTotalValue()}
      />
      <ButtonNFT tone={"pink"} mode="dialog" className="absolute bottom-0 left-[50%] translate-x-[-50%]">
        RENT
      </ButtonNFT>
    </NFTDialogBasis>
  );
};

export { NFTDialogOwned, NFTDialogLented, NFTDialogRented, NFTDialogMarketplace };
