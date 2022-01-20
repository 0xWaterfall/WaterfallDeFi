import { useEffect, useState } from "react";
import { abi as WTFRewardsABI } from "config/abi/WTFRewards.json";

import useRefresh from "hooks/useRefresh";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import multicall from "utils/multicall";
import numeral from "numeral";

export const usePendingReward = (rewardTokenAddress: string, account: string | null | undefined) => {
  const [result, setResult] = useState("");
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: rewardTokenAddress,
          name: "pendingReward",
          params: [account]
        }
      ];
      const [pendingReward] = await multicall(WTFRewardsABI, calls);
      setResult(
        numeral(new BigNumber(pendingReward.reward._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[0000]")
      );
    };
    if (account) fetchBalance();
  }, [rewardTokenAddress, fastRefresh, account]);

  return result;
};
