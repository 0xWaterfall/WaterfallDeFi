import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";

import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { useVeWTFContract } from "hooks/useContract";

const unstake = async (contract: Contract, account: string) => {
  // const _amount = utils.parseEther(amount.toString()).toString();
  const tx = await contract.unlock();
  const receipt = await tx.wait();
  return receipt.status;
};

const useUnstake = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useVeWTFContract();
  const handleUnstake = useCallback(
    async (account: string) => {
      const result = await unstake(contract, account);
      //   dispatch();
      return result;
    },
    [account, dispatch, contract]
  );

  return { unstake: handleUnstake };
};

export default useUnstake;
