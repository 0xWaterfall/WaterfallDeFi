import { BigNumber } from "bignumber.js";
import axios from "axios";
import { I18N } from "config";
import dayjs from "dayjs";
import { sVENUSAddress } from "config/address";

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
export const getSubgraphQuery = async (subgraphURL: string, account: string) => {
  try {
    // const res2 = await axios.post("https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-prod", {
    //   query: `

    //  {
    //     tranches(first:5) {
    //        apy
    //        fee
    //        cycle
    //     }
    //   }`
    // });
    // console.log(res2);
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
// export const getVenusAPY = async () => {
//   const venusFarmAddress = "0x95c78222b3d6e262426483d42cfa53685a67ab9d";
//   const url = "https://api.venus.io/api/vtoken?addresses=" + venusFarmAddress;
//   const result = await axios.get(url);
//   if (result.status === 200) {
//     return parseFloat(result?.data?.data?.markets[0].supplyApy) / 100;
//   }
//   return;
// };
// export const getCreamAPY = async () => {
//   const creamFarmAddress = "0x2Bc4eb013DDee29D37920938B96d353171289B7C";
//   const url = "https://api.cream.finance/api/v1/crtoken?comptroller=bsc";
//   const result = await axios.get(url);
//   if (result.status === 200) {
//     if (result.data.length > 0) {
//       const a = result.data.find((d: any) => {
//         return d.token_address == creamFarmAddress;
//       });
//       return parseFloat(a.supply_apy.value);
//     }
//   }
//   return;
// };

export const getMarketCap = async () => {
  const coingecko = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=binancecoin&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );
  return new BigNumber(coingecko?.data?.[0]?.market_cap).toFixed(2);
};
