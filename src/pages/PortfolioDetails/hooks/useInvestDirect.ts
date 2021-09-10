import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { getMarkets } from "store/markets";
import { MarketList } from "config/market";
const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const invest = async (contract: Contract, amount: string, selectTrancheIdx: string) => {
  const _amount = utils.parseEther(amount).toString();
  console.log(contract);
  console.log(_amount);
  console.log(selectTrancheIdx);
  const tx = await contract.investDirect(_amount, selectTrancheIdx, _amount);
  const receipt = await tx.wait();
  return receipt.status;
};

const useInvestDirect = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useTrancheMasterContract();
  const handleInvestDirect = useCallback(
    async (amount: string, selectTrancheIdx: string) => {
      const result = await invest(contract, amount, selectTrancheIdx);
      dispatch(getMarkets(MarketList));
      return result;
    },
    [account, dispatch, contract]
  );

  return { onInvestDirect: handleInvestDirect };
};

export default useInvestDirect;
