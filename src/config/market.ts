import {
  DAI_E_DepositAddress,
  WAVAXDepositAddress,
  BUSDAddress,
  BUSD4_TrancheMaster,
  BUSD4_MasterWTF,
  BUSD4_AlpacaStrat,
  BUSD4_VenusStrat,
  BULL_BNB_TrancheMasterAddress,
  BULL_BNB_WTFMasterAddress,
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
  USDT_Address_BNB,
  BUSDTripleStratTrancheMasterAddress,
  BUSDTripleStratMasterWTFAddress,
  BUSDTriple_AlpacaStrategyAddress,
  BUSDTriple_VenusStrategyAddress,
  BUSDTriple_StargateStrategyAddress,
  StargateBenqi_TrancheMasterAddress,
  StargateBenqi_MasterWTFAddress,
  USDC_Address_AVAX,
  StargateBenqi_StargateStrategyAddress,
  StargateBenqi_BenqiStrategyAddress,
  BNB_Only_Falls_TrancheMasterAddress,
  BNB_Only_Falls_MasterWTFAddress,
  BNB_Only_Falls_AlpacaStrategyAddress,
  BNB_Only_Falls_VenusStrategyAddress
} from "./address";
import { abi as TranchesAbi } from "./abi/TrancheMaster.json";
//we will need this
import { abi as MC_TranchesAbi } from "./abi/MC_TrancheMaster.json";
import { abi as AR_TranchesAbi } from "./abi/AR_TrancheMaster.json";
import { abi as MasterChefAbi } from "./abi/MasterChef.json";
import { abi as WTFAbi } from "./abi/WTF.json";
import AVAXTrancheMasterAutorollABI from "./abi/AVAXTrancheMasterAutoroll.json";
import { Market } from "types";
import { NETWORK } from "config";
export const MarketList: Market[] = [
  {
    portfolio: "(New) BNB Falls",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["WBNB"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/07/21",
    tranches: [],
    trancheCount: 3,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: BNB_Only_Falls_TrancheMasterAddress[NETWORK],
    abi: AR_TranchesAbi, //tranches has autoPrincipal even though autoroll not enabled, so must use autoroll ABI
    masterChefAbi: MasterChefAbi,
    masterChefAddress: BNB_Only_Falls_MasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: WBNB_Address[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BNB",
        shares: 0.7,
        sAddress: BNB_Only_Falls_AlpacaStrategyAddress[NETWORK],
        apiKey: "alpaca_bnb"
      },
      {
        farmName: "Venus BNB",
        shares: 0.3,
        sAddress: BNB_Only_Falls_VenusStrategyAddress[NETWORK],
        apiKey: "venus_bnb"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/bsc-alpVeBnb"
  },
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
    trancheCount: 3,
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
    trancheCount: 3,
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
    portfolio: "BUSD Falls (Autorolled)",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["BUSD"],
    tokens: [],
    listingDate: "2022/3/25",
    tranches: [],
    trancheCount: 3,
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
    isRetired: false
  },
  {
    portfolio: "BUSD Falls (Autorolled) 2",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["BUSD"],
    tokens: [],
    listingDate: "2022/4/25",
    tranches: [],
    trancheCount: 3,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: BUSDTripleStratTrancheMasterAddress[NETWORK],
    abi: AR_TranchesAbi,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: BUSDTripleStratMasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD",
        shares: 0.35,
        sAddress: BUSDTriple_AlpacaStrategyAddress[NETWORK],
        apiKey: "alpaca"
      },
      {
        farmName: "Venus BUSD",
        shares: 0.15,
        sAddress: BUSDTriple_VenusStrategyAddress[NETWORK],
        apiKey: "venus"
      },
      {
        farmName: "Stargate BUSD",
        shares: 0.5,
        sAddress: BUSDTriple_StargateStrategyAddress[NETWORK],
        apiKey: "stargate_bnb_busd"
      }
    ],
    subgraphURL: "https://apitest2.waterfalldefi.org/subgraphs/name/waterfall/bsc_test_alpVeStar",
    isRetired: false
  },
  {
    portfolio: "USDC Falls",
    isAvax: true,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["USDC"],
    tokens: [],
    listingDate: "2022/5/20",
    tranches: [],
    trancheCount: 3,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: StargateBenqi_TrancheMasterAddress[NETWORK],
    abi: AVAXTrancheMasterAutorollABI,
    masterChefAbi: MasterChefAbi,
    masterChefAddress: StargateBenqi_MasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: USDC_Address_AVAX[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTFAbi,
    strategyFarms: [
      {
        farmName: "Stargate USDC",
        shares: 0.7,
        sAddress: StargateBenqi_StargateStrategyAddress[NETWORK],
        apiKey: "stargate_avax_usdc"
      },
      {
        farmName: "Benqi USDC",
        shares: 0.3,
        sAddress: StargateBenqi_BenqiStrategyAddress[NETWORK],
        apiKey: "qi_usdc"
      }
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/qiStarUsdc",
    isRetired: false
  },
  {
    portfolio: "BNB Bull Falls",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: true,
    assets: ["BUSD", "USDT"],
    tokens: [],
    listingDate: "2022/04/20",
    tranches: [],
    trancheCount: 2,
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
    depositAssetAddresses: [BUSDAddress[NETWORK], USDT_Address_BNB[NETWORK]],
    depositAssetAbi: WTFAbi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD:BNB",
        shares: 0.5,
        sAddress: BULL_BUSDBNB_sALPACA_Address[NETWORK],
        apiKey: "alpaca_pcs_bnb_busd"
      },
      {
        farmName: "Alpaca USDT:BNB",
        shares: 0.5,
        sAddress: BULL_USDTBNB_sALPACA_Address[NETWORK],
        apiKey: "alpaca_pcs_usdt_bnb"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/alpaca-bull-prod"
  },
  {
    portfolio: "BNB Bear Falls",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: false,
    isMulticurrency: false,
    assets: ["WBNB"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/04/20",
    tranches: [],
    trancheCount: 2,
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
        apiKey: "alpaca_pcs_bnb_busd"
      },
      {
        farmName: "Alpaca BNB:USDT",
        shares: 0.5,
        sAddress: BEAR_BNBUSDT_sALPACA_Address[NETWORK],
        apiKey: "alpaca_pcs_usdt_bnb"
      }
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/alpaca-bear-prod"
  }
  // {
  //   portfolio: "USDC.e Falls",
  //   isAvax: true,
  //   wrapAvax: false,
  //   autorollImplemented: true,
  //   isMulticurrency: false,
  //   assets: ["USDC.e"],
  //   tokens: [],
  //   listingDate: "2022/06/01",
  //   tranches: [],
  //   trancheCount: 3,
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: USDC_Falls_TrancheMasterAddress[NETWORK],
  //   abi: AR_TranchesAbi,
  //   masterChefAbi: MasterChefAbi,
  //   masterChefAddress: USDC_Falls_MasterWTFAddress[NETWORK],
  //   pools: [],
  //   depositAssetAddress: USDC_Bridged_Address_AVAX[NETWORK],
  //   depositAssetAddresses: [],
  //   depositAssetAbi: WTFAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "USDC.e Echidna",
  //       shares: 0.34,
  //       sAddress: USDC_Falls_EchidnaStrategyAddress[NETWORK],
  //       apiKey: "echidna_usdce"
  //     },
  //     {
  //       farmName: "USDC.e Benqi",
  //       shares: 0.33,
  //       sAddress: USDC_Falls_BenqiStrategyAddress[NETWORK],
  //       apiKey: "qi_usdce"
  //     },
  //     {
  //       farmName: "USDC.e Trader Joe",
  //       shares: 0.33,
  //       sAddress: USDC_Falls_TraderJoeStrategyAddress[NETWORK],
  //       apiKey: "joe_usdce"
  //     }
  //   ],
  //   subgraphURL: "https://apitest.waterfalldefi.org/subgraphs/name/waterfall/avax_test_qiJoeEchiUsdce"
  // },
];
