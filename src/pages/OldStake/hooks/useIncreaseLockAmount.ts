import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useVeWTFContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

const increaseAmount = async (contract: Contract, amount: number) => {
  //   const _amount = amount.toString();
  const _amount = utils.parseEther(amount.toString()).toString();
  console.log(_amount);
  const tx = await contract.increaseAmount(_amount);
  const receipt = await tx.wait();
  return receipt.status;
};

const useIncreaseLockAmount = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useVeWTFContract();
  const handleIncreaseLockAmount = useCallback(
    async (amount: number) => {
      const result = await increaseAmount(contract, amount);
      //   dispatch();
      return result;
    },
    [account, dispatch, contract]
  );

  return { increaseLockAmount: handleIncreaseLockAmount };
};

export default useIncreaseLockAmount;
