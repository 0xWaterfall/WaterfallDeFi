import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useLPRewardsContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { setConfirmModal } from "store/showStatus";
import { Dispatch } from "redux";

const stake = async (contract: Contract, amount: string, dispatch: Dispatch<any>) => {
  const _amount = utils.parseEther(amount).toString();
  const tx = await contract.stake(_amount);
  dispatch(
    setConfirmModal({
      isOpen: true,
      txn: tx.hash,
      status: "SUBMITTED",
      pendingMessage: "Deposit Submitted"
    })
  );
  // return tx.hash;
  const receipt = await tx.wait();

  if (receipt.status) {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "COMPLETED",
        pendingMessage: "Deposit Success"
      })
    );
  } else {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "REJECTED",
        pendingMessage: "Deposit Failed"
      })
    );
  }
  return receipt.status;
};

const useStake = (LPRewardsAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useLPRewardsContract(LPRewardsAddress);
  const handleStake = useCallback(
    async (amount: string) => {
      const result = await stake(contract, amount, dispatch);
      return result;
    },
    [account, dispatch, contract]
  );

  return { onStake: handleStake };
};

export default useStake;
