import { TranchesAddress, MasterChefAddress } from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { Market } from "types";
export const MarketList: Market[] = [
  {
    portfolio: "BUSD Falls",
    assets: "BUSD",
    lockupPeriod: "7 Days",
    tranches: [],
    tvl: "",
    status: "",
    nextTime: "",
    address: TranchesAddress,
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MasterChefAddress,
    pools: []
  }
];
