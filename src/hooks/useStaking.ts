import { abi as WTFRewardsABI } from "config/abi/WTFRewards.json";
import { abi as VEWTFAbi } from "config/abi/VEWTF.json";
import { abi as VotingEscrowAbi } from "config/abi/VotingEscrow.json";
import { abi as FeeRewardsAbi } from "config/abi/FeeRewards.json";

import { useEffect, useMemo, useState } from "react";
import multicall, { multicallBSC } from "utils/multicall";
import BigNumber from "bignumber.js";
import useRefresh from "./useRefresh";
import { BIG_TEN } from "utils/bigNumber";
import numeral from "numeral";
import { FeeRewardsAddress } from "config/address";
import { BLOCK_TIME, NETWORK } from "config";
import { useNetwork } from "./useSelectors";

export const useEarningTokenTotalSupply = (tokenAddress: string) => {
  const [totalSupply, setTotalSupply] = useState("");
  const { slowRefresh } = useRefresh();
  const network = useNetwork();
  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: tokenAddress,
          name: "totalSupply"
        }
      ];
      const [_totalSupply] =
        network === "avax" ? await multicall(VEWTFAbi, calls) : await multicallBSC(VEWTFAbi, calls);
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
    maxAPR: "",
    pendingBUSDReward: "",
    rewardPerBlock: ""
  });
  const { fastRefresh } = useRefresh();
  const network = useNetwork();

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
      const [isPoolActive, pool, user] =
        network === "avax" ? await multicall(WTFRewardsABI, calls) : await multicallBSC(WTFRewardsABI, calls);

      const calls2 = [
        {
          address: earningTokenAddress,
          name: "totalLocked"
        }
      ];
      const [totalLocked] =
        network === "avax" ? await multicall(VotingEscrowAbi, calls2) : await multicallBSC(VotingEscrowAbi, calls2);
      const rewardPerBlock = new BigNumber(pool.rewardPerBlock?._hex).dividedBy(BIG_TEN.pow(18));
      const totalVeWTF = new BigNumber(pool.totalStaked?._hex).dividedBy(BIG_TEN.pow(18));
      const _totalVeWTF = new BigNumber(totalVeWTF).plus(2.4883);
      const blockTime = BLOCK_TIME(process.env.REACT_APP_CHAIN_ID || "");

      const maxAPR = numeral(
        new BigNumber(2.4883)
          .dividedBy(_totalVeWTF)
          .times(rewardPerBlock)
          .times((60 / blockTime) * 60 * 24 * 365 * 100)
          .toString()
      ).format("0,0.[00]");

      let pendingBUSDReward = "";
      try {
        const calls3 = [
          {
            address: FeeRewardsAddress[NETWORK],
            name: "pendingRewardOf",
            params: [account]
          }
        ];
        const [pending] =
          network === "avax" ? await multicall(FeeRewardsAbi, calls3) : await multicallBSC(FeeRewardsAbi, calls3);
        pendingBUSDReward = pending
          ? numeral(new BigNumber(pending.reward?._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[00]")
          : "";
      } catch (e) {
        console.error(e);
      }

      setResult({
        isPoolActive,
        totalStaked: new BigNumber(pool.totalStaked?._hex).dividedBy(BIG_TEN.pow(18)).toFormat(4).toString(), //total VeWTF
        userStaked: new BigNumber(user?.user.amount?._hex).dividedBy(BIG_TEN.pow(18)).toFormat(4).toString(),
        totalLocked: new BigNumber(totalLocked[0]?._hex).dividedBy(BIG_TEN.pow(18)).toString(),
        maxAPR: maxAPR,
        pendingBUSDReward,
        rewardPerBlock: rewardPerBlock.toString()
      });
    };
    if (account) fetchBalance();
  }, [tokenAddress, fastRefresh, account, network]);

  return result;
};
