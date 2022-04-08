import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useMulticurrencyTrancheMasterContract, useTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
// import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { utils, BigNumber } from "ethers";
import { getMarkets } from "store/markets";
import { MarketList } from "config/market";
import { setConfirmModal } from "store/showStatus";
import { Dispatch } from "redux";

const invest = async (
  contract: Contract,
  amount: string,
  selectTrancheIdx: string,
  dispatch: Dispatch<any>,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean
) => {
  const _amount = !isUSDC ? utils.parseEther(amount).toString() : utils.parseUnits(amount, 6).toString();
  const _zero = !isUSDC ? utils.parseEther("0").toString() : utils.parseUnits(amount, 6).toString();
  let tx;
  if (multicurrencyIdx === -1) {
    tx = await contract.investDirect(_amount, selectTrancheIdx, _amount);
  } else {
    const _amountArray: BigNumber[] = [];
    for (let index = 0; index < multicurrencyTokenCount; index++) {
      _amountArray.push(BigNumber.from(_zero));
    }
    _amountArray[multicurrencyIdx] = BigNumber.from(_amount);
    tx = await contract.investDirect(selectTrancheIdx, _amountArray, _amountArray);
  }

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
  // console.log(tx.hash);
  // const receipt = await tx.wait();
  // console.log(receipt.transactionHash);
  return receipt.status;
};

const useInvestDirect = (
  trancheMasterAddress: string,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean
) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  let contract: Contract;
  if (multicurrencyIdx === -1) {
    contract = useTrancheMasterContract(trancheMasterAddress);
  } else {
    contract = useMulticurrencyTrancheMasterContract(trancheMasterAddress);
  }
  const handleInvestDirect = useCallback(
    async (amount: string, selectTrancheIdx: string) => {
      const result = await invest(
        contract,
        amount,
        selectTrancheIdx,
        dispatch,
        multicurrencyIdx,
        multicurrencyTokenCount,
        isUSDC
      );
      dispatch(getMarkets(MarketList));
      return result;
    },
    [account, dispatch, contract]
  );

  return { onInvestDirect: handleInvestDirect };
};

export default useInvestDirect;
