import { useWeb3React } from "@web3-react/core";
import { getContract, getSigner } from "hooks";
import { abi as WTFRewardsABI } from "config/abi/WTFRewards.json";
import { abi as VEWTFAbi } from "config/abi/VEWTF.json";

import { useEffect, useMemo, useState } from "react";
import multicall from "utils/multicall";
import { ethers } from "ethers";
import getRpcUrl from "utils/getRpcUrl";
import { BIG_ZERO } from "utils/bigNumber";
import BigNumber from "bignumber.js";

export const useEarningTokenTotalSupply = (tokenAddress: string) => {
  const [totalSupply, setTotalSupply] = useState("");
  //   const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: tokenAddress,
          name: "totalSupply"
        }
      ];
      const [_totalSupply] = await multicall(VEWTFAbi, calls);
      setTotalSupply(new BigNumber(_totalSupply[0]?._hex).toString());
    };

    fetchBalance();
    //   }, [tokenAddress, slowRefresh]);
  }, [tokenAddress]);

  return totalSupply;
};
export const useStakingPool = (tokenAddress: string, account: string | null | undefined) => {
  const [result, setResult] = useState({
    isPoolActive: false,
    totalStaked: "",
    userStaked: ""
  });
  //   const { slowRefresh } = useRefresh();

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
      const result = await multicall(WTFRewardsABI, calls);
      const [isPoolActive, pool, user] = await multicall(WTFRewardsABI, calls);
      setResult({
        isPoolActive,
        totalStaked: new BigNumber(pool.totalStaked?._hex).toString(),
        userStaked: new BigNumber(user?.user.amount?._hex).toString()
      });
    };

    fetchBalance();
    //   }, [tokenAddress, slowRefresh]);
  }, [tokenAddress]);

  return result;
};
