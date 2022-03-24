import { useSelectedMarket } from "./../../../hooks/useSelectors";
import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  useAVAXTrancheMasterContract,
  useMulticurrencyTrancheMasterContract,
  useTrancheMasterContract
} from "hooks/useContract";
import { useDispatch } from "react-redux";
// import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { getMarkets } from "store/markets";
import { MarketList } from "config/market";
import { getPosition } from "store/position";
import { Dispatch } from "redux";
import { setConfirmModal } from "store/showStatus";
import BigNumber from "bignumber.js";
import { formatBigNumber2HexString } from "utils/formatNumbers";

// const options = {
//   gasLimit: DEFAULT_GAS_LIMIT
// };

const withdraw = async (
  trancheContract: Contract,
  amount: string,
  multicurrencyAmount: string[],
  dispatch: Dispatch<any>
) => {
  // const tx = await trancheContract.withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(), options);
  const tx = await trancheContract.withdraw(multicurrencyAmount.length > 0 ? multicurrencyAmount : amount);
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

const useWithdraw = (trancheMasterAddress: string, isAvax: boolean, isMulticurrency: boolean) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();

  const trancheContract = isAvax!
    ? isMulticurrency
      ? useMulticurrencyTrancheMasterContract(trancheMasterAddress)
      : useTrancheMasterContract(trancheMasterAddress)
    : useAVAXTrancheMasterContract(trancheMasterAddress);
  //handle AVAX multicurrency later, like when an AVAX MC falls is actually released

  const market = useSelectedMarket();
  const handleWithdraw = useCallback(
    async (amount: string, multicurrencyAmount?: string[]) => {
      await withdraw(
        trancheContract,
        isMulticurrency ? "" : amount,
        isMulticurrency && multicurrencyAmount ? multicurrencyAmount : [],
        dispatch
      );
      dispatch(getMarkets(MarketList));
      // account && dispatch(getTrancheBalance({ account }));
      market && account && dispatch(getPosition({ market, account }));
    },
    [account, dispatch, trancheContract, market]
  );

  return { onWithdraw: handleWithdraw };
};

export default useWithdraw;
