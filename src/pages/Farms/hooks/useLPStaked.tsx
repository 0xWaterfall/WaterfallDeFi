import { useCallback, useEffect, useState } from "react";

import useRefresh from "hooks/useRefresh";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useLPRewardsContract } from "hooks/useContract";

const useLPStaked = (LPRewardsAddress: string) => {
  const [stakedAmount, setStakedAmount] = useState("0");
  const { account } = useWeb3React<Web3Provider>();
  const { fastRefresh } = useRefresh();
  const contract = useLPRewardsContract(LPRewardsAddress);

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const [_stakedAmount] = await contract.users(account);
    const value = new BigNumber(_stakedAmount.toString()).dividedBy(BIG_TEN.pow(18));
    setStakedAmount(value.toString());
  }, [account]);

  useEffect(() => {
    if (account) fetchBalance();
  }, [account, LPRewardsAddress, fastRefresh]);

  return stakedAmount;
};
export default useLPStaked;
