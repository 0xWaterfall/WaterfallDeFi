import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useMasterchefContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import { Contract } from "@ethersproject/contracts";

const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const claim = async (masterChefContract: Contract) => {
  const tx = await masterChefContract.claimAll();
  const receipt = await tx.wait();
  return receipt.status;
};

const useClaimAll = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchefContract();
  const handleClaimAll = useCallback(async () => {
    await claim(masterChefContract);

    //   dispatch(updateUserStakedBalance(sousId, account));
  }, [account, dispatch, masterChefContract]);

  return { onClaimAll: handleClaimAll };
};

export default useClaimAll;
