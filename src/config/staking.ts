import { NETWORK } from "config";
import { StakingConfig } from "types";
import { WTFRewardsAddress, VeWTFAddress } from "./address";
const Stakings: StakingConfig[] = [
  {
    rewardTokenAddress: WTFRewardsAddress[NETWORK],
    earningTokenAddress: VeWTFAddress[NETWORK],
    name: "WTF"
  }
];
export default Stakings;
