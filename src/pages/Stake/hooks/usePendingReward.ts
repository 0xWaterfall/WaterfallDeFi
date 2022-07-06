import { useEffect, useState } from "react";
import { abi as WTFRewardsABI } from "config/abi/WTFRewards.json";

import useRefresh from "hooks/useRefresh";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import multicall, { multicallBSC } from "utils/multicall";
import numeral from "numeral";
import { useNetwork } from "hooks/useSelectors";

export const usePendingReward = (rewardTokenAddress: string, account: string | null | undefined) => {
  const [result, setResult] = useState("");
  const { fastRefresh } = useRefresh();
  const network = useNetwork();

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: rewardTokenAddress,
          name: "pendingReward",
          params: [account]
        }
      ];
      const [pendingReward] = network === "avax" ? [{ reward: { _hex: 0 } }] : await multicallBSC(WTFRewardsABI, calls);
      setResult(
        numeral(new BigNumber(pendingReward.reward._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[0000]")
      );
    };
    if (account) fetchBalance();
  }, [rewardTokenAddress, fastRefresh, account, network]);

  return result;
};
