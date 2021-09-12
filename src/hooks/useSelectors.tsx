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
  const position = useAppSelector((state) => state.position.positions);
  return position;
};

export const usePendingWTFReward = () => {
  const pendingWTFReward = useAppSelector((state) => state.position.pendingWTFReward);
  return pendingWTFReward;
};

export const useTrancheBalance = () => {
  const balance = useAppSelector((state) => state.position.balance);
  const invested = useAppSelector((state) => state.position.invested);
  return { balance, invested };
};
