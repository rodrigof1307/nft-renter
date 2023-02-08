import { ethers } from "ethers";
import { createContext } from "react";

interface SignerContextType {
    signer: ethers.providers.JsonRpcSigner | undefined;
    setSigner: (signer: ethers.providers.JsonRpcSigner | undefined) => void;
}

const SignerContext = createContext<SignerContextType | undefined>(undefined);

export default SignerContext;