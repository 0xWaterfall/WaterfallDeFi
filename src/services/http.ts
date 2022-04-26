import { BigNumber } from "bignumber.js";
import axios from "axios";
import { I18N } from "config";

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
  //BSC price
  const pancake = await axios.get(
    "https://api.pancakeswap.info/api/v2/tokens/0xd73f32833b6d5d9c8070c23e599e283a3039823c"
  );
  return new BigNumber(pancake?.data?.data?.price).toFixed(2);
};

export const getWTFSupply = async () => {
  try {
    const supply = await axios.get("https://supply.waterfalldefi.org/");
    if (supply.status === 200) {
      return supply.data;
    }
  } catch (err) {
    // Error handling here
    return;
  }
  return;
};

export const getAPYHourly = async (date: string, date2: string) => {
  try {
    const hourly = await axios.get(
      "https://supply.waterfalldefi.org/apys-hourly?from=" +
        date.replace("T", "%24").slice(0, -5) +
        "&to=" +
        date2.replace("T", "%24").slice(0, -5)
    );
    if (hourly.status === 200) {
      return hourly.data;
    }
  } catch (err) {
    // Error handling here
    return;
  }
  return;
};

export const getSubgraphQuery = async (subgraphURL: string, account: string) => {
  try {
    const res = await axios.post(subgraphURL, {
      query: `{
      trancheCycles(first:1000,orderBy: id, orderDirection: asc) {
        id
        cycle
        state
        principal
        capital
        rate
        startAt
        endAt
      }
      tranches {
        id
        cycle
        target
        apy
        fee
      }
      userInvests(orderBy: cycle, orderDirection: desc ,where: { owner: "${account}" }) {
        id
        owner
        tranche
        cycle
        principal
        capital
        investAt
        harvestAt
      }
    }`
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};
export const getFarmsAPY = async () => {
  try {
    const result = await axios.get("https://supply.waterfalldefi.org/farms");
    if (result.status === 200) {
      return result.data;
    }
  } catch (err) {
    // Error handling here
    return;
  }
  return;
};

export const getMarketCap = async () => {
  const coingecko = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=binancecoin&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );
  return new BigNumber(coingecko?.data?.[0]?.market_cap).toFixed(2);
};
