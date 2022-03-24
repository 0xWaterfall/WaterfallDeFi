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
  MAXIMaximizerStrategyAddress
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
  }
];
