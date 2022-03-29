import { NETWORK } from "config";
import { StakingConfig } from "types";
import { WTFRewardsAddressBNB, VeWTFAddressBNB, WTFRewardsAddressAVAX, VeWTFAddressAVAX } from "./address";
const Stakings: StakingConfig[] = [
  {
    rewardTokenAddress: WTFRewardsAddressBNB[NETWORK],
    earningTokenAddress: VeWTFAddressBNB[NETWORK],
    name: "WTF - BNB"
  },
  {
    rewardTokenAddress: WTFRewardsAddressAVAX[NETWORK],
    earningTokenAddress: VeWTFAddressAVAX[NETWORK],
    name: "WTF - AVAX"
  }
];
export default Stakings;
