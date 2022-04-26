import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import useRefresh from "./useRefresh";
import { NETWORK } from "config";
import { getPrice, getWTFSupply } from "services/http";

export const useWTFPriceLP = () => {
  const [price, setPrice] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getPrice();
      setPrice(price);

      const supply = await getWTFSupply();

      setMarketCap(new BigNumber(supply).times(price).toFormat(0).toString());
    };
    fetchPrice();
  }, [NETWORK, slowRefresh]);

  return { price, marketCap };
};
