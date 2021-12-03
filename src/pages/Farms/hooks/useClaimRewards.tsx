import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useLPRewardsContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { setConfirmModal } from "store/showStatus";
import { Dispatch } from "redux";
const claimRewards = async (contract: Contract, dispatch: Dispatch<any>) => {
  const tx = await contract.claimRewards();
  dispatch(
    setConfirmModal({
      isOpen: true,
      txn: tx.hash,
      status: "SUBMITTED",
      pendingMessage: "Claim Submitted"
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
        pendingMessage: "Claim Success"
      })
    );
  } else {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "REJECTED",
        pendingMessage: "Claim Failed"
      })
    );
  }
  return receipt.status;
};

const useClaimRewards = (LPRewardsAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useLPRewardsContract(LPRewardsAddress);
  const handleClaimRewards = useCallback(async () => {
    const result = await claimRewards(contract, dispatch);
    return result;
  }, [account, dispatch, contract]);

  return { onClaimRewards: handleClaimRewards };
};

export default useClaimRewards;
