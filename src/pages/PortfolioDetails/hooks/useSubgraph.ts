import { gql, useQuery } from "@apollo/client";
import { TrancheCycle, UserInvest } from "types";
import BigNumber from "bignumber.js";
import { BIG_TEN, BIG_ZERO } from "utils/bigNumber";
import numeral from "numeral";
import { MarketList } from "config/market";
import axios from "axios";
// export const useHistoryQuery = (account: string | null | undefined) => {
//   if (!account) account = "";
//   return useQuery(gql`
//     {
//       trancheCycles(orderBy: id, orderDirection: asc) {
//         id
//         cycle
//         state
//         principal
//         capital
//         rate
//         startAt
//         endAt
//       }
//       tranches {
//         id
//         cycle
//         target
//         apy
//         fee
//       }
//       userInvests(orderBy: cycle, orderDirection: desc ,where: { owner: "${account}" }) {
//         id
//         owner
//         tranche
//         cycle
//         principal
//         capital
//         investAt
//         harvestAt
//       }
//     }
//   `);
// };

export const useHistoryQuery = (account: string | null | undefined, decimals = 18) => {
  if (!account) account = "";
  const { data } = useQuery(
    gql`
    {
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
    }
  `,
    { pollInterval: 10000 }
  );

  // const r = await Promise.all(
  //   MarketList.map(async (p) => {
  //     const res = await axios.post(p.subgraphURL, {
  //       query: `
  //   {
  //     trancheCycles(first:1000,orderBy: id, orderDirection: asc) {
  //       id
  //       cycle
  //       state
  //       principal
  //       capital
  //       rate
  //       startAt
  //       endAt
  //     }
  //     tranches {
  //       id
  //       cycle
  //       target
  //       apy
  //       fee
  //     }
  //     userInvests(orderBy: cycle, orderDirection: desc ,where: { owner: "${account}" }) {
  //       id
  //       owner
  //       tranche
  //       cycle
  //       principal
  //       capital
  //       investAt
  //       harvestAt
  //     }
  //   }
  // `
  //     });
  //     console.log(res.data.data);
  //     return res.data.data;
  //   })
  // );
  // console.log(r);
  const _userInvests: UserInvest[] = [];
  const _trancheCycles: { [key: string]: TrancheCycle } = {};
  if (!data)
    return {
      userInvests: _userInvests,
      trancheCycles: _trancheCycles
    };
  const { trancheCycles, tranches, userInvests } = data;
  if (trancheCycles) {
    for (let i = 0; i < trancheCycles.length; i++) {
      const { id } = trancheCycles[i];
      _trancheCycles[id] = trancheCycles[i];
    }
  }
  if (userInvests) {
    for (let i = 0; i < userInvests.length; i++) {
      const { capital, cycle, harvestAt, id, investAt, owner, principal, tranche } = userInvests[i];
      const trancheCycleId = tranche + "-" + cycle;
      const interest = new BigNumber(capital).isZero()
        ? new BigNumber(principal)
            .times(_trancheCycles[trancheCycleId]?.rate || 0)
            .dividedBy(BIG_TEN.pow(18))
            .minus(new BigNumber(principal))
        : new BigNumber(capital).minus(new BigNumber(principal));
      const earningsAPY = new BigNumber(interest)
        .dividedBy(new BigNumber(principal))
        .times(new BigNumber(365 * 86400 * 100))
        .dividedBy(new BigNumber(_trancheCycles[trancheCycleId]?.endAt - _trancheCycles[trancheCycleId]?.startAt))
        .toFormat(2)
        .toString();
      const _ui: UserInvest = {
        capital: new BigNumber(capital).isZero()
          ? numeral(
              new BigNumber(interest)
                .plus(new BigNumber(principal))
                .dividedBy(BIG_TEN.pow(decimals))
                .toFormat(4)
                .toString()
            ).format("0,0.[0000]")
          : numeral(new BigNumber(capital).dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString()).format(
              "0,0.[0000]"
            ),
        cycle,
        harvestAt,
        id,
        investAt,
        owner,
        principal: numeral(new BigNumber(principal).dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString()).format(
          "0,0.[0000]"
        ),
        tranche,
        interest: numeral(interest.dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString()).format("0,0.[0000]"),
        earningsAPY
      };

      _userInvests.push(_ui);
    }
  }
  return {
    userInvests: _userInvests,
    trancheCycles: _trancheCycles
  };
};
