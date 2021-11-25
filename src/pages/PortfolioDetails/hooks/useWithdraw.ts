import { useSelectedMarket } from "./../../../hooks/useSelectors";
import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import { Contract } from "@ethersproject/contracts";
import { getMarkets } from "store/markets";
import { MarketList } from "config/market";
import { getPosition, getTrancheBalance } from "store/position";
import { Dispatch } from "redux";
import { setConfirmModal } from "store/showStatus";

const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const withdraw = async (trancheContract: Contract, amount: string, dispatch: Dispatch<any>) => {
  // const tx = await trancheContract.withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(), options);
  const tx = await trancheContract.withdraw(amount);
  dispatch(
    setConfirmModal({
      isOpen: true,
      txn: tx.hash,
      status: "SUBMITTED",
      pendingMessage: "Withdraw Submitted"
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
        pendingMessage: "Withdraw Success"
      })
    );
  } else {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "REJECTED",
        pendingMessage: "Withdraw Failed"
      })
    );
  }
  return receipt.status;
};

const useWithdraw = (trancheMasterAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const trancheContract = useTrancheMasterContract(trancheMasterAddress);
  const market = useSelectedMarket();
  const handleWithdraw = useCallback(
    async (amount: string) => {
      await withdraw(trancheContract, amount, dispatch);
      dispatch(getMarkets(MarketList));
      // account && dispatch(getTrancheBalance({ account }));
      market && account && dispatch(getPosition({ market, account }));
    },
    [account, dispatch, trancheContract, market]
  );

  return { onWithdraw: handleWithdraw };
};

export default useWithdraw;
