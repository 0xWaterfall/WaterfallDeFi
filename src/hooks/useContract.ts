import { useWeb3React } from "@web3-react/core";
import { getContract, getSigner } from "hooks";
import { FeeRewardsAddress, MasterChefAddress, TranchesAddress, VeWTFAddress, WTFRewardsAddress } from "config/address";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { abi as ERC20Abi } from "config/abi/WTF.json";
import { abi as WTFRewardsAbi } from "config/abi/WTFRewards.json";
import { abi as VotingEscrowAbi } from "config/abi/VotingEscrow.json";
import { abi as LPRewardsAbi } from "config/abi/WTFLPRewards.json";
import { useMemo } from "react";
import { NETWORK } from "config";

export const useMasterchefContract = (masterChefAddress: string) => {
  const signer = getSigner();
  return useMemo(() => getContract(MasterChefAbi, masterChefAddress, signer), [signer]);
};

export const useTrancheMasterContract = (trancheMasterAddress: string) => {
  const signer = getSigner();
  return useMemo(() => getContract(TrancheMasterAbi, trancheMasterAddress, signer), [signer]);
};

export const useERC20Contract = (address: string) => {
  const signer = getSigner();
  console.log("onapprove", signer);
  return useMemo(() => getContract(ERC20Abi, address, signer), [signer]);
};

export const useVeWTFContract = () => {
  const signer = getSigner();
  return useMemo(() => getContract(VotingEscrowAbi, VeWTFAddress[NETWORK], signer), [signer]);
};

export const useWTFRewardsContract = () => {
  const signer = getSigner();
  return useMemo(() => getContract(WTFRewardsAbi, WTFRewardsAddress[NETWORK], signer), [signer]);
};

export const useFeeRewardsContract = () => {
  const signer = getSigner();
  return useMemo(() => getContract(WTFRewardsAbi, FeeRewardsAddress[NETWORK], signer), [signer]);
};

export const useLPRewardsContract = (LPRewardsAddress: string) => {
  const signer = getSigner();
  return useMemo(() => getContract(LPRewardsAbi, LPRewardsAddress, signer), [signer]);
};
