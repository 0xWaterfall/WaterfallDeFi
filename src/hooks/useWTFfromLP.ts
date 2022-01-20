import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import useRefresh from "./useRefresh";
import { getContract } from "hooks";
import PancakeLPAbi from "config/abi/PancakeLP.json";
import { NETWORK, NETWORKS } from "config";
import { PancakeLPAddress, PancakeLPAddress_WBNBBUSD } from "config/address";
import { getWTFSupply } from "services/http";

export const useWTFPriceLP = () => {
  const [price, setPrice] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchPrice = async () => {
      const contractLP = getContract(PancakeLPAbi, PancakeLPAddress[NETWORK]);
      const reserves = await contractLP.getReserves();
      let price = "0";
      if (NETWORK !== NETWORKS.MAINNET) {
        price = (reserves[1] / reserves[0]).toFixed(2);
      }

      //mainnet
      if (NETWORK === NETWORKS.MAINNET) {
        const contractLP_WBNBBUSD = getContract(PancakeLPAbi, PancakeLPAddress_WBNBBUSD[NETWORK]);
        const reserves2 = await contractLP_WBNBBUSD.getReserves();
        const _price = new BigNumber(reserves[0]?._hex).dividedBy(new BigNumber(reserves[1]?._hex));
        const _price_WBNBBUSD = new BigNumber(reserves2[1]?._hex).dividedBy(new BigNumber(reserves2[0]?._hex));
        price = _price.times(_price_WBNBBUSD).toFormat(2).toString();
      }

      setPrice(price);

      const supply = await getWTFSupply();

      // const contractWTF = getContract(WTFAbi, WTFAddress[NETWORK]);
      // const totalSupply = await contractWTF.totalSupply();
      setMarketCap(new BigNumber(supply).times(price).toFormat(0).toString());
    };
    fetchPrice();
  }, [NETWORK, slowRefresh]);

  return { price, marketCap };
};
