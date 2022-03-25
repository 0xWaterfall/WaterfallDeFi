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
  BEAR_BNBUSDT_sALPACA_Address,
  TranchesAddressOracle1,
  MasterChefOracleAddress1,
  sALPACAAddress,
  sVENUSAddress,
  TranchesAddressOracle2,
  MasterChefOracleAddress2,
  MasterChefAddress3,
  TranchesAddress3,
  BUSD4_TrancheMaster,
  BUSD4_MasterWTF,
  BUSD4_AlpacaStrat,
  BUSD4_VenusStrat
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
    portfolio: "BUSD Falls (Autorolled)",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["BUSD"],
    tokens: [],
    listingDate: "2022/3/25",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: BUSD4_TrancheMaster[NETWORK],
    abi: AR_TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: BUSD4_MasterWTF[NETWORK],
    pools: [],
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD",
        shares: 0.5,
        sAddress: BUSD4_AlpacaStrat[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Venus BUSD",
        shares: 0.5,
        sAddress: BUSD4_VenusStrat[NETWORK],
        apiKey: "venus"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls4"
  },
  {
    portfolio: "BUSD Falls 1 (Expired)",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: false,
    assets: ["BUSD"],
    tokens: [],
    listingDate: "2022/01/16",
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls1new",
    isRetired: true
  },
  {
    portfolio: "BUSD Falls 2 (Expired)",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: false,
    assets: ["BUSD"],
    listingDate: "2022/01/17",
    tranches: [],
    tokens: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: TranchesAddressOracle2[NETWORK],
    abi: TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MasterChefOracleAddress2[NETWORK],
    pools: [],
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2new",
    isRetired: true
  },

  {
    portfolio: "BUSD Falls 3 (Expired)",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: false,
    assets: ["BUSD"],
    tokens: [],
    listingDate: "2022/12/26",
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls3",
    isRetired: true
  }
];
