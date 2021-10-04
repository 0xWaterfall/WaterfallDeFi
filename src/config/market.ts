import { TranchesAddress, MasterChefAddress, BUSDAddress, WTFAddress, StrategyAddress } from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import { abi as StrategyAbi } from "./abi/Strategy.json";
import { Market } from "types";

export const MarketList: Market[] = [
  {
    portfolio: "BUSD Falls",
    assets: "BUSD",
    listingDate: "2021/08/29",
    // lockupPeriod: "7 Days",
    // duration: 0,
    // actualStartAt:
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: TranchesAddress,
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MasterChefAddress,
    pools: [],
    depositAssetAddress: BUSDAddress,
    depositAssetAbi: WTFAbi,
    strategyAddress: StrategyAddress,
    strategyAbi: StrategyAbi
  }
];
