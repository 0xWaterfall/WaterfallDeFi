import { NETWORK } from "config";
import { FarmConfig } from "types";
import { TestLPRewardAddress, TestLPTokenAddress } from "./address";
const Farms: FarmConfig[] = [
  {
    lpTokenAddress: TestLPTokenAddress[NETWORK],
    lpRewardAddress: TestLPRewardAddress[NETWORK],
    name: "PancakeSwap WTF-BNB LP",
    logo1: "wtf",
    logo2: "bnb"
  }
];
export default Farms;
