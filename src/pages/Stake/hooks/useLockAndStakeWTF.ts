import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useVeWTFContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

const createLock = async (contract: Contract, amount: number, duration: number) => {
  //   const _amount = amount.toString();
  const _amount = utils.parseEther(amount.toString()).toString();
  console.log(_amount);
  const _duration = duration.toString();
  const tx = await contract.createLock(_amount, _duration);
  const receipt = await tx.wait();
  return receipt.status;
};

const useLockAndStakeWTF = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useVeWTFContract();
  const handleLockAndStakeWTF = useCallback(
    async (amount: number, duration: number) => {
      const result = await createLock(contract, amount, duration);
      //   dispatch();
      return result;
    },
    [account, dispatch, contract]
  );

  return { lockAndStakeWTF: handleLockAndStakeWTF };
};

export default useLockAndStakeWTF;
