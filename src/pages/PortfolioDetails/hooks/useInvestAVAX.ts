import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useAVAXTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { getMarkets } from "store/markets";
import { MarketList } from "config/market";
import { setConfirmModal } from "store/showStatus";
import { Dispatch } from "redux";

//0xA:
//most of this code is redundant but
//due to the potential for merge conflict headaches due to the many new params in invest and investDirect for multicurrency,
//I am creating a new hook for invest and investDirect for AVAX contracts. Combine AVAX and multicurrency code into one hook later.
const _invest = async (contract: Contract, amount: string, selectTrancheIdx: string, dispatch: Dispatch<any>) => {
  const _amount = utils.parseEther(amount).toString();
  const tx = await contract.invest(selectTrancheIdx, _amount, false);
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

const useInvestAVAX = (trancheMasterAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useAVAXTrancheMasterContract(trancheMasterAddress); //!!!!!
  const handleInvest = useCallback(
    async (amount: string, selectTrancheIdx: string) => {
      const result = await _invest(contract, amount, selectTrancheIdx, dispatch);
      dispatch(getMarkets(MarketList));
      return result;
    },
    [account, dispatch, contract]
  );

  return { onInvestAVAX: handleInvest };
};

export default useInvestAVAX;
