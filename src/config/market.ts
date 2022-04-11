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
  // MAXIFallsTrancheMasterAddress,
  // MAXIFallsMasterWTFAddress,
  // MAXITraderJoeStrategyAddress,
  // MAXIBenqiStrategyAddress,
  // MAXIMaximizerStrategyAddress,
  BUSDAddress,
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
  BUSD4_VenusStrat,
  AR_AVAXFallsTrancheMasterAddress,
  AR_AVAXFallsMasterWTFAddress,
  AR_AVAXDepositAddress,
  AR_AVAXBenqiStrategyAddress,
  AR_AVAXTraderJoeStrategyAddress,
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
  DAIFallsTrancheMasterAddress2,
  DAIFallsMasterWTFAddress2,
  DAIBenqiStrategyAddress2,
  DAITraderJoeStrategyAddress2,
  WAVAXFallsTrancheMasterAddress2,
  WAVAXFallsMasterWTFAddress2,
  WAVAXBenqiStrategyAddress2,
  WAVAXTraderJoeStrategyAddress2,
  MAXIFallsTrancheMasterAddress2,
  MAXIFallsMasterWTFAddress2,
  MAXIBenqiStrategyAddress2,
  MAXITraderJoeStrategyAddress2,
  MAXIMaximizerStrategyAddress2,
  STG_TrancheMasterAddress,
  STG_MasterWTFAddress,
  STG_TraderJoeStrategyAddress,
  STG_StargateStrategyAddress,
  USDCAddress
} from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
//we will need this
import { abi as MC_TranchesAbi } from "./abi/MC_TrancheMaster.json";
import { abi as AR_TranchesAbi } from "./abi/AR_TrancheMaster.json";
import { abi as AR_AVAXTrancheMasterAbi } from "./abi/AR_AVAXTrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import { abi as AVAXTranchesAbi } from "./abi/AVAXTrancheMaster.json";
import AVAXTrancheMasterAutorollABI from "./abi/AVAXTrancheMasterAutoroll.json";
// import { abi as StrategyAbi } from "./abi/Strategy.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: "DAI Falls (Autorolled)",
    isAvax: true,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["DAI.e"],
    tokens: [],
    listingDate: "2022/2/28",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: DAIFallsTrancheMasterAddress2[NETWORK],
    abi: AVAXTrancheMasterAutorollABI,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: DAIFallsMasterWTFAddress2[NETWORK],
    pools: [],
    depositAssetAddress: DAI_E_DepositAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Benqi DAI.e",
        shares: 0.91,
        sAddress: DAIBenqiStrategyAddress2[NETWORK],
        apiKey: "qi_dai"
      },
      {
        farmName: "Trader Joe DAI.e",
        shares: 0.09,
        sAddress: DAITraderJoeStrategyAddress2[NETWORK],
        apiKey: "joe_dai_e"
      }
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/qiJoe_dai",
    isRetired: false
  },
  {
    portfolio: "AVAX Falls (Autorolled)",
    isAvax: true,
    wrapAvax: true,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["WAVAX"],
    tokens: [],
    listingDate: "2022/2/28",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: WAVAXFallsTrancheMasterAddress2[NETWORK],
    abi: AVAXTrancheMasterAutorollABI,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: WAVAXFallsMasterWTFAddress2[NETWORK],
    pools: [],
    depositAssetAddress: WAVAXDepositAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Benqi AVAX",
        shares: 0.7,
        sAddress: WAVAXBenqiStrategyAddress2[NETWORK],
        apiKey: "qi_avax"
      },
      {
        farmName: "Trader Joe AVAX",
        shares: 0.3,
        sAddress: WAVAXTraderJoeStrategyAddress2[NETWORK],
        apiKey: "joe_avax"
      }
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/qiJoe_avax",
    isRetired: false
  },
  {
    portfolio: "MAXI Falls (Autorolled)",
    isAvax: true,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["DAI.e"],
    tokens: [],
    listingDate: "2022/2/28",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: MAXIFallsTrancheMasterAddress2[NETWORK],
    abi: AVAXTrancheMasterAutorollABI,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: MAXIFallsMasterWTFAddress2[NETWORK],
    pools: [],
    depositAssetAddress: DAI_E_DepositAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Benqi DAI.e",
        shares: 0.33,
        sAddress: MAXIBenqiStrategyAddress2[NETWORK],
        apiKey: "qi_dai"
      },
      {
        farmName: "Trader Joe DAI.e",
        shares: 0.33,
        sAddress: MAXITraderJoeStrategyAddress2[NETWORK],
        apiKey: "joe_dai_e"
      },
      {
        farmName: "Maximizer",
        shares: 0.33,
        sAddress: MAXIMaximizerStrategyAddress2[NETWORK],
        apiKey: "maximizer"
      }
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/maxiQiJoe_dai",
    isRetired: false
  },
  {
    portfolio: "DAI Falls (Retired)",
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
    isRetired: true
  },
  {
    portfolio: "AVAX Falls (Retired)",
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
    isRetired: true
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls4",
    isRetired: true
  },
  {
    portfolio: "Stargate Falls (Autorolled) TEST",
    isAvax: true,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["USDC"],
    tokens: [],
    listingDate: "2022/4/08",
    tranches: [],
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: STG_TrancheMasterAddress[NETWORK],
    abi: AR_AVAXTrancheMasterAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: STG_MasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: USDCAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Trader Joe AVAX",
        shares: 0.5,
        sAddress: STG_TraderJoeStrategyAddress[NETWORK],
        apiKey: "joe_avax"
      },
      {
        farmName: "Stargate",
        shares: 0.5,
        sAddress: STG_StargateStrategyAddress[NETWORK],
        apiKey: "stargate"
      }
    ],
    subgraphURL: "https://apitest.waterfalldefi.org/subgraphs/name/waterfall/avax_test_joeStarUsdc",
    isRetired: false
  }

  // {
  //   portfolio: "BUSD Falls 1 (Expired)",
  //   isAvax: false,
  //   wrapAvax: false,
  //   autorollImplemented: false,
  //   isMulticurrency: false,
  //   assets: ["BUSD"],
  //   tokens: [],
  //   listingDate: "2022/01/16",
  //   tranches: [],
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: TranchesAddressOracle1[NETWORK],
  //   abi: TranchesAbi,
  //   masterChefAbi: MasterChefAbi,
  //   masterChefAddress: MasterChefOracleAddress1[NETWORK],
  //   pools: [],
  //   depositAssetAddress: BUSDAddress[NETWORK],
  //   depositAssetAddresses: [],
  //   depositAssetAbi: WTFAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "Alpaca BUSD",
  //       shares: 0.8,
  //       sAddress: sALPACAAddress[NETWORK],
  //       apiKey: "alpaca"
  //     },
  //     {
  //       farmName: "Venus BUSD",
  //       shares: 0.2,
  //       sAddress: sVENUSAddress[NETWORK],
  //       apiKey: "venus"
  //     }
  //   ],
  //   subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls1new",
  //   isRetired: true
  // },
  // {
  //   portfolio: "BUSD Falls 2 (Expired)",
  //   isAvax: false,
  //   wrapAvax: false,
  //   autorollImplemented: false,
  //   isMulticurrency: false,
  //   assets: ["BUSD"],
  //   listingDate: "2022/01/17",
  //   tranches: [],
  //   tokens: [],
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: TranchesAddressOracle2[NETWORK],
  //   abi: TranchesAbi,
  //   masterChefAbi: MasterChefAbi,
  //   masterChefAddress: MasterChefOracleAddress2[NETWORK],
  //   pools: [],
  //   depositAssetAddress: BUSDAddress[NETWORK],
  //   depositAssetAddresses: [],
  //   depositAssetAbi: WTFAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "Alpaca BUSD",
  //       shares: 0.8,
  //       sAddress: sALPACAAddress[NETWORK],
  //       apiKey: "alpaca"
  //     },
  //     {
  //       farmName: "Venus BUSD",
  //       shares: 0.2,
  //       sAddress: sVENUSAddress[NETWORK],
  //       apiKey: "venus"
  //     }
  //   ],
  //   subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2new",
  //   isRetired: true
  // },
  // {
  //   portfolio: "BUSD Falls 3 (Expired)",
  //   isAvax: false,
  //   wrapAvax: false,
  //   autorollImplemented: false,
  //   isMulticurrency: false,
  //   assets: ["BUSD"],
  //   tokens: [],
  //   listingDate: "2022/12/26",
  //   tranches: [],
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: TranchesAddress3[NETWORK],
  //   abi: TranchesAbi,
  //   masterChefAbi: MasterChefAbi,
  //   masterChefAddress: MasterChefAddress3[NETWORK],
  //   pools: [],
  //   depositAssetAddress: BUSDAddress[NETWORK],
  //   depositAssetAddresses: [],
  //   depositAssetAbi: WTFAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "Alpaca BUSD",
  //       shares: 0.7,
  //       sAddress: sALPACAAddress[NETWORK],
  //       apiKey: "alpaca"
  //     },
  //     {
  //       farmName: "Venus BUSD",
  //       shares: 0.3,
  //       sAddress: sVENUSAddress[NETWORK],
  //       apiKey: "venus"
  //     }
  //   ],
  //   subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls3",
  //   isRetired: true
  // }
  // {
  //   portfolio: "BNB Bull Falls Test",
  //   isAvax: false,
  //   wrapAvax: false,
  //   autorollImplemented: false,
  //   isMulticurrency: true,
  //   assets: ["BUSD", "USDT"],
  //   tokens: [],
  //   listingDate: "2022/03/15",
  //   tranches: [],
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: BULL_BNB_TrancheMasterAddress[NETWORK],
  //   abi: MC_TranchesAbi,
  //   masterChefAbi: MasterChefAbi,
  //   masterChefAddress: BULL_BNB_WTFMasterAddress[NETWORK],
  //   pools: [],
  //   depositAssetAddress: "",
  //   depositAssetAddresses: [BUSDAddress[NETWORK], USDT_Address[NETWORK]],
  //   depositAssetAbi: WTFAbi,
  //   // strategyAddress: StrategyAddress[NETWORK],
  //   // strategyAbi: StrategyAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "Alpaca BUSD:BNB",
  //       shares: 0.5,
  //       sAddress: BULL_BUSDBNB_sALPACA_Address[NETWORK],
  //       apiKey: "alpaca"
  //     },
  //     {
  //       farmName: "Alpaca USDT:BNB",
  //       shares: 0.5,
  //       sAddress: BULL_USDTBNB_sALPACA_Address[NETWORK],
  //       apiKey: "venus"
  //     }
  //   ],
  //   subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-alpaca-bull"
  // },
  // {
  //   portfolio: "BNB Bear Falls Test",
  //   isAvax: false,
  //   wrapAvax: false,
  //   autorollImplemented: false,
  //   isMulticurrency: false,
  //   assets: ["WBNB"], //changed to array for multicurrency
  //   tokens: [],
  //   listingDate: "2022/03/15",
  //   tranches: [],
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: BEAR_BNB_TrancheMasterAddress[NETWORK],
  //   abi: TranchesAbi,
  //   masterChefAbi: MasterChefAbi,
  //   masterChefAddress: BEAR_BNB_WTFMasterAddress[NETWORK],
  //   pools: [],
  //   depositAssetAddress: WBNB_Address[NETWORK],
  //   depositAssetAddresses: [],
  //   depositAssetAbi: WTFAbi,
  //   // strategyAddress: StrategyAddress[NETWORK],
  //   // strategyAbi: StrategyAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "Alpaca BNB:BUSD",
  //       shares: 0.5,
  //       sAddress: BEAR_BNBBUSD_sALPACA_Address[NETWORK],
  //       apiKey: "alpaca"
  //     },
  //     {
  //       farmName: "Alpaca BNB:USDT",
  //       shares: 0.5,
  //       sAddress: BEAR_BNBUSDT_sALPACA_Address[NETWORK],
  //       apiKey: "venus"
  //     }
  //   ],
  //   subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-alpaca-bear"
  // }
];
