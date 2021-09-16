import { gql, useQuery } from "@apollo/client";

export const useHistoryQuery = (account: string | null | undefined) => {
  if (!account) account = "";
  return useQuery(gql`
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
};
