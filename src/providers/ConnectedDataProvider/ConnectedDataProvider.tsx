import { MarketList } from "config/market";
import React, { FC, useEffect } from "react";
import { useAppDispatch } from "store";
import { getMarkets } from "store/markets";

const ConnectedDataProvider: FC = ({ children }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(getMarkets(MarketList));
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <>{children}</>;
};

export default ConnectedDataProvider;
