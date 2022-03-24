import {
  DAIFallsTrancheMasterAddress,
  DAIFallsMasterWTFAddress,
  DAI_E_DepositAddress,
  DAITraderJoeStrategyAddress,
  WAVAXFallsTrancheMasterAddress,
  WAVAXFallsMasterWTFAddress,
  WAVAXDepositAddress,
  WAVAXTraderJoeStrategyAddress,
  WAVAXBenqiStrategyAddress,
  DAIBenqiStrategyAddress,
  MAXIFallsTrancheMasterAddress,
  MAXIFallsMasterWTFAddress,
  MAXITraderJoeStrategyAddress,
  MAXIBenqiStrategyAddress,
  MAXIMaximizerStrategyAddress,
  MC_TrancheMasterAddress,
  MC_WTFMasterAddress,
  BUSDAddress,
  TUSDAddress,
  MC_sALPACA_BUSDAddress,
  MC_sALPACA_TUSDAddress,
  AR_TrancheMasterAddress,
  AR_WTFMasterAddress,
  AR_sALPACA_Address,
  AR_sVENUS_Address,
  BULL_BNB_TrancheMasterAddress,
  BULL_BNB_WTFMasterAddress,
  USDT_Address,
  BULL_BUSDBNB_sALPACA_Address,
  BULL_USDTBNB_sALPACA_Address,
  BEAR_BNB_TrancheMasterAddress,
  BEAR_BNB_WTFMasterAddress,
  WBNB_Address,
  BEAR_BNBBUSD_sALPACA_Address,
  BEAR_BNBUSDT_sALPACA_Address
} from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
import { abi as MC_TranchesAbi } from "./abi/MC_TrancheMaster.json";
import { abi as AR_TranchesAbi } from "./abi/AR_TrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import { abi as AVAXTranchesAbi } from "./abi/AVAXTrancheMaster.json";
// import { abi as StrategyAbi } from "./abi/Strategy.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: "DAI Falls",
    isAvax: true,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: false,
    assets: ["DAI.e"],
    tokens: [],
    listingDate: "2022/2/28",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: DAIFallsTrancheMasterAddress[NETWORK],
    abi: AVAXTranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: DAIFallsMasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: DAI_E_DepositAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Benqi DAI.e",
        shares: 0.7,
        sAddress: DAIBenqiStrategyAddress[NETWORK],
        apiKey: "qi_dai"
      },
      {
        farmName: "Trader Joe DAI.e",
        shares: 0.3,
        sAddress: DAITraderJoeStrategyAddress[NETWORK],
        apiKey: "joe_dai_e"
      }
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/qiJoe_dai",
    isRetired: false
  },
  {
    portfolio: "AVAX Falls",
    isAvax: true,
    wrapAvax: true,
    autorollImplemented: false,
    isMulticurrency: false,
    assets: ["WAVAX"],
    tokens: [],
    listingDate: "2022/2/28",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: WAVAXFallsTrancheMasterAddress[NETWORK],
    abi: AVAXTranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: WAVAXFallsMasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: WAVAXDepositAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Benqi AVAX",
        shares: 0.5,
        sAddress: WAVAXBenqiStrategyAddress[NETWORK],
        apiKey: "qi_avax"
      },
      {
        farmName: "Trader Joe AVAX",
        shares: 0.5,
        sAddress: WAVAXTraderJoeStrategyAddress[NETWORK],
        apiKey: "joe_avax"
      }
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/qiJoe_avax",
    isRetired: false
  },
  {
    portfolio: "MAXI Falls",
    isAvax: true,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: false,
    assets: ["DAI.e"],
    tokens: [],
    listingDate: "2022/2/28",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: MAXIFallsTrancheMasterAddress[NETWORK],
    abi: AVAXTranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MAXIFallsMasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: DAI_E_DepositAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Benqi DAI.e",
        shares: 0.7,
        sAddress: MAXIBenqiStrategyAddress[NETWORK],
        apiKey: "qi_avax"
      },
      {
        farmName: "Trader Joe DAI.e",
        shares: 0.25,
        sAddress: MAXITraderJoeStrategyAddress[NETWORK],
        apiKey: "joe_avax"
      },
      {
        farmName: "Maximizer",
        shares: 0.05,
        sAddress: MAXIMaximizerStrategyAddress[NETWORK],
        apiKey: "maximizer"
      }
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/maxiQiJoe_dai",
    isRetired: false
  },
  {
    portfolio: "Multicurrency 2 (Updated)",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: true,
    assets: ["BUSD", "TUSD"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/03/18",
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
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
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
    portfolio: "BNB Bull Falls Test",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: true,
    assets: ["BUSD", "USDT"],
    tokens: [],
    listingDate: "2022/03/15",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: BULL_BNB_TrancheMasterAddress[NETWORK],
    abi: MC_TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: BULL_BNB_WTFMasterAddress[NETWORK],
    pools: [],
    depositAssetAddress: "",
    depositAssetAddresses: [BUSDAddress[NETWORK], USDT_Address[NETWORK]],
    depositAssetAbi: WTFAbi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD:BNB",
        shares: 0.5,
        sAddress: BULL_BUSDBNB_sALPACA_Address[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Alpaca USDT:BNB",
        shares: 0.5,
        sAddress: BULL_USDTBNB_sALPACA_Address[NETWORK],
        apiKey: "venus"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-alpaca-bull"
  },
  {
    portfolio: "BNB Bear Falls Test",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: false,
    assets: ["WBNB"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/03/15",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: BEAR_BNB_TrancheMasterAddress[NETWORK],
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: BEAR_BNB_WTFMasterAddress[NETWORK],
    pools: [],
    depositAssetAddress: WBNB_Address[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BNB:BUSD",
        shares: 0.5,
        sAddress: BEAR_BNBBUSD_sALPACA_Address[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Alpaca BNB:USDT",
        shares: 0.5,
        sAddress: BEAR_BNBUSDT_sALPACA_Address[NETWORK],
        apiKey: "venus"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-alpaca-bear"
  }
];
