import { useWeb3React } from "@web3-react/core";
import { getContract, getSigner } from "hooks";
import { MasterChefAddress, TranchesAddress } from "config/address";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { abi as ERC20Abi } from "config/abi/WTF.json";
import { useMemo } from "react";
import { NETWORK } from "config";

export const useMasterchefContract = () => {
  const signer = getSigner();
  return useMemo(() => getContract(MasterChefAbi, MasterChefAddress[NETWORK], signer), [signer]);
};

export const useTrancheMasterContract = () => {
  const signer = getSigner();
  return useMemo(() => getContract(TrancheMasterAbi, TranchesAddress[NETWORK], signer), [signer]);
};

export const useERC20Contract = (address: string) => {
  const signer = getSigner();
  return useMemo(() => getContract(ERC20Abi, address, signer), [signer]);
};
