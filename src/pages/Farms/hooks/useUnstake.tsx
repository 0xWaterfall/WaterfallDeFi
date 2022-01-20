import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useLPRewardsContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { setConfirmModal } from "store/showStatus";
import { Dispatch } from "redux";
const unstake = async (contract: Contract, amount: string, dispatch: Dispatch<any>) => {
  const _amount = utils.parseEther(amount).toString();
  const tx = await contract.unstake(_amount);
  dispatch(
    setConfirmModal({
      isOpen: true,
      txn: tx.hash,
      status: "SUBMITTED",
      pendingMessage: "Unstake Submitted"
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
        pendingMessage: "Unstake Success"
      })
    );
  } else {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "REJECTED",
        pendingMessage: "Unstake Failed"
      })
    );
  }
  return receipt.status;
};

const useUnstake = (LPRewardsAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useLPRewardsContract(LPRewardsAddress);
  const handleUnstake = useCallback(
    async (amount: string) => {
      const result = await unstake(contract, amount, dispatch);
      return result;
    },
    [account, dispatch, contract]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
