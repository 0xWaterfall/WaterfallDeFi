import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useERC20Contract, useVeWTFContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import BigNumber from "bignumber.js";
const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const checkLocked = async (contract: Contract, account: string) => {
  const tx = await contract.getLockData(account);
  return !new BigNumber(tx?.startTimestamp?._hex).isZero();
};

const useCheckLocked = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useVeWTFContract();
  const handleCheckLocked = useCallback(async () => {
    if (account) return await checkLocked(contract, account);
    return false;
  }, [account, contract]);

  return { onCheckLocked: handleCheckLocked };
};

export default useCheckLocked;
