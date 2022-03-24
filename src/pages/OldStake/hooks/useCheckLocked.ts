import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useVeWTFContract } from "hooks/useContract";
import { Contract } from "@ethersproject/contracts";
import BigNumber from "bignumber.js";

const checkLocked = async (contract: Contract, account: string) => {
  const tx = await contract.getLockData(account);
  return !new BigNumber(tx?.startTimestamp?._hex).isZero();
};

const useCheckLocked = () => {
  const { account } = useWeb3React();
  const contract = useVeWTFContract();
  const handleCheckLocked = useCallback(async () => {
    if (account) return await checkLocked(contract, account);
    return false;
  }, [account, contract]);

  return { onCheckLocked: handleCheckLocked };
};

export default useCheckLocked;
