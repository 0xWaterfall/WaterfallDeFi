import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";

import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { useWTFRewardsContract } from "hooks/useContract";

const unstake = async (contract: Contract, account: string, amount: string) => {
  const _amount = utils.parseEther(amount.toString()).toString();
  const tx = await contract.unstake(account, _amount);
  const receipt = await tx.wait();
  return receipt.status;
};

const useUnstake = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useWTFRewardsContract();
  const handleUnstake = useCallback(
    async (account: string, amount: string) => {
      const result = await unstake(contract, account, amount);
      //   dispatch();
      return result;
    },
    [account, dispatch, contract]
  );

  return { unstake: handleUnstake };
};

export default useUnstake;
