import BigNumber from "bignumber.js";
import { Pool, Tranche } from "types";
import Web3 from "web3";
import { BIG_TEN } from "./bigNumber";
import moment from "moment";
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
export const formatNumberWithDecimalsDisplay = (num: string | undefined, decimals = 18) => {
  if (!num) return "-";
  return (
    new BigNumber(num)
      // .dividedBy(BIG_TEN.pow(decimals))
      .toFormat(2)
      .toString()
    // .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
};
export const formatNumberSeparator = (num: string) => {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const formatTimestamp = (num: string | number) => {
  const format1 = "YYYY-MM-DD HH:mm:ss";
  const format2 = "YYYY-MM-DD";
  const d = parseInt(num + "000");
  return moment(d).format(format1);
};
export const getPercentage = (num: string | undefined, total: string | undefined) => {
  if (!num || !total) return "0";
  return new BigNumber(num).dividedBy(new BigNumber(total)).times(100).toFormat(2).toString();
};

export const formatAllocPoint = (allocPoint: string | undefined, totalAllocPoints: string | undefined) => {
  console.log(allocPoint, totalAllocPoints);
  if (!allocPoint || !totalAllocPoints) return "- -";
  return "+ " + Math.floor((parseInt(allocPoint) / parseInt(totalAllocPoints)) * 100);
};

export const formatBigNumber2HexString = (bn: BigNumber) => {
  return "0x" + bn.toString(16);
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
    console.log(_p);
    totalTarget = totalTarget.plus(_p);
  });
  return totalTarget.toString();
};

// export const getTotalAllocPoints = (pools: Pool[]) => {
//   let totalAllocPoints = 0;
//   pools.map((p) => {
//     totalAllocPoints += parseInt(p.allocPoint);
//   });
//   return totalAllocPoints;
// };

export const getLockupPeriod = (duration: string) => {
  const lockupPeriod = Number(duration) / 86400;
  //for testing
  return lockupPeriod > 1 ? lockupPeriod.toFixed(1) + " Days" : Number(duration) / 60 + " Mins";
};

export const getInterest = (
  tranches: Tranche[] | undefined,
  position: any,
  duration: string | undefined,
  decimals = 18
) => {
  if (!tranches || !duration) return {};
  const interests: string[] = [];
  const principalAndInterests: string[] = [];
  const _durationYear = new BigNumber(365 * 86400);
  const _timePeriod = new BigNumber(duration).dividedBy(_durationYear);

  tranches.map((_t, _i) => {
    const _apy =
      _i !== tranches.length - 1
        ? new BigNumber(tranches[_i].apy).dividedBy(BIG_TEN.pow(decimals))
        : new BigNumber(getJuniorAPY(tranches, true)).dividedBy(100);
    const _principal = new BigNumber(position[_i]?.[1].hex);
    const _interest = _apy
      .times(_principal)
      .times(_timePeriod)
      .dividedBy(BIG_TEN.pow(18))
      .toFormat(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const _principalAndInterest = _principal
      .times(_apy)
      .times(_timePeriod)
      .plus(_principal)
      .dividedBy(BIG_TEN.pow(18))
      .toFormat(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    interests.push(_interest);
    principalAndInterests.push(_principalAndInterest);
  });
  return { interests, principalAndInterests };
};

export const getJuniorAPY = (tranches?: Tranche[], numbersOnly = false) => {
  // if (!duration) return "-";
  if (!tranches) return "--";
  let totalTarget = new BigNumber(0);
  const decimals = 18;

  //"500000000000000000" 50%
  let expectedAPY = new BigNumber("500000000000000000").dividedBy(BIG_TEN.pow(decimals));
  expectedAPY = expectedAPY.plus(new BigNumber(1));
  const juniorTVL = new BigNumber(tranches[tranches.length - 1].target).dividedBy(BIG_TEN.pow(decimals));
  const _duration = new BigNumber(86400 * 7);
  const _durationYear = new BigNumber(365 * 86400);
  const durationInYear = _duration.dividedBy(_durationYear);

  tranches.map((_t, _i) => {
    const _target = new BigNumber(_t.target).dividedBy(BIG_TEN.pow(decimals));
    totalTarget = totalTarget.plus(_target);
  });

  // totalTarget = totalTarget.dividedBy(BIG_TEN.pow(decimals));
  totalTarget = totalTarget.times(expectedAPY);

  tranches.map((_t, _i) => {
    if (_i === tranches.length - 1) return;
    let _apy = new BigNumber(_t.apy).dividedBy(BIG_TEN.pow(decimals));
    _apy = _apy.plus(new BigNumber(1));
    const _target = new BigNumber(_t.target).dividedBy(BIG_TEN.pow(decimals));
    const _result = _target.times(_apy);
    totalTarget = totalTarget.minus(_apy.times(_target));
  });
  totalTarget = totalTarget.dividedBy(juniorTVL);

  //(0.0748 - 0.0449*0.6 - 0.0673*0.3) / 0.1
  //{[300,000*(1+0.5) - 100,000*(1+0.1) - 100,000*(1+0.2)] - 100,000}/100,000
  const result = totalTarget.minus(new BigNumber(1)).times(new BigNumber(100)).toString();
  if (numbersOnly) return result;
  return result !== "NaN" ? result + "%" : "- -";
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
