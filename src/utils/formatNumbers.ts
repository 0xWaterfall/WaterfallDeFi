import BigNumber from "bignumber.js";
import { Tranche } from "types";
import { BIG_TEN } from "./bigNumber";
import dayjs from "dayjs";
import numeral from "numeral";
import { BLOCK_TIME } from "config";
import axios from "axios";
export const formatAPY = (apy: string | undefined, decimals = 16) => {
  if (!apy) return "- -";
  return new BigNumber(apy).dividedBy(BIG_TEN.pow(decimals)).toString() + " %";
};
export const formatRedemptionFee = (apy: string | undefined, decimals = 3) => {
  if (!apy) return "- -";
  return new BigNumber(apy).dividedBy(BIG_TEN.pow(decimals)).toString() + " %";
};

export const formatBalance = (num: string | undefined, decimals = 18) => {
  if (!num) return "- -";
  return new BigNumber(num).dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString();
};
export const formatDisplayTVL = (num: string | undefined, decimals = 18) => {
  if (!num) return "-";
  return numeral(new BigNumber(num).dividedBy(BIG_TEN.pow(decimals)).toFormat(0).toString()).format("0,0");
  // .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
export const formatTVL = (num: string | undefined, decimals = 18) => {
  if (!num) return "- -";
  return new BigNumber(num).toFormat(4).toString();
};
export const formatNumberDisplay = (num: string | undefined, decimals = 18) => {
  if (!num) return "-";
  return numeral(new BigNumber(num).dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString()).format("0,0.[0000]");
  // .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
export const formatNumberWithDecimalsDisplay = (num: string | undefined, decimals = 18) => {
  if (!num) return "-";
  return (
    new BigNumber(num)
      // .dividedBy(BIG_TEN.pow(decimals))
      .toFormat(2)
      .toString()
    // .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
  );
};
export const formatNumberSeparator = (num: string) => {
  // return num.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  return numeral(num).format("0,0.[0000]");
};
export const formatTimestamp = (num: string | number) => {
  const format1 = "YYYY/MM/DD HH:mm:ss";
  const d = parseInt(num + "000");
  return dayjs(d).format(format1);
};
export const getPercentage = (num: string | undefined, total: string | undefined) => {
  if (!num || !total) return "0";
  return new BigNumber(num).dividedBy(new BigNumber(total)).times(100).toFormat(2).toString();
};

export const formatAllocPoint = (allocPoint: string | undefined, totalAllocPoints: string | undefined) => {
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
  return lockupPeriod >= 1 ? numeral(lockupPeriod).format("0.[0]") + " Days" : Number(duration) / 60 + " Mins";
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
    const _interest = _apy.times(_principal).times(_timePeriod).dividedBy(BIG_TEN.pow(18)).toFormat(0).toString();
    // .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    const _principalAndInterest = _principal
      .times(_apy)
      .times(_timePeriod)
      .plus(_principal)
      .dividedBy(BIG_TEN.pow(18))
      .toFormat(0)
      .toString();
    // .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    interests.push(numeral(_interest).format("0,0.[0000]"));
    principalAndInterests.push(numeral(_principalAndInterest).format("0,0.[0000]"));
  });
  return { interests, principalAndInterests };
};

export const getJuniorAPY = (tranches?: Tranche[], numbersOnly = false) => {
  // if (!duration) return "-";
  if (!tranches) return "--";
  let totalTarget = new BigNumber(0);
  const decimals = 18;

  //"500000000000000000" 50%
  let expectedAPY = new BigNumber("210000000000000000").dividedBy(BIG_TEN.pow(decimals));
  expectedAPY = expectedAPY.plus(new BigNumber(1));
  const juniorTVL = new BigNumber(tranches[tranches.length - 1].target).dividedBy(BIG_TEN.pow(decimals));
  // const _duration = new BigNumber(86400 * 7);
  // const _durationYear = new BigNumber(365 * 86400);
  // const durationInYear = _duration.dividedBy(_durationYear);

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
    // const _result = _target.times(_apy);
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
  if (target === undefined) return { remaining: "", remainingExact: "" };
  if (principal === undefined) return { remaining: "", remainingExact: "" };

  const _target = new BigNumber(target);
  const _principal = new BigNumber(principal);

  const result = _target.minus(_principal);

  return {
    remaining: numeral(result.toFormat(4).toString()).format("0,0.[0000]"),
    remainingExact: result.toFormat(18).toString()
  };
};
export const getRemainingMulticurrency = (
  target: string | undefined,
  principal: string | undefined,
  remainingDepositable: BigNumber,
  decimals = 18
) => {
  if (target === undefined) return { remaining: "", remainingExact: "", depositableOrInTranche: "" };
  if (principal === undefined) return { remaining: "", remainingExact: "", depositableOrInTranche: "" };

  const _target = new BigNumber(target);
  const _principal = new BigNumber(principal);
  const _remainingDepositable = remainingDepositable;

  const remainingInTranche = _target.minus(_principal);
  const depositableOrInTranche = _remainingDepositable < remainingInTranche ? "depositable" : "inTranche";
  const result = _remainingDepositable < remainingInTranche ? _remainingDepositable : remainingInTranche;

  return {
    remaining: numeral(result.toFormat(4).toString()).format("0,0.[0000]"),
    remainingExact: result.toFormat(decimals).toString(),
    depositableOrInTranche: depositableOrInTranche
  };
};
export const compareNum = (num1: string | number | undefined, num2: string | undefined, largerOnly = false) => {
  if (num1 === undefined) return;
  if (num2 === undefined) return;
  const _num1 = new BigNumber(num1);
  const _num2 = new BigNumber(num2);

  if (largerOnly) return _num1.comparedTo(_num2) > 0 ? true : false;
  return _num1.comparedTo(_num2) >= 0 ? true : false;
};
export const getWTFApr = (
  wtfAPY: string | undefined,
  tranche: Tranche | undefined,
  duration: string | undefined,
  rewardPerBlock: string | undefined,
  wtfPrice: string | null,
  assets?: string[] | null,
  coingeckoPrices?: any
) => {
  if (wtfAPY === undefined) return;
  if (tranche === undefined) return;
  if (duration === undefined) return;
  if (rewardPerBlock === undefined) return;
  if (wtfPrice === null) return;
  wtfAPY = wtfAPY.replace("+ ", "");

  // const wtfPrice = 1;
  let target = new BigNumber(tranche.target);
  console.log("target1", target.toString(), assets, coingeckoPrices);
  let avaxPrice = 1;
  if (assets?.includes("WAVAX")) {
    avaxPrice = coingeckoPrices?.["wrapped-avax"]?.usd;
    target = target.times(avaxPrice);
  }

  const chainId =
    assets?.includes("BUSD") || assets?.includes("WBNB")
      ? process.env.REACT_APP_BNB_CHAIN_ID
      : process.env.REACT_APP_CHAIN_ID;
  const blockTime = BLOCK_TIME(chainId || "");
  const blocksInDuration = new BigNumber(duration).dividedBy(blockTime);
  const tokensInDuration = new BigNumber(blocksInDuration).times(rewardPerBlock);
  // (100 * 1) / 100000 * (365 * 86400) / 60018:27

  const wtfReward = new BigNumber(wtfAPY)
    // .dividedBy(new BigNumber(100))
    .times(tokensInDuration)
    .times(new BigNumber(wtfPrice))
    .dividedBy(target)
    .times(new BigNumber(86400 * 365))
    .dividedBy(duration)
    .toFormat(2)
    .toString();

  // if (tokensInDuration.toString() !== "0")
  //   console.log(
  //     "wtfapr",
  //     // wtfAPY.toString(),
  //     // tokensInDuration.toString(),
  //     // wtfPrice,
  //     // target.toString(),
  //     // 86400 * 365,
  //     // duration,
  //     // duration,
  //     // rewardPerBlock.toString(),
  //     // blocksInDuration.toString(),
  //     tokensInDuration.toString(),

  //     new BigNumber(wtfAPY)
  //       .dividedBy(new BigNumber(100))
  //       .times(tokensInDuration)
  //       .times(new BigNumber(wtfPrice))
  //       .dividedBy(target)
  //       .times(new BigNumber(86400 * 365))
  //       .dividedBy(duration)
  //       .toString()
  //     // wtfReward
  //   );
  return wtfReward;
};
export const getNetApr = (
  trancheAPY: string | undefined,
  wtfAPY: string | undefined,
  tranche: Tranche | undefined,
  duration: string | undefined,
  rewardPerBlock: string | undefined,
  wtfPrice: string | null
) => {
  if (trancheAPY === undefined) return;
  if (wtfAPY === undefined) return;
  if (tranche === undefined) return;
  if (duration === undefined) return;
  if (rewardPerBlock === undefined) return;
  if (wtfPrice === null) return;

  trancheAPY = trancheAPY.replace("%", "");
  const _wtfAPY = getWTFApr(wtfAPY, tranche, duration, rewardPerBlock, wtfPrice);
  wtfAPY = wtfAPY.replace("+ ", "");
  // const target = new BigNumber(tranche.target).dividedBy(BIG_TEN.pow(18));
  // const fee = new BigNumber(tranche.fee).dividedBy(1000).toString();

  return Number(trancheAPY) + Number(_wtfAPY);
};
