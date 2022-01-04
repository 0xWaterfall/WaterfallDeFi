import { useCallback, useEffect, useState } from "react";
import { abi as WTFRewardsABI } from "config/abi/WTFRewards.json";

import useRefresh from "hooks/useRefresh";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import multicall from "utils/multicall";
import numeral from "numeral";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useLPRewardsContract } from "hooks/useContract";

export const usePendingReward = (LPRewardsAddress: string) => {
  const [result, setResult] = useState("");
  const { fastRefresh } = useRefresh();
  const { account } = useWeb3React<Web3Provider>();
  const contract = useLPRewardsContract(LPRewardsAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      const _pendingReward = await contract.pendingReward(account);
      const value = new BigNumber(_pendingReward.toString()).dividedBy(BIG_TEN.pow(18));
      setResult(value.toString());
    };
    if (account) fetchBalance();
  }, [LPRewardsAddress, fastRefresh, account]);

  return result;
};
