import BigNumber from "bignumber.js";
import { Pool, Tranche } from "types";
import Web3 from "web3";
import { BIG_TEN } from "./bigNumber";
export const formatAPY = (apy: string | undefined, decimals = 16) => {
  if (!apy) return "- -";
  return new BigNumber(apy).dividedBy(BIG_TEN.pow(decimals)).toString() + "%";
};

export const formatBalance = (num: string | undefined, decimals = 18) => {
  if (!num) return "- -";
  return new BigNumber(num).dividedBy(BIG_TEN.pow(decimals)).toFormat(0).toString();
};
export const formatDisplayTVL = (num: string | undefined, decimals = 18) => {
  if (!num) return "-";
  return new BigNumber(num)
    .dividedBy(BIG_TEN.pow(decimals))
    .toFormat(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const formatTVL = (num: string | undefined, decimals = 18) => {
  if (!num) return "- -";
  return new BigNumber(num).dividedBy(BIG_TEN.pow(decimals)).toFormat(0).toString();
};
export const formatNumberDisplay = (num: string | undefined, decimals = 18) => {
  if (!num) return "-";
  return new BigNumber(num)
    .dividedBy(BIG_TEN.pow(decimals))
    .toFormat(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const formatNumberSeparator = (num: string) => {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const getPercentage = (num: string | undefined, total: string | undefined) => {
  if (!num || !total) return "0";
  return new BigNumber(num).dividedBy(new BigNumber(total)).times(100).toFormat(2).toString();
};

export const formatAllocPoint = (allocPoint: string | undefined, totalAllocPoints: number | undefined) => {
  if (!allocPoint || !totalAllocPoints) return "- -";
  return Math.floor((parseInt(allocPoint) / totalAllocPoints) * 100);
};

export const getPortfolioTvl = (tranches: Tranche[]) => {
  let tvl = new BigNumber(0);
  tranches.map((_t) => {
    const _p = new BigNumber(_t.principal);
    tvl = tvl.plus(_p);
  });
  return tvl.toString();
};
export const getPortfolioTotalTarget = (tranches: Tranche[]) => {
  let totalTarget = new BigNumber(0);

  tranches.map((_t) => {
    const _p = new BigNumber(_t.target);
    totalTarget = totalTarget.plus(_p);
  });
  return totalTarget.toString();
};

export const getTotalAllocPoints = (pools: Pool[]) => {
  let totalAllocPoints = 0;
  pools.map((p) => {
    totalAllocPoints += parseInt(p.allocPoint);
  });
  return totalAllocPoints;
};

export const getLockupPeriod = (duration: number) => {
  const lockupPeriod = duration / 86400;
  //for testing
  return lockupPeriod > 1 ? lockupPeriod.toFixed(1) + " Days" : duration / 60 + " Mins";
};

export const getJuniorAPY = (tranches: Tranche[], duration: number | undefined) => {
  // if (!duration) return "-";
  let totalTarget = new BigNumber(0);
  const decimals = 18;

  //"500000000000000000" 50%
  let expectedAPY = new BigNumber("500000000000000000").dividedBy(BIG_TEN.pow(decimals));
  // console.log(expectedAPY.toString());
  expectedAPY = expectedAPY.plus(new BigNumber(1));
  const juniorTVL = new BigNumber(tranches[tranches.length - 1].target).dividedBy(BIG_TEN.pow(decimals));
  // const _duration = new BigNumber(duration);
  const _duration = new BigNumber(86400 * 7);
  const _durationYear = new BigNumber(365 * 86400);
  const durationInYear = _duration.dividedBy(_durationYear);

  tranches.map((_t, _i) => {
    const _target = new BigNumber(_t.target).dividedBy(BIG_TEN.pow(decimals));
    console.log(_target.toNumber());
    console.log("-----");
    totalTarget = totalTarget.plus(_target);
  });

  // totalTarget = totalTarget.dividedBy(BIG_TEN.pow(decimals));
  console.log(expectedAPY.toNumber());
  totalTarget = totalTarget.times(expectedAPY);
  console.log("A", totalTarget.toNumber());

  tranches.map((_t, _i) => {
    if (_i === tranches.length - 1) return;
    let _apy = new BigNumber(_t.apy).dividedBy(BIG_TEN.pow(decimals));
    _apy = _apy.plus(new BigNumber(1));
    console.log(_apy.toNumber());
    const _target = new BigNumber(_t.target).dividedBy(BIG_TEN.pow(decimals));
    const _result = _target.times(_apy);
    console.log("_result");
    console.log(_result.toNumber());
    totalTarget = totalTarget.minus(_apy.times(_target));
  });
  console.log("now", totalTarget.toNumber());
  totalTarget = totalTarget.dividedBy(juniorTVL);
  console.log(totalTarget);
  // console.log("durationInYear", durationInYear.toNumber());
  // totalTarget = totalTarget.times(durationInYear);
  console.log(totalTarget);

  //(0.0748 - 0.0449*0.6 - 0.0673*0.3) / 0.1
  //{[300,000*(1+0.5) - 100,000*(1+0.1) - 100,000*(1+0.2)] - 100,000}/100,000

  return totalTarget.minus(new BigNumber(1)).times(new BigNumber(100)).toString() + "%";
};
export const getRemaining = (target: string | undefined, principal: string | undefined, decimals = 18) => {
  if (target === undefined) return "";
  if (principal === undefined) return "";

  const _target = new BigNumber(target);
  const _principal = new BigNumber(principal);

  const result = _target.minus(_principal);

  return result
    .dividedBy(BIG_TEN.pow(decimals))
    .toFormat(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const compareNum = (num1: string | number | undefined, num2: string | undefined, largerOnly = false) => {
  if (num1 === undefined) return;
  if (num2 === undefined) return;
  const _num1 = new BigNumber(num1);
  const _num2 = new BigNumber(num2);

  if (largerOnly) return _num1.comparedTo(_num2) > 0 ? true : false;
  return _num1.comparedTo(_num2) >= 0 ? true : false;
};