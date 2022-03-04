import { Market, TrancheCycle, UserInvest } from "types";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import numeral from "numeral";
import { MarketList } from "config/market";
import { getSubgraphQuery } from "services/http";
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

export const useHistoryQuery = (
  account: string | null | undefined,
  duration: string | null | undefined,
  decimals = 18
) => {
  if (!account) account = "";
  //multi-farm
  if (!duration) duration = "0";

  const data = {
    trancheCycles: [],
    tranches: [],
    userInvests: []
  };
  MarketList.map(async (p) => {
    if (!account) return;
    const res = await getSubgraphQuery(p.subgraphURL, account);
    // console.log(res);
    if (res) return res.data.data;
  });
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
        // .dividedBy(new BigNumber(_trancheCycles[trancheCycleId]?.endAt - _trancheCycles[trancheCycleId]?.startAt))
        .dividedBy(new BigNumber(duration).plus(new BigNumber(_trancheCycles[trancheCycleId]?.startAt))) //multi-farm
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

export const useHistoryQuery2 = async (
  marketId: string | undefined,
  account: string | null | undefined,
  markets: Market[],
  decimals = 18
) => {
  if (!account) return [];
  // const data = {
  //   trancheCycles: [],
  //   tranches: [],
  //   userInvests: []
  // };
  const historyQueryResult: any = [];
  const subgraphResult: any = [];

  for (let marketIdx = 0; marketIdx < MarketList.length; marketIdx++) {
    const p = MarketList[marketIdx];
    if (marketId === undefined || (marketId !== undefined && marketId === marketIdx.toString())) {
      const res = await getSubgraphQuery(p.subgraphURL, account);
      if (res && res.data.data) subgraphResult[marketIdx] = res.data.data;
    }
  }
  if (subgraphResult.length === 0) return;
  for (let marketIdx = 0; marketIdx < subgraphResult.length; marketIdx++) {
    const _subgraphResult = subgraphResult[marketIdx];
    if (!_subgraphResult) continue;
    const _market = markets[marketIdx];

    //all markets appear to have duration 0
    // const _duration = _market.duration || "0";
    const _duration = "0";

    const _userInvests: UserInvest[] = [];
    const _trancheCycles: { [key: string]: TrancheCycle } = {};
    let returnData = {
      userInvests: _userInvests,
      trancheCycles: _trancheCycles
    };
    // if (!data)
    //   return {
    //     userInvests: _userInvests,
    //     trancheCycles: _trancheCycles
    //   };
    const { trancheCycles, tranches, userInvests } = _subgraphResult;
    if (trancheCycles) {
      for (let i = 0; i < trancheCycles.length; i++) {
        const { id } = trancheCycles[i];
        _trancheCycles[id] = trancheCycles[i];
      }
    }
    if (userInvests) {
      for (let i = 0; i < userInvests.length; i++) {
        // console.log(userInvests[i]);
        const { capital, cycle, harvestAt, id, investAt, owner, principal, tranche } = userInvests[i];
        const trancheCycleId = tranche + "-" + cycle;
        const _farmDuration =
          _trancheCycles[trancheCycleId]?.endAt > +_trancheCycles[trancheCycleId]?.startAt + +Number(_duration)
            ? new BigNumber(_trancheCycles[trancheCycleId]?.endAt - _trancheCycles[trancheCycleId]?.startAt)
            : new BigNumber(_duration);
        const interest = new BigNumber(capital).isZero()
          ? new BigNumber(principal)
              .times(_trancheCycles[trancheCycleId]?.rate || 0)
              .dividedBy(BIG_TEN.pow(18))
              .minus(new BigNumber(principal))
          : new BigNumber(capital).minus(new BigNumber(principal));
        const earningsAPY = new BigNumber(interest)
          .dividedBy(new BigNumber(principal))
          .times(new BigNumber(365 * 86400 * 100))
          // .dividedBy(new BigNumber(_trancheCycles[trancheCycleId]?.endAt - _trancheCycles[trancheCycleId]?.startAt))
          .dividedBy(new BigNumber(_farmDuration)) //multi-farm
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
    returnData = {
      userInvests: _userInvests,
      trancheCycles: _trancheCycles
    };
    historyQueryResult[marketIdx] = returnData;
  }
  // console.log("historyQueryResult result", historyQueryResult);
  return historyQueryResult;
};
