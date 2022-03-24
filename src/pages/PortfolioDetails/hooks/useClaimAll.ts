import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useMasterchefContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
// import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { Dispatch } from "redux";
import { setConfirmModal } from "store/showStatus";
// const options = {
//   gasLimit: DEFAULT_GAS_LIMIT
// };

const claim = async (
  masterChefContract: Contract,
  dispatch: Dispatch<any>,
  _lockDurationIfLockNotExists: string,
  _lockDurationIfLockExists: string
) => {
  const tx = await masterChefContract.claimAll(_lockDurationIfLockNotExists, _lockDurationIfLockExists);
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

const useClaimAll = (masterChefAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchefContract(masterChefAddress);
  const handleClaimAll = useCallback(
    async (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => {
      await claim(masterChefContract, dispatch, _lockDurationIfLockNotExists, _lockDurationIfLockExists);
      // account && dispatch(getPendingWTFReward({ account }));
      //   dispatch(updateUserStakedBalance(sousId, account));
    },
    [account, dispatch, masterChefContract]
  );

  return { onClaimAll: handleClaimAll };
};

export default useClaimAll;
