import { useCallback, useEffect, useState } from "react";
import { abi as LPTokenAbi } from "config/abi/LPFake.json";
import { abi as LPRewardsAbi } from "config/abi/WTFLPRewards.json";
import { useWeb3React } from "@web3-react/core";

import useRefresh from "hooks/useRefresh";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import multicall from "utils/multicall";
import numeral from "numeral";
import Farms from "config/farms";
import { BLOCK_TIME } from "config";
export interface FarmInterface {
  name: string;
  isPoolActive: boolean;
  accRewardPerShare: string; // no need
  rewardPerBlock: string;
  rewardPerShare: string; // no need
  totalStaked: string;
  lpTokenAddress: string;
  lpRewardAddress: string;
  maxAPR: string;
  userStakedLP: string;
  logo1: string;
  logo2: string;
  lpButtonTitle: string;
  lpURL: string;
}
export const useFarms = (farmIdx?: number) => {
  const [result, setResult] = useState<FarmInterface[]>([]);
  const { fastRefresh } = useRefresh();
  const { account } = useWeb3React();
  useEffect(() => {
    const fetchBalance = async () => {
      const farmsResultAll: FarmInterface[] = [];
      const farmsResult = await Promise.all(
        Farms.map(async (_farmConfig, _idx) => {
          if (farmIdx !== undefined && farmIdx !== _idx) return false;
          const { name, lpTokenAddress, lpRewardAddress, logo1, logo2, lpButtonTitle, lpURL } = _farmConfig;
          const _account = account || "0x0000000000000000000000000000000000000000";
          const calls = [
            {
              address: lpRewardAddress,
              name: "isPoolActive"
            },
            {
              address: lpRewardAddress,
              name: "pool"
            },
            {
              address: lpRewardAddress,
              name: "rewardPerShare"
            },
            {
              address: lpRewardAddress,
              name: "users",
              params: [_account]
            }
          ];
          const [
            _isPoolActive,
            [_accRewardPerShare, _startRewardBlock, _endRewardBlock, _lastRewardBlock, _rewardPerBlock],
            _rewardPerShare,
            [_userStakedLP]
          ] = await multicall(LPRewardsAbi, calls);
          //users(account)

          const calls2 = [
            {
              address: lpTokenAddress,
              name: "balanceOf",
              params: [lpRewardAddress]
            }
          ];
          const [_totalStaked] = await multicall(LPTokenAbi, calls2);

          const lpValueInTermsOfWTF = 1;
          const blockTime = BLOCK_TIME(process.env.REACT_APP_CHAIN_ID || "");
          const maxAPR = numeral(
            new BigNumber(lpValueInTermsOfWTF)
              .dividedBy(new BigNumber(_totalStaked).dividedBy(BIG_TEN.pow(18)))
              .times(new BigNumber(_rewardPerBlock?._hex).dividedBy(BIG_TEN.pow(18)))
              .times((60 / blockTime) * 60 * 24 * 365 * 100)
              .toString()
          ).format("0,0.[00]");
          console.log(maxAPR);

          const _result = {
            name: name,
            logo1,
            logo2,
            lpButtonTitle,
            lpURL,
            isPoolActive: _isPoolActive?.[0],
            accRewardPerShare: new BigNumber(_accRewardPerShare?._hex).dividedBy(BIG_TEN.pow(18)).toString(),
            rewardPerBlock: new BigNumber(_rewardPerBlock?._hex).dividedBy(BIG_TEN.pow(18)).toString(),
            rewardPerShare: new BigNumber(_rewardPerShare).dividedBy(BIG_TEN.pow(18)).toString(),
            totalStaked: new BigNumber(_totalStaked).dividedBy(BIG_TEN.pow(18)).toString(),
            lpTokenAddress,
            lpRewardAddress,
            maxAPR,
            userStakedLP: new BigNumber(_userStakedLP?._hex).dividedBy(BIG_TEN.pow(18)).toString()
          };
          farmsResultAll.push(_result);
        })
      );
      setResult(farmsResultAll);
    };
    fetchBalance();
  }, [fastRefresh]);

  return result;
};
