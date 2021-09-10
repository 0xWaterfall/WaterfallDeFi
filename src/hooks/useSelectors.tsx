import { useMemo } from "react";
import { useAppSelector } from "store";

export const useMarkets = () => {
  const markets = useAppSelector((state) => state.markets);
  return markets;
};

export const useSelectedMarket = () => {
  const marketKey = useAppSelector((state) => state.selectedKeys.marketKey);

  const markets = useAppSelector((state) => state.markets);
  // const selectedMarket = markets.find((p, i) => parseInt(marketKey) == i);
  return useMemo(() => {
    if (marketKey) {
      return markets.find((p, i) => parseInt(marketKey) == i);
    }
  }, [marketKey, markets]);
};
