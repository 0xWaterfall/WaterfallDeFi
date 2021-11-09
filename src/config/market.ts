import {
  TranchesAddress,
  MasterChefAddress,
  BUSDAddress,
  WTFAddress,
  StrategyAddress,
  sCREAMAddress,
  sVENUSAddress,
  sALPACAAddress,
  TranchesAddress2,
  MasterChefAddress2
} from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import { abi as StrategyAbi } from "./abi/Strategy.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: NETWORK === "TESTNET" ? "TBUSD Vault" : "BUSD Vault 2",
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
    address: TranchesAddress[NETWORK],
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MasterChefAddress[NETWORK],
    pools: [],
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAbi: WTFAbi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD",
        shares: 0.5,
        sAddress: sALPACAAddress[NETWORK],
        apiKey: "alpaca"
      },
      // {
      //   farmName: "Cream BUSD",
      //   shares: 0.2,
      //   sAddress: sCREAMAddress[NETWORK],
      //   apiKey: "cream"
      // },
      {
        farmName: "Venus BUSD",
        shares: 0.5,
        sAddress: sVENUSAddress[NETWORK],
        apiKey: "venus"
      }
    ]
  },
  {
    portfolio: NETWORK === "TESTNET" ? "TBUSD Vault 3" : "BUSD Vault 3",
    assets: "BUSD",
    listingDate: "2021/11/08",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: TranchesAddress2[NETWORK],
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MasterChefAddress2[NETWORK],
    pools: [],
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAbi: WTFAbi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD",
        shares: 0.5,
        sAddress: sALPACAAddress[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Cream BUSD",
        shares: 0.2,
        sAddress: sCREAMAddress[NETWORK],
        apiKey: "cream"
      },
      {
        farmName: "Venus BUSD",
        shares: 0.5,
        sAddress: sVENUSAddress[NETWORK],
        apiKey: "venus"
      }
    ]
  }
];
