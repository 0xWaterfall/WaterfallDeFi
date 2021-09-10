import { useAppSelector } from "store";

export const useMarkets = () => {
  const markets = useAppSelector((state) => state.markets);
  return markets;
};

export const useSelectedMarket = () => {
  const marketKey = useAppSelector((state) => state.selectedKeys.marketKey);
  if (!marketKey) return;

  const markets = useAppSelector((state) => state.markets);
  const selectedMarket = markets.find((p, i) => parseInt(marketKey) == i);
  return selectedMarket;
};
