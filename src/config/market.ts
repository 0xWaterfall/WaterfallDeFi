import {
  DAIFallsTrancheMasterAddress,
  DAIFallsMasterWTFAddress,
  DAI_E_DepositAddress,
  DAITraderJoeStrategyAddress,
  DAIMaximiserStrategyAddress,
  WAVAXFallsTrancheMasterAddress,
  WAVAXFallsMasterWTFAddress,
  WAVAXDepositAddress,
  WAVAXTraderJoeStrategyAddress,
  WAVAXBenqiStrategyAddress
} from "./address";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import { abi as AVAXTranchesAbi } from "./abi/AVAXTrancheMaster.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: "DAI Falls (Test)",
    assets: "DAI.e",
    isAvax: true,
    wrapAvax: false,
    listingDate: "2021/2/11",
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
        farmName: "Trader Joe",
        shares: 0.8,
        sAddress: DAITraderJoeStrategyAddress[NETWORK],
        apiKey: "joe_dai"
      },
      {
        farmName: "Maximizer",
        shares: 0.2,
        sAddress: DAIMaximiserStrategyAddress[NETWORK],
        apiKey: "maximizer" //double check
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2",
    isRetired: false
  },
  {
    portfolio: "WAVAX Falls (Test)",
    assets: "WAVAX",
    isAvax: true,
    wrapAvax: true,
    listingDate: "2021/2/11",
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
        farmName: "Trader Joe",
        shares: 0.5,
        sAddress: WAVAXTraderJoeStrategyAddress[NETWORK],
        apiKey: "joe_avax"
      },
      {
        farmName: "Benqi",
        shares: 0.5,
        sAddress: WAVAXBenqiStrategyAddress[NETWORK],
        apiKey: "qi_avax"
      }
    ],
    subgraphURL: "http://18.118.169.63:8000/subgraphs/name/waterfall/benqi-joe-avaxfall/graphql",
    isRetired: false
  }
];
