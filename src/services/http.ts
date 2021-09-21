import { BigNumber } from "bignumber.js";
import axios from "axios";
import { I18N } from "config";
import dayjs from "dayjs";

export const getI18nLanguages = async () => {
  const response = await fetch(`${I18N}languages.json`);
  const data = await response.json();
  return data;
};

export const getI18nMessages = async (locale: string) => {
  const response = await fetch(`${I18N}${locale}.json`);
  const data = await response.json();
  return data;
};

export const getPrice = async () => {
  // const r = await axios.get("https://ascendex.com/api/pro/v1/ticker?symbol=BNB/USDT", {
  //   headers: { "x-auth-timestamp": dayjs().valueOf(), "x-auth-key": "1" }
  // });

  const pancake = await axios.get(
    "https://api.pancakeswap.info/api/v2/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
  );
  return new BigNumber(pancake?.data?.data?.price).toFixed(2);
};

export const getMarketCap = async () => {
  const coingecko = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=binancecoin&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );
  return new BigNumber(coingecko?.data?.[0]?.market_cap).toFixed(2);
};
