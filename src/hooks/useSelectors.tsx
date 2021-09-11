import { useMemo } from "react";
import { useAppSelector } from "store";

export const useMarkets = () => {
  const markets = useAppSelector((state) => state.markets);
  return markets;
};

export const useSelectedMarket = () => {
  const marketKey = useAppSelector((state) => state.selectedKeys.marketKey);
  const markets = useAppSelector((state) => state.markets);
  return useMemo(() => {
    if (marketKey) {
      return markets.find((p, i) => parseInt(marketKey) == i);
    }
  }, [marketKey, markets]);
};

export const usePosition = () => {
  const position = useAppSelector((state) => state.position);
  return position;
};
