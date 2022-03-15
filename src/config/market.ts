import {
  AR_sALPACA_Address,
  AR_sVENUS_Address,
  AR_TrancheMasterAddress,
  AR_WTFMasterAddress,
  BNBBUSD_sALPACA_Address,
  BNBUSDT_sALPACA_Address,
  BNB_Address,
  BNB_TrancheMasterAddress,
  BNB_WTFMasterAddress,
  BUSDAddress,
  MC_sALPACA_BUSDAddress,
  MC_sALPACA_TUSDAddress,
  MC_TrancheMasterAddress,
  MC_WTFMasterAddress,
  TUSDAddress
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
    portfolio: "Multicurrency 2",
    assets: ["BUSD", "TUSD"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/03/15",
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
        shares: 0.6,
        sAddress: MC_sALPACA_BUSDAddress[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Alpaca TUSD",
        shares: 0.4,
        sAddress: MC_sALPACA_TUSDAddress[NETWORK],
        apiKey: "alpaca"
      }
    ],
    subgraphURL: "https://apitest2.waterfalldefi.org/subgraphs/name/waterfall/bsc_test_multicurrency"
  },
  {
    portfolio: "Autoroll Test",
    assets: ["BUSD"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/03/15",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: AR_TrancheMasterAddress[NETWORK],
    abi: AR_TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: AR_WTFMasterAddress[NETWORK],
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
        sAddress: AR_sALPACA_Address[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Venus BUSD",
        shares: 0.2,
        sAddress: AR_sVENUS_Address[NETWORK],
        apiKey: "venus"
      }
    ],
    subgraphURL: "https://apitest2.waterfalldefi.org/subgraphs/name/waterfall/bsc_test_autoroll"
  },
  {
    portfolio: "BNB Test",
    assets: ["BNB"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/03/15",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: BNB_TrancheMasterAddress[NETWORK],
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: BNB_WTFMasterAddress[NETWORK],
    pools: [],
    autorollImplemented: false,
    isMulticurrency: false,
    depositAssetAddress: BNB_Address[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BNB/BUSD",
        shares: 0.8,
        sAddress: BNBBUSD_sALPACA_Address[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Alpaca BNB/USDT",
        shares: 0.2,
        sAddress: BNBUSDT_sALPACA_Address[NETWORK],
        apiKey: "venus"
      }
    ],
    subgraphURL: "https://apitest2.waterfalldefi.org/subgraphs/name/waterfall/bsc_test_autoroll"
  }
];
