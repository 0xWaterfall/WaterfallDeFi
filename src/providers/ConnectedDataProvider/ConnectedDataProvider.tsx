import { MarketList } from "config/market";
import React, { FC, useEffect } from "react";
import { useAppDispatch } from "store";
import { getMarkets } from "store/markets";
import { getInfo } from "store/WTFInfo";

const ConnectedDataProvider: FC = ({ children }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMarkets(MarketList));
    dispatch(getInfo());
    const timer = setInterval(() => {
      dispatch(getMarkets(MarketList));
    }, 30000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <>{children}</>;
};

export default ConnectedDataProvider;
