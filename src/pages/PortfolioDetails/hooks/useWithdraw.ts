import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import { Contract } from "@ethersproject/contracts";

const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const withdraw = async (trancheContract: Contract, amount: string, decimals = 18) => {
  console.log(amount);
  // const tx = await trancheContract.withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(), options);
  const tx = await trancheContract.withdraw(amount);
  const receipt = await tx.wait();
  return receipt.status;
};

const useWithdraw = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const trancheContract = useTrancheMasterContract();
  const handleWithdraw = useCallback(
    async (amount: string) => {
      await withdraw(trancheContract, amount);
      //   dispatch(updateUserStakedBalance(sousId, account));
    },
    [account, dispatch, trancheContract]
  );

  return { onWithdraw: handleWithdraw };
};

export default useWithdraw;
