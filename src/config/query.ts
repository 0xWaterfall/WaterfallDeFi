import gql from "graphql-tag";

export const getHistoryQuery = (account: string) => {
  if (!account) return;
  return gql`
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
      userInvests(where: { owner: "${account}" }) {
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
  `;
};
