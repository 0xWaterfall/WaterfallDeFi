import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";

import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { useWTFRewardsContract } from "hooks/useContract";

const claimRewards = async (contract: Contract) => {
  const tx = await contract.claimRewards();
  const receipt = await tx.wait();
  return receipt.status;
};

const useClaimRewards = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useWTFRewardsContract();
  const handleClaimReward = useCallback(async () => {
    const result = await claimRewards(contract);
    //   dispatch();
    return result;
  }, [account, dispatch, contract]);

  return { claimRewards: handleClaimReward };
};

export default useClaimRewards;
