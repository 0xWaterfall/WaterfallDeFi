import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";

import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { useFeeRewardsContract } from "hooks/useContract";

const claimFeeRewards = async (contract: Contract) => {
  const tx = await contract.claimRewards();
  const receipt = await tx.wait();
  return receipt.status;
};

const useClaimFeeRewards = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useFeeRewardsContract();
  const handleClaimReward = useCallback(async () => {
    const result = await claimFeeRewards(contract);
    //   dispatch();
    return result;
  }, [account, dispatch, contract]);

  return { claimFeeRewards: handleClaimReward };
};

export default useClaimFeeRewards;
