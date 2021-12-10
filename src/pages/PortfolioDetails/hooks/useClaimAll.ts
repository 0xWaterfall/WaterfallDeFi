import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useMasterchefContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import { Contract } from "@ethersproject/contracts";
import { getPendingWTFReward, getTrancheBalance } from "store/position";
import { Dispatch } from "redux";
import { setConfirmModal } from "store/showStatus";
import { MasterChefAddress } from "config/address";
import { utils } from "ethers";
const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const claim = async (masterChefContract: Contract, dispatch: Dispatch<any>) => {
  const _amount = utils.parseEther("0").toString();
  console.log(_amount);

  const tx = await masterChefContract.claimAll(_amount, _amount);
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
  const handleClaimAll = useCallback(async () => {
    await claim(masterChefContract, dispatch);
    // account && dispatch(getPendingWTFReward({ account }));
    //   dispatch(updateUserStakedBalance(sousId, account));
  }, [account, dispatch, masterChefContract]);

  return { onClaimAll: handleClaimAll };
};

export default useClaimAll;
