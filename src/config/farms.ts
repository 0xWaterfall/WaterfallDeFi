import { NETWORK } from "config";
import { FarmConfig } from "types";
import { TestLPRewardAddress, TestLPTokenAddress } from "./address";
const Farms: FarmConfig[] = [
  {
    lpTokenAddress: TestLPTokenAddress[NETWORK],
    lpRewardAddress: TestLPRewardAddress[NETWORK],
    name: "WTF-LP"
  }
];
export default Farms;
