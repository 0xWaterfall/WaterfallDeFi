import BigNumber from "bignumber.js";
import numeral from "numeral";
import { useEffect, useState } from "react";
import useRefresh from "./useRefresh";

export const useEstimateYield = (principal: string, trancheAPY: string, startAt: number, isActiveCycle: boolean) => {
  const [estYield, setEstYield] = useState("");
  const { slowRefresh, fastRefresh } = useRefresh();
  useEffect(() => {
    if (isActiveCycle) {
      const now = Math.floor(Date.now() / 1000);
      const duration = now - startAt;
      const secondsInYear = 60 * 60 * 24 * 365;
      const _yield = new BigNumber(principal)
        .times(new BigNumber(trancheAPY))
        .dividedBy(100)
        .times(duration)
        .dividedBy(secondsInYear)
        .toString();
      console.log(_yield);
      const num = numeral(_yield).format("0,0.[000000]");
      setEstYield(num !== "NaN" ? num : "0");
    }
  }, [fastRefresh]);

  return estYield;
};
