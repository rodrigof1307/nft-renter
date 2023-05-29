export interface networkConfigItem {
  name?: string;
}

export interface networkConfigInfo {
  [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: "hardhat",
  },
  11155111: {
    name: "sepolia",
  },
};

export const developmentChains = ["hardhat", "localhost"];
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
export const addressesFilePath = "./addresses.json";
export const contractsInfoFilePath = "./src/consts/";
