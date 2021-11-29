import { abi as WTFRewardsABI } from "config/abi/WTFRewards.json";
import { abi as VEWTFAbi } from "config/abi/VEWTF.json";
import { abi as VotingEscrowAbi } from "config/abi/VotingEscrow.json";
import { abi as FeeRewardsAbi } from "config/abi/FeeRewards.json";

import { useEffect, useMemo, useState } from "react";
import multicall from "utils/multicall";
import BigNumber from "bignumber.js";
import useRefresh from "./useRefresh";
import { BIG_TEN } from "utils/bigNumber";
import numeral from "numeral";
import { FeeRewardsAddress } from "config/address";
import { NETWORK } from "config";

export const useEarningTokenTotalSupply = (tokenAddress: string) => {
  const [totalSupply, setTotalSupply] = useState("");
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: tokenAddress,
          name: "totalSupply"
        }
      ];
      const [_totalSupply] = await multicall(VEWTFAbi, calls);
      setTotalSupply(new BigNumber(_totalSupply[0]?._hex).dividedBy(BIG_TEN.pow(18)).toFormat(4).toString());
    };

    fetchBalance();
  }, [tokenAddress, slowRefresh]);

  return totalSupply;
};
export const useStakingPool = (
  tokenAddress: string,
  earningTokenAddress: string,
  account: string | null | undefined
) => {
  const [result, setResult] = useState({
    isPoolActive: false,
    totalStaked: "",
    userStaked: "",
    totalLocked: "",
    maxAPR: ""
  });
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: tokenAddress,
          name: "isPoolActive"
        },
        {
          address: tokenAddress,
          name: "pool"
        },
        {
          address: tokenAddress,
          name: "getAccountData",
          params: [account]
        }
      ];
      const [isPoolActive, pool, user] = await multicall(WTFRewardsABI, calls);

      const calls2 = [
        {
          address: earningTokenAddress,
          name: "totalLocked"
        }
      ];
      const [totalLocked] = await multicall(VotingEscrowAbi, calls2);
      const rewardPerBlock = new BigNumber(pool.rewardPerBlock?._hex).dividedBy(BIG_TEN.pow(18));
      const totalVeWTF = new BigNumber(pool.totalStaked?._hex).dividedBy(BIG_TEN.pow(18));
      const maxAPR = numeral(
        new BigNumber(1)
          .dividedBy(totalVeWTF)
          .times(rewardPerBlock)
          .times(20 * 60 * 24 * 365 * 100)
          .toString()
      ).format("0,0.[00]");
      const calls3 = [
        {
          address: FeeRewardsAddress[NETWORK],
          name: "pendingRewardOf",
          params: [account]
        }
      ];
      const [pending] = await multicall(FeeRewardsAbi, calls3);
      console.log(pending);
      setResult({
        isPoolActive,
        totalStaked: new BigNumber(pool.totalStaked?._hex).dividedBy(BIG_TEN.pow(18)).toFormat(4).toString(), //total VeWTF
        userStaked: new BigNumber(user?.user.amount?._hex).dividedBy(BIG_TEN.pow(18)).toFormat(4).toString(),
        totalLocked: new BigNumber(totalLocked[0]?._hex).dividedBy(BIG_TEN.pow(18)).toString(),
        maxAPR: maxAPR
      });
    };
    if (account) fetchBalance();
  }, [tokenAddress, fastRefresh, account]);

  return result;
};
