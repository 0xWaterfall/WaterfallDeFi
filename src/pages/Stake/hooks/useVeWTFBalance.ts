import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useVeWTFContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import useRefresh from "hooks/useRefresh";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";

export const useVeWTFBalance = (account: string | null | undefined) => {
  const [balance, setBalance] = useState("");
  const { slowRefresh } = useRefresh();
  const contract = useVeWTFContract();

  const fetchBalance = async () => {
    // const result = await contract.getLockedAmount(account);
    const result = await contract.balanceOf(account);
    setBalance(new BigNumber(result._hex).dividedBy(BIG_TEN.pow(18)).toString());
  };
  useEffect(() => {
    fetchBalance();
  }, [account, slowRefresh]);

  return balance;
};
