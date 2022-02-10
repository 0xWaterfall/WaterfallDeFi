import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useMulticurrencyTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { utils, BigNumber } from "ethers";
import { getMarkets } from "store/markets";
import { MarketList } from "config/market";
import { setConfirmModal } from "store/showStatus";
import { Dispatch } from "redux";

const _invest = async (contract: Contract, amount: string[], selectTrancheIdx: string, dispatch: Dispatch<any>) => {
  const _amount = amount.map((a) => BigNumber.from(utils.parseEther(a).toString()));
  const tx = await contract.investDirect(_amount, selectTrancheIdx, _amount);

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

const useInvestDirectMCSimul = (trancheMasterAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract: Contract = useMulticurrencyTrancheMasterContract(trancheMasterAddress);

  const handleInvestDirectMCSimul = useCallback(
    async (amount: string[], selectTrancheIdx: string) => {
      const result = await _invest(contract, amount, selectTrancheIdx, dispatch);
      dispatch(getMarkets(MarketList));
      return result;
    },
    [account, dispatch, contract]
  );

  return { onInvestDirectMCSimul: handleInvestDirectMCSimul };
};

export default useInvestDirectMCSimul;
