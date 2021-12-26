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
  MasterChefAddress2,
  MasterChefAddressTest2,
  TranchesAddressTest2,
  MasterChefAddressTest,
  TranchesAddressTest,
  TranchesAddress3,
  MasterChefAddress3
} from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import { abi as StrategyAbi } from "./abi/Strategy.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: NETWORK === "TESTNET" ? "TBUSD Vault" : "BUSD Falls 1",
    assets: "BUSD",
    listingDate: "2021/11/16",
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
        shares: 0.8,
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
        shares: 0.2,
        sAddress: sVENUSAddress[NETWORK],
        apiKey: "venus"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-prod"
  },
  {
    portfolio: NETWORK === "TESTNET" ? "TBUSD Vault" : "BUSD Falls 2",
    assets: "BUSD",
    listingDate: "2021/11/25",
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
    strategyFarms: [
      {
        farmName: "Alpaca BUSD",
        shares: 0.8,
        sAddress: sALPACAAddress[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Venus BUSD",
        shares: 0.2,
        sAddress: sVENUSAddress[NETWORK],
        apiKey: "venus"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2"
  },

  {
    portfolio: "BUSD Falls 3",
    assets: "BUSD",
    listingDate: "2021/12/26",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: TranchesAddress3[NETWORK],
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MasterChefAddress3[NETWORK],
    pools: [],
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD",
        shares: 0.7,
        sAddress: sALPACAAddress[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Venus BUSD",
        shares: 0.3,
        sAddress: sVENUSAddress[NETWORK],
        apiKey: "venus"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2"
  }
  // {
  //   portfolio: NETWORK === "TESTNET" ? "TBUSD Vault" : "BUSD TVault 2",
  //   assets: "BUSD",
  //   listingDate: "2021/08/29",
  //   // lockupPeriod: "7 Days",
  //   // duration: 0,
  //   // actualStartAt:
  //   tranches: [],
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: TranchesAddressTest[NETWORK],
  //   abi: TranchesAbi,
  //   masterChefAbi: MasterChefAbi,
  //   masterChefAddress: MasterChefAddressTest[NETWORK],
  //   pools: [],
  //   depositAssetAddress: BUSDAddress[NETWORK],
  //   depositAssetAbi: WTFAbi,
  //   // strategyAddress: StrategyAddress[NETWORK],
  //   // strategyAbi: StrategyAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "Alpaca BUSD",
  //       shares: 0.5,
  //       sAddress: sALPACAAddress[NETWORK],
  //       apiKey: "alpaca"
  //     },
  //     // {
  //     //   farmName: "Cream BUSD",
  //     //   shares: 0.2,
  //     //   sAddress: sCREAMAddress[NETWORK],
  //     //   apiKey: "cream"
  //     // },
  //     {
  //       farmName: "Venus BUSD",
  //       shares: 0.5,
  //       sAddress: sVENUSAddress[NETWORK],
  //       apiKey: "venus"
  //     }
  //   ],
  //   subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-test",
  //   isRetired: true
  // }
  // {
  //   portfolio: NETWORK === "TESTNET" ? "TBUSD Vault 3" : "BUSD TVault 3",
  //   assets: "BUSD",
  //   listingDate: "2021/11/08",
  //   tranches: [],
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: TranchesAddressTest2[NETWORK],
  //   abi: TranchesAbi,
  //   masterChefAbi: MasterChefAbi,
  //   masterChefAddress: MasterChefAddressTest2[NETWORK],
  //   pools: [],
  //   depositAssetAddress: BUSDAddress[NETWORK],
  //   depositAssetAbi: WTFAbi,
  //   // strategyAddress: StrategyAddress[NETWORK],
  //   // strategyAbi: StrategyAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "Alpaca BUSD",
  //       shares: 0.5,
  //       sAddress: sALPACAAddress[NETWORK],
  //       apiKey: "alpaca"
  //     },
  //     {
  //       farmName: "Cream BUSD",
  //       shares: 0.2,
  //       sAddress: sCREAMAddress[NETWORK],
  //       apiKey: "cream"
  //     },
  //     {
  //       farmName: "Venus BUSD",
  //       shares: 0.3,
  //       sAddress: sVENUSAddress[NETWORK],
  //       apiKey: "venus"
  //     }
  //   ],
  //   subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-test2"
  // }
];
