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
  return new BigNumber(pancake.data.data.price).toFixed(2);
};
