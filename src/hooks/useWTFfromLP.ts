import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import useRefresh from "./useRefresh";
import { getContract } from "hooks";
import PancakeLPAbi from "config/abi/PancakeLP.json";
import { NETWORK } from "config";
import { PancakeLPAddress, WTFAddress } from "config/address";
import { abi as WTFAbi } from "config/abi/WTF.json";
import { BIG_TEN } from "utils/bigNumber";

export const useWTFPriceLP = () => {
  const [price, setPrice] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchPrice = async () => {
      const contractLP = getContract(PancakeLPAbi, PancakeLPAddress[NETWORK]);
      const reserves = await contractLP.getReserves();
      const _price = (reserves[1] / reserves[0]).toFixed(2);
      setPrice(_price);

      //   const contractWTF = getContract(WTFAbi, WTFAddress[NETWORK]);
      //   const totalSupply = await contractWTF.totalSupply();

      //   setMarketCap(new BigNumber(totalSupply._hex).dividedBy(BIG_TEN.pow(18)).times(_price).toString());
    };
    fetchPrice();
  }, [NETWORK, slowRefresh]);

  return { price, marketCap };
};
