import { getContract2, getSigner } from "hooks";
import {
  FeeRewardsAddressBNB,
  VeWTFAddressAVAX,
  VeWTFAddressBNB,
  WrapAVAXAddress,
  WTFRewardsAddressBNB,
  WTFRewardsAddressAVAX
} from "config/address";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { abi as MulticurrencyTrancheMasterAbi } from "config/abi/MC_TrancheMaster.json";
import { abi as AutorollingTrancheMasterAbi } from "config/abi/AR_TrancheMaster.json";
import { abi as AVAXAutorollingTrancheMasterAbi } from "config/abi/AR_AVAXTrancheMaster.json";
import { abi as ERC20Abi } from "config/abi/WTF.json";
import { abi as WTFRewardsAbi } from "config/abi/WTFRewards.json";
import { abi as VotingEscrowAbi } from "config/abi/VotingEscrow.json";
import { abi as LPRewardsAbi } from "config/abi/WTFLPRewards.json";
import { abi as AVAXTrancheMasterAbi } from "config/abi/AVAXTrancheMaster.json";
import { abi as WrapAVAXFallsAbi } from "config/abi/WrapAVAX.json";
import { useMemo } from "react";
import { NETWORK } from "config";
import { useNetwork } from "./useSelectors";

export const useMasterchefContract = (masterChefAddress: string) => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(() => getContract2(MasterChefAbi, masterChefAddress, network, signer), [network, signer]);
};

export const useTrancheMasterContract = (trancheMasterAddress: string) => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(() => getContract2(TrancheMasterAbi, trancheMasterAddress, network, signer), [network, signer]);
};
export const useAVAXTrancheMasterContract = (trancheMasterAddress: string) => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(() => getContract2(AVAXTrancheMasterAbi, trancheMasterAddress, network, signer), [network, signer]);
};

export const useMulticurrencyTrancheMasterContract = (trancheMasterAddress: string) => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(
    () => getContract2(MulticurrencyTrancheMasterAbi, trancheMasterAddress, network, signer),
    [network, signer]
  );
};

//TODO: REMEMBER TO FOLD THIS INTO *useTrancheMasterContract*!!! AutorollingTrancheMasterAbi should REPLACE TrancheMasterAbi!!!
export const useAutorollingTrancheMasterContract = (trancheMasterAddress: string) => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(
    () =>
      getContract2(
        network === "bnb" ? AutorollingTrancheMasterAbi : AVAXAutorollingTrancheMasterAbi,
        trancheMasterAddress,
        network,
        signer
      ),
    [network, signer]
  );
};

export const useERC20Contract = (address: string) => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(() => getContract2(ERC20Abi, address, network, signer), [network, signer]);
};

export const useVeWTFContract = () => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(
    () =>
      getContract2(
        VotingEscrowAbi,
        network === "bnb" ? VeWTFAddressBNB[NETWORK] : VeWTFAddressAVAX[NETWORK],
        network,
        signer
      ),
    [network, signer]
  );
};

export const useWTFRewardsContract = () => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(
    () =>
      getContract2(
        WTFRewardsAbi,
        network === "bnb" ? WTFRewardsAddressBNB[NETWORK] : WTFRewardsAddressAVAX[NETWORK],
        network,
        signer
      ),
    [network, signer]
  );
};

export const useFeeRewardsContract = () => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(
    () =>
      getContract2(
        WTFRewardsAbi,
        //incoming from Kirill:
        // network === "avax" ? FeeRewardsAddressBNB[NETWORK] : FeeRewardsAddressAVAX[NETWORK],
        FeeRewardsAddressBNB[NETWORK],
        network,
        signer
      ),
    [network, signer]
  );
};

export const useLPRewardsContract = (LPRewardsAddress: string) => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(() => getContract2(LPRewardsAbi, LPRewardsAddress, network, signer), [network, signer]);
};

export const useWrapAVAXContract = () => {
  const signer = getSigner();
  const network = useNetwork();
  return useMemo(() => getContract2(WrapAVAXFallsAbi, WrapAVAXAddress[NETWORK], network, signer), [network, signer]);
};
