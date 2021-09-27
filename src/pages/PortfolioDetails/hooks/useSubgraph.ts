import { gql, useQuery } from "@apollo/client";
import { TrancheCycle, UserInvest } from "types";
import BigNumber from "bignumber.js";
import { BIG_TEN, BIG_ZERO } from "utils/bigNumber";
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
  const { data } = useQuery(gql`
    {
      trancheCycles(orderBy: id, orderDirection: asc) {
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
  `);
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
        ? BIG_ZERO
        : new BigNumber(capital).minus(new BigNumber(principal));
      const earningsAPY = new BigNumber(interest)
        .dividedBy(new BigNumber(principal))
        .times(new BigNumber(365 * 86400 * 100))
        .dividedBy(new BigNumber(_trancheCycles[trancheCycleId].endAt - _trancheCycles[trancheCycleId].startAt))
        .toFormat(0)
        .toString();
      const _ui: UserInvest = {
        capital,
        cycle,
        harvestAt,
        id,
        investAt,
        owner,
        principal: new BigNumber(principal).dividedBy(BIG_TEN.pow(decimals)).toFormat(0).toString(),
        tranche,
        interest: interest.dividedBy(BIG_TEN.pow(decimals)).toFormat(0).toString(),
        earningsAPY
      };
      _userInvests.push(_ui);
    }
  }
  console.log({
    userInvests: _userInvests,
    trancheCycles: _trancheCycles
  });
  return {
    userInvests: _userInvests,
    trancheCycles: _trancheCycles
  };
};
