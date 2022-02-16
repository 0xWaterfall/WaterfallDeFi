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
  WAVAXBenqiStrategyAddress,
  TranchesAddress3,
  MasterChefAddress3,
  BUSDAddress,
  sALPACAAddress,
  sVENUSAddress
} from "./address";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import { abi as AVAXTranchesAbi } from "./abi/AVAXTrancheMaster.json";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: "DAI Falls (Test)",
    assets: "DAIE",
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
        apiKey: "joe"
      },
      {
        farmName: "Maximiser",
        shares: 0.2,
        sAddress: DAIMaximiserStrategyAddress[NETWORK],
        apiKey: "maximiser" //double check
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2",
    isRetired: true
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
        apiKey: "joe"
      },
      {
        farmName: "Benqi",
        shares: 0.5,
        sAddress: WAVAXBenqiStrategyAddress[NETWORK],
        apiKey: "benqi"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-busdfalls2",
    isRetired: true
  }
];
