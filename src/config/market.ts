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
  TranchesAddressOracle1,
  MasterChefOracleAddress1,
  BUSDAddress,
  sALPACAAddress,
  sVENUSAddress,
  TranchesAddressOracle2,
  MasterChefOracleAddress2
} from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import { abi as AVAXTranchesAbi } from "./abi/AVAXTrancheMaster.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: "DAI Falls",
    assets: "DAI.e",
    isAvax: true,
    wrapAvax: false,
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
    assets: "WAVAX",
    isAvax: true,
    wrapAvax: true,
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
    assets: "DAI.e",
    isAvax: true,
    wrapAvax: false,
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
    portfolio: "BUSD Falls 1",
    isAvax: false,
    assets: "BUSD",
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls1new"
  },
  {
    portfolio: "BUSD Falls 2",
    isAvax: false,
    assets: "BUSD",
    listingDate: "2021/01/17",
    tranches: [],
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
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2new"
  }
];
