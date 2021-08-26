import BigNumber from "bignumber.js";
import { Pool, Tranche } from "types";
export const BIG_TEN = new BigNumber(10);
export const formatAPY = (apy: string | undefined, decimals = 16) => {
  if (!apy) return "- -";
  return new BigNumber(apy).dividedBy(BIG_TEN.pow(decimals)).toString() + "%";
};

export const formatTVL = (num: string | undefined, decimals = 18) => {
  if (!num) return "- -";
  return new BigNumber(num).dividedBy(BIG_TEN.pow(decimals)).toString();
};

export const formatAllocPoint = (allocPoint: string | undefined, totalAllocPoints: number | undefined) => {
  if (!allocPoint || !totalAllocPoints) return "- -";
  return Math.floor((parseInt(allocPoint) / totalAllocPoints) * 100);
};

export const getPortfolioTvl = (tranches: Tranche[]) => {
  const tvl = new BigNumber(0);
  tranches.map((_t) => {
    const _p = new BigNumber(_t.principal);
    tvl.plus(_p);
  });
  return tvl.toString();
};

export const getTotalAllocPoints = (pools: Pool[]) => {
  let totalAllocPoints = 0;
  pools.map((p) => {
    totalAllocPoints += parseInt(p.allocPoint);
  });
  return totalAllocPoints;
};
