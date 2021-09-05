import { useAppSelector } from "store";

export const useMarkets = () => {
  const markets = useAppSelector((state) => state.markets);
  return markets;
};
