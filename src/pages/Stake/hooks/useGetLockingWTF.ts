import { useEffect, useState } from "react";
import { useVeWTFContract } from "hooks/useContract";
import useRefresh from "hooks/useRefresh";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";

export const useGetLockingWTF = (account: string | null | undefined) => {
  const [total, setTotal] = useState("");
  const [startTimestamp, setStartTimestamp] = useState("");

  const [expiryTimestamp, setExpiryTimestamp] = useState("");
  const { fastRefresh } = useRefresh();
  const contract = useVeWTFContract();

  const fetchLockingWTF = async () => {
    // const result = await contract.getLockedAmount(account);
    const result = await contract.getLockData(account);
    setTotal(new BigNumber(result.amount._hex).dividedBy(BIG_TEN.pow(18)).toString());

    setStartTimestamp(new BigNumber(result.startTimestamp._hex).toString());
    setExpiryTimestamp(new BigNumber(result.expiryTimestamp._hex).toString());
  };
  useEffect(() => {
    fetchLockingWTF();
  }, [account, fastRefresh]);

  return { total, expiryTimestamp, startTimestamp, fetchLockingWTF };
};
