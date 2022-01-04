import { NETWORK } from "config";
import { FarmConfig } from "types";
import { TestLPRewardAddress, TestLPTokenAddress, TestLPTokenAddressApe } from "./address";
const Farms: FarmConfig[] = [
  {
    lpTokenAddress: TestLPTokenAddress[NETWORK],
    lpRewardAddress: TestLPRewardAddress[NETWORK],
    name: "PancakeSwap WTF-BNB LP",
    logo1: "wtf",
    logo2: "bnb",
    lpButtonTitle: "Link to PancakeSwap",
    lpURL: "https://pancakeswap.finance/add/BNB/0x2fA0cac2c75Efb50382B5091C6494194eAcF65B0"
  },
  {
    lpTokenAddress: TestLPTokenAddressApe[NETWORK],
    lpRewardAddress: TestLPRewardAddress[NETWORK],
    name: "ApeSwap WTF-BNB LP",
    logo1: "wtf",
    logo2: "bnb",
    lpButtonTitle: "Link to ApeSwap",
    lpURL: "https://app.apeswap.finance/add/ETH/0x2fA0cac2c75Efb50382B5091C6494194eAcF65B0"
  }
];
export default Farms;
