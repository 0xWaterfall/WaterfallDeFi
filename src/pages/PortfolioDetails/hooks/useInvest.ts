import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useTrancheMasterContract, useMulticurrencyTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
// import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { utils, BigNumber } from "ethers";
import { getMarkets } from "store/markets";
import { MarketList } from "config/market";
import { setConfirmModal } from "store/showStatus";
import { Dispatch } from "redux";
// const options = {
//   gasLimit: DEFAULT_GAS_LIMIT
// };

const invest = async (
  contract: Contract,
  amount: string,
  selectTrancheIdx: string,
  dispatch: Dispatch<any>,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number
) => {
  const _amount = utils.parseEther(amount);
  const _zero = utils.parseEther("0");
  let tx;
  if (multicurrencyIdx === -1) {
    tx = await contract.invest(selectTrancheIdx, _amount.toString(), false);
  } else {
    const _amountArray: BigNumber[] = [];
    for (let index = 0; index < multicurrencyTokenCount; index++) {
      _amountArray.push(BigNumber.from(_zero.toString()));
    }
    _amountArray[multicurrencyIdx] = BigNumber.from(_amount.toString());
    tx = await contract.invest(selectTrancheIdx, [..._amountArray], false);
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
  return receipt.status;
};

const useInvest = (trancheMasterAddress: string, multicurrencyIdx: number, multicurrencyTokenCount: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  let contract: Contract;
  if (multicurrencyIdx === -1) {
    contract = useTrancheMasterContract(trancheMasterAddress);
  } else {
    contract = useMulticurrencyTrancheMasterContract(trancheMasterAddress);
  }
  const handleInvest = useCallback(
    async (amount: string, selectTrancheIdx: string) => {
      const result = await invest(
        contract,
        amount,
        selectTrancheIdx,
        dispatch,
        multicurrencyIdx,
        multicurrencyTokenCount
      );
      dispatch(getMarkets(MarketList));
      return result;
    },
    [account, dispatch, contract]
  );

  return { onInvest: handleInvest };
};

export default useInvest;
