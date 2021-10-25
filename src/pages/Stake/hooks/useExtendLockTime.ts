import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useVeWTFContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

const extendLockTime = async (contract: Contract, duration: number) => {
  const tx = await contract.increaseTimeAndAmount("0", duration);
  const receipt = await tx.wait();
  return receipt.status;
};

const useExtendLockTime = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useVeWTFContract();
  const handleExtendLockTime = useCallback(
    async (duration: number) => {
      const result = await extendLockTime(contract, duration);
      //   dispatch();
      return result;
    },
    [account, dispatch, contract]
  );

  return { extendLockTime: handleExtendLockTime };
};

export default useExtendLockTime;
