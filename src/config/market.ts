import {
  TranchesAddress,
  MasterChefAddress,
  BUSDAddress,
  // WTFAddress,
  // StrategyAddress,
  // sCREAMAddress,
  sVENUSAddress,
  sALPACAAddress,
  TranchesAddress2,
  MasterChefAddress2,
  // MasterChefAddressTest2,
  // TranchesAddressTest2,
  // MasterChefAddressTest,
  // TranchesAddressTest,
  TranchesAddress3,
  MasterChefAddress3,
  TranchesAddressOracle1,
  MasterChefOracleAddress1,
  MasterChefOracleAddress2,
  TranchesAddressOracle2,
  MC_TrancheMasterAddress,
  MC_WTFMasterAddress,
  MC_sALPACA_BUSDAddress,
  MC_sALPACA_TUSDAddress,
  TUSDAddress,
  AR_TrancheMasterAddress
} from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
import { abi as MC_TranchesAbi } from "./abi/MC_TrancheMaster.json";
import { abi as AR_TranchesAbi } from "./abi/AR_TrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
// import { abi as StrategyAbi } from "./abi/Strategy.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: "BUSD Falls 1",
    assets: ["BUSD"],
    tokens: [],
    listingDate: "2022/01/16",
    // lockupPeriod: "7 Days",
    // duration: 0,
    // actualStartAt:
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: TranchesAddressOracle1[NETWORK],
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MasterChefOracleAddress1[NETWORK],
    pools: [],
    autorollImplemented: false,
    isMulticurrency: false,
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls1new"
  },
  {
    portfolio: "BUSD Falls 2",
    assets: ["BUSD"],
    tokens: [],
    listingDate: "2021/01/17",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: TranchesAddressOracle2[NETWORK],
    abi: MC_TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MasterChefOracleAddress2[NETWORK],
    pools: [],
    autorollImplemented: false,
    isMulticurrency: false,
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
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
    subgraphURL: " https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2new"
  },

  {
    portfolio: "BUSD Falls 3",
    assets: ["BUSD"],
    tokens: [],
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
    autorollImplemented: false,
    isMulticurrency: false,
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls3"
  },
  {
    portfolio: "BUSD Falls 1 (Expired)",
    assets: ["BUSD"],
    tokens: [],
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
    autorollImplemented: false,
    isMulticurrency: false,
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-prod",
    isRetired: true
  },
  {
    portfolio: "BUSD Falls 2 (Expired)",
    assets: ["BUSD"],
    tokens: [],
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
    autorollImplemented: false,
    isMulticurrency: false,
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2",
    isRetired: true
  },
  {
    portfolio: "Multi Stablecoin Vault 1 (Test)",
    assets: ["BUSD", "TUSD"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/01/19",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: MC_TrancheMasterAddress[NETWORK],
    abi: MC_TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MC_WTFMasterAddress[NETWORK],
    pools: [],
    autorollImplemented: false,
    isMulticurrency: true,
    depositAssetAddress: "",
    depositAssetAddresses: [BUSDAddress[NETWORK], TUSDAddress[NETWORK]],
    depositAssetAbi: WTFAbi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD",
        shares: 0.5,
        sAddress: MC_sALPACA_BUSDAddress[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Alpaca TUSD",
        shares: 0.5,
        sAddress: MC_sALPACA_TUSDAddress[NETWORK],
        apiKey: "alpaca"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-multicurrency"
  },
  {
    portfolio: "Autoroll Test",
    assets: ["BUSD"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/01/19",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: AR_TrancheMasterAddress[NETWORK],
    abi: AR_TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MC_WTFMasterAddress[NETWORK],
    pools: [],
    autorollImplemented: true,
    isMulticurrency: false,
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
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
      {
        farmName: "Venus BUSD",
        shares: 0.2,
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
