import { MasterChefAddress, TranchesAddress, MulticallAddress, AllTranches } from "config/address";
import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import { Market, PORTFOLIO_STATUS, Token } from "types";
import { formatBalance, getPortfolioTvl, getPortfolioTotalTarget } from "utils/formatNumbers";
import getRpcUrl, { getBscRpcUrl } from "utils/getRpcUrl";
import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { abi as ERC20Abi } from "config/abi/WTF.json";
import BigNumber from "bignumber.js";
import { BIG_ZERO, BIG_TEN } from "utils/bigNumber";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import MultiCallAbi from "config/abi/Multicall.json";
import { abi as SingleStrategyTokenAbi } from "config/abi/SingleStrategyToken.json";
import { useMarkets, useNetwork } from "./useSelectors";
import { NETWORK } from "config";
import useRefresh from "./useRefresh";
import multicall, { multicallBSC, multicallNetwork } from "utils/multicall";
import numeral from "numeral";
import {
  useAVAXTrancheMasterContract,
  useTrancheMasterContract,
  useMulticurrencyTrancheMasterContract
} from "./useContract";
import { setPendingWTFReward } from "store/position";
import markets from "store/markets";
import { MarketList } from "config/market";
import useActiveWeb3React from "./useActiveWeb3React";
import { stringify } from "querystring";
import axios from "axios";

export const useMarket = async (marketData: Market) => {
  if (!Web3.givenProvider) return;
  const web3 = new Web3(Web3.givenProvider);
  const contractTranches = new web3.eth.Contract(marketData.abi as AbiItem[], marketData.address);
  const contractMasterChef = new web3.eth.Contract(marketData.masterChefAbi as AbiItem[], marketData.masterChefAddress);

  if (contractTranches) {
    const _tranches = await Promise.all([
      contractTranches.methods.tranches(0).call(),
      contractTranches.methods.tranches(1).call(),
      contractTranches.methods.tranches(2).call()
    ]);

    const active = await contractTranches.methods.active().call();
    marketData.status = active ? PORTFOLIO_STATUS.ACTIVE : PORTFOLIO_STATUS.PENDING;

    const duration = await contractTranches.methods.duration().call();
    marketData.duration = duration;

    const actualStartAt = await contractTranches.methods.actualStartAt().call();
    marketData.actualStartAt = actualStartAt;

    const cycle = await contractTranches.methods.cycle().call();
    marketData.cycle = cycle;

    marketData.tranches = _tranches;
    marketData.totalTranchesTarget = getPortfolioTotalTarget(_tranches);
    marketData.tvl = getPortfolioTvl(_tranches);
  }
  if (contractMasterChef) {
    const _poolInfos = await Promise.all([
      contractMasterChef.methods.poolInfo(0).call(),
      contractMasterChef.methods.poolInfo(1).call(),
      contractMasterChef.methods.poolInfo(2).call()
    ]);
    marketData.pools = _poolInfos;
    // marketData.totalAllocPoints = getTotalAllocPoints(_poolInfos) + "";
  }

  return marketData;
};
// export const useStrategyFarm = () => {
//   const [result, setResult] = useState<any>([]);

//   const getFarmResult = (shares: BigNumber, addr: string) => {
//     return {
//       shares: new BigNumber(shares.toString()).dividedBy(BIG_TEN.pow(16)).toNumber().toFixed(0),
//       farmName: farmsConfig[addr]
//     };
//   };
//   useEffect(() => {
//     const fetchFarms = async () => {
//       if (!mBUSDAddress[NETWORK]) return;
//       const farms = [sALPACAAddress[NETWORK], sVENUSAddress[NETWORK], sCREAMAddress[NETWORK]];
//       const calls = [
//         {
//           address: sALPACAAddress[NETWORK],
//           name: "balanceOf",
//           params: [mBUSDAddress[NETWORK]]
//         },
//         {
//           address: sVENUSAddress[NETWORK],
//           name: "balanceOf",
//           params: [mBUSDAddress[NETWORK]]
//         },
//         {
//           address: sCREAMAddress[NETWORK],
//           name: "balanceOf",
//           params: [mBUSDAddress[NETWORK]]
//         }
//       ];

//       const result = await multicall(SingleStrategyTokenAbi, calls);
//       const _result = [];
//       let total = BIG_ZERO;
//       for (let i = 0; i < result.length; i++) {
//         const f = result[i];
//         total = new BigNumber(total).plus(new BigNumber(f[0]._hex));
//       }
//       for (let i = 0; i < result.length; i++) {
//         const f = result[i];
//         const percentage = new BigNumber(f[0]._hex).dividedBy(new BigNumber(total)).times(BIG_TEN.pow(18));
//         if (f) _result.push(getFarmResult(percentage, farms[i]));
//       }
//       setResult(_result);

//       // try {
//       //   const farm0 = await contractStrategy.farms(0);
//       //   if (farm0) _result.push(getFarmResult(farm0.shares, farm0.addr));
//       //   const farm1 = await contractStrategy.farms(1);
//       //   if (farm1) _result.push(getFarmResult(farm1.shares, farm1.addr));
//       //   const farm2 = await contractStrategy.farms(2);
//       //   if (farm2) _result.push(getFarmResult(farm2.shares, farm2.addr));
//       //   setResult(_result);
//       //   console.log(_result);
//       // } catch (e) {
//       //   console.error(e);
//       // }
//     };

//     fetchFarms();
//   }, []);

//   return result;
// };
export const useTrancheBalance = (trancheMasterAddress: string, isAvax: boolean) => {
  // const [balance, setBalance] = useState(BIG_ZERO);
  // const [invested, setInvested] = useState(BIG_ZERO);
  const [result, setResult] = useState({
    balance: "",
    MCbalance: null,
    invested: ""
  });
  const { account } = useWeb3React<Web3Provider>();

  const { fastRefresh } = useRefresh();
  const trancheMasterContract = !isAvax
    ? useTrancheMasterContract(trancheMasterAddress)
    : useAVAXTrancheMasterContract(trancheMasterAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await trancheMasterContract.balanceOf(account);

        setResult({
          balance: result.balance ? new BigNumber(result.balance?._hex).dividedBy(BIG_TEN.pow(18)).toString() : "0",
          MCbalance: null,
          invested: result.invested ? new BigNumber(result.invested?._hex).dividedBy(BIG_TEN.pow(18)).toString() : "0"
        });
      } catch (e) {
        console.error(e);
      }
    };
    if (account) fetchBalance();
  }, [fastRefresh, account]);

  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     if (!account) return;
  //     const contractMasterChef = getContract(TrancheMasterAbi, TranchesAddress[NETWORK]);
  //     const result = await contractMasterChef.balanceOf(account);
  //     setBalance(result.balance ? new BigNumber(result.balance?._hex) : BIG_ZERO);
  //     setInvested(result.invested);
  //   };

  //   fetchBalance();
  // }, [account]);

  return result;
};

export const useMulticurrencyTrancheBalance = (
  trancheMasterAddress: string,
  currencyIdx: number,
  tokenCount: number
) => {
  const preloadedArray: string[] = [];
  for (let index = 0; index < tokenCount; index++) {
    preloadedArray.push("");
  }
  const [result, setResult] = useState<{ balance: string; MCbalance: string[]; invested: string[] }>({
    balance: preloadedArray[0],
    MCbalance: preloadedArray,
    invested: preloadedArray
  });
  const { account } = useWeb3React<Web3Provider>();
  const { fastRefresh } = useRefresh();
  const trancheMasterContract = useMulticurrencyTrancheMasterContract(trancheMasterAddress);
  const fetchBalance = async () => {
    try {
      //interface is not named right now, but if you look at the code, the first array are the balances, the second array are the invests
      const balanceOf = await trancheMasterContract.balanceOf(account);

      setResult({
        balance: balanceOf[0].map((b: any) => new BigNumber(b._hex).dividedBy(BIG_TEN.pow(18)).toString())[currencyIdx],
        MCbalance: balanceOf[0].map((b: any) => b._hex),
        invested: balanceOf[1].map((b: any) => new BigNumber(b._hex).dividedBy(BIG_TEN.pow(18)).toString())
      });
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (account) fetchBalance();
  }, [fastRefresh, account]);

  return {
    balance: result.balance,
    MCbalance: result.MCbalance,
    fetchBalance: fetchBalance,
    invested: result.invested[currencyIdx]
  };
};

export const useAllMulticurrencyTrancheBalance = (trancheMasterAddress: string, tokenCount: number) => {
  const preloadedArray = [];
  for (let index = 0; index < tokenCount; index++) {
    preloadedArray.push("");
  }
  const [result, setResult] = useState<{ balance: string[]; invested: string[] }>({
    balance: preloadedArray,
    invested: preloadedArray
  });
  const { account } = useWeb3React<Web3Provider>();
  const { fastRefresh } = useRefresh();
  const trancheMasterContract = useMulticurrencyTrancheMasterContract(trancheMasterAddress);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        //interface is not named right now, but if you look at the code, the first array are the balances, the second array are the invests
        const balanceOf = await trancheMasterContract.balanceOf(account);
        setResult({
          balance: balanceOf[0].map((b: any) => new BigNumber(b._hex).dividedBy(BIG_TEN.pow(18)).toString()),
          invested: balanceOf[1].map((b: any) => new BigNumber(b._hex).dividedBy(BIG_TEN.pow(18)).toString())
        });
      } catch (e) {
        console.error(e);
      }
    };
    if (account) fetchBalance();
  }, [fastRefresh, account]);
  return {
    balance: result.balance,
    invested: result.invested
  };
};

//UNUSED
// export const useTrancheSnapshot = (cycle: string | undefined, network: Network) => {
//   const [trancheSnapshot, setTrancheSnapshot] = useState([]);

//   useEffect(() => {
//     const getTrancheSnapshot = async () => {
//       if (!cycle || cycle === "0") return;
//       cycle = (Number(cycle) - 1).toString();
//       // const contractTrancheMaster = getContract(TrancheMasterAbi, TranchesAddress[NETWORK]);
//       // console.log(contractTrancheMaster);
//       // const result = await contractTrancheMaster.trancheSnapshots(cycle, 1);

//       const _address = TranchesAddress[NETWORK];
//       const calls = [
//         {
//           address: _address,
//           name: "trancheSnapshots",
//           params: [cycle, 0]
//         },
//         {
//           address: _address,
//           name: "trancheSnapshots",
//           params: [cycle, 1]
//         },
//         {
//           address: _address,
//           name: "trancheSnapshots",
//           params: [cycle, 2]
//         }
//       ];
//       const result = await multicall(TrancheMasterAbi, calls);
//       setTrancheSnapshot(result);
//     };

export const usePositions = (marketId: string | undefined) => {
  const { account } = useWeb3React<Web3Provider>();
  const { slowRefresh } = useRefresh();
  const [result, setResult] = useState<any>([]);
  useEffect(() => {
    const fetchBalance = async () => {
      const _result = [];
      for (let i = 0; i < MarketList.length; i++) {
        if (marketId && parseInt(marketId) !== i) continue;
        const calls = !MarketList[i].isMulticurrency
          ? [
              {
                address: MarketList[i].address,
                name: "userInvest",
                params: [account, 0]
              },
              {
                address: MarketList[i].address,
                name: "userInvest",
                params: [account, 1]
              },
              {
                address: MarketList[i].address,
                name: "userInvest",
                params: [account, 2]
              }
            ]
          : [];
        if (MarketList[i].isMulticurrency) {
          calls.push({
            address: MarketList[i].address,
            name: "userCycle",
            params: [account]
          });
          MarketList[i].depositAssetAddresses.forEach((a) => {
            calls.push(
              {
                address: MarketList[i].address,
                name: "userInvest",
                params: [account, 0, a]
              },
              {
                address: MarketList[i].address,
                name: "userInvest",
                params: [account, 1, a]
              },
              {
                address: MarketList[i].address,
                name: "userInvest",
                params: [account, 2, a]
              }
            );
          });
        }
        const userInvest = MarketList[i].isAvax
          ? await multicall(MarketList[i].abi, calls)
          : await multicallBSC(MarketList[i].abi, calls);
        // _result.push(userInvest);
        _result[i] = userInvest;
      }

      setResult(_result);
    };
    if (account) fetchBalance();
  }, [slowRefresh, account]);

  return result;
};
export const usePendingWTFReward = (masterChefAddress: string) => {
  const { account } = useWeb3React<Web3Provider>();
  const [totalPendingReward, setTotalPendingReward] = useState("0");
  const [tranchesPendingReward, setTranchesPendingReward] = useState<string[]>([]);
  const { slowRefresh } = useRefresh();
  const network = useNetwork();

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: masterChefAddress,
          name: "pendingReward",
          params: [account, 0]
        },
        {
          address: masterChefAddress,
          name: "pendingReward",
          params: [account, 1]
        },
        {
          address: masterChefAddress,
          name: "pendingReward",
          params: [account, 2]
        }
      ];
      const result =
        network === "avax" ? await multicall(MasterChefAbi, calls) : await multicallBSC(MasterChefAbi, calls);
      let _pendingReward = new BigNumber(0);
      const _tranchesPendingReward = [];
      for (let i = 0; i < result.length; i++) {
        _pendingReward = _pendingReward.plus(new BigNumber(result[i][0]?._hex));
        _tranchesPendingReward.push(new BigNumber(result[i][0]?._hex).toString());
      }
      setTotalPendingReward(_pendingReward.toString());
      setTranchesPendingReward(_tranchesPendingReward);
    };
    if (account) fetchBalance();
  }, [masterChefAddress, slowRefresh, account, network]);

  return { totalPendingReward, tranchesPendingReward };
};
// export const usePendingWTFReward = (poolId?: number) => {
//   const [pendingReward, setPendingReward] = useState(BIG_ZERO);
//   const { account } = useWeb3React<Web3Provider>();
//   const allPool = poolId == undefined ? true : false;
//   useEffect(() => {
//     const fetchPendingReward = async () => {
//       try {
//         if (!account) return;
//         const contractMasterChef = getContract(MasterChefAbi, MasterChefAddress[NETWORK]);
//         let _pendingReward = new BigNumber(0);

//         if (poolId == 0 || allPool) {
//           const pendingReward0 = await contractMasterChef.pendingReward(account, 0);
//           if (!pendingReward0.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward0.toString()));
//         }
//         if (poolId == 1 || allPool) {
//           const pendingReward1 = await contractMasterChef.pendingReward(account, 1);
//           if (!pendingReward1.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward1.toString()));
//         }
//         if (poolId == 2 || allPool) {
//           const pendingReward2 = await contractMasterChef.pendingReward(account, 2);
//           if (!pendingReward2.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward2.toString()));
//         }

//         if (!_pendingReward.isZero()) setPendingReward(_pendingReward);
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     fetchPendingReward();
//   }, [account]);

//   return pendingReward;
// };
export const useTotalSupply = (address: string) => {
  const [totalSupply, setTotalSupply] = useState("0");
  const { account } = useWeb3React<Web3Provider>();
  const { fastRefresh } = useRefresh();
  const network = useNetwork();

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const signer = getSigner();
    const contract = getContract2(ERC20Abi, address, network, signer);
    const tokenBalance = await contract.totalSupply();
    const value = formatBalance(tokenBalance.toString());
    setTotalSupply(numeral(value).format("0,0.[0000]"));
  }, [account]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, address, fastRefresh]);

  return totalSupply;
};
export const useBalanceOfOtherAddress = (address: string, account: string) => {
  const [balance, setBalance] = useState("0");
  const [actualBalance, setActualBalance] = useState("0");
  const { slowRefresh, fastRefresh } = useRefresh();
  const network = useNetwork();

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const signer = getSigner();
    const contract = getContract2(ERC20Abi, address, network, signer);
    const tokenBalance = await contract.balanceOf(account);
    const value = new BigNumber(tokenBalance.toString()).dividedBy(BIG_TEN.pow(18));
    setBalance(numeral(value.toString()).format("0,0.[0000]"));
    setActualBalance(value.toString());
  }, [account]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, address, fastRefresh]);

  return { balance, actualBalance, fetchBalance };
};
export const useBalance = (address: string) => {
  const [balance, setBalance] = useState("0");
  const [actualBalance, setActualBalance] = useState("0");
  const { account, ...p } = useWeb3React<Web3Provider>();
  const { slowRefresh, fastRefresh } = useRefresh();
  const network = useNetwork();

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const signer = getSigner();
    const contract = getContract2(ERC20Abi, address, network, signer);
    const tokenBalance = await contract.balanceOf(account);
    const value = new BigNumber(tokenBalance.toString()).dividedBy(BIG_TEN.pow(18));
    setBalance(numeral(value.toString()).format("0,0.[0000]"));
    setActualBalance(value.toString());
  }, [account]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, address, fastRefresh]);

  return { balance, fetchBalance, actualBalance };
};

export const useWTF = () => {
  const [weekDistribution, setWeekDistribution] = useState(BIG_ZERO);
  const network = useNetwork();

  useEffect(() => {
    const fetchBalance = async () => {
      const contractMasterChef = getContract2(MasterChefAbi, MasterChefAddress[NETWORK], network);
      const rewardPerBlock = await contractMasterChef.rewardPerBlock();
      const _weekDistribution = new BigNumber(rewardPerBlock.toString()).dividedBy(BIG_TEN.pow(18)).times(28800 * 7);
      setWeekDistribution(_weekDistribution);
    };

    fetchBalance();
  }, [MasterChefAddress]);

  return { weekDistribution };
};

const getTotalTVL = async () => {
  let _tvl = BIG_ZERO;
  const result = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=binancecoin,avalanche-2,wrapped-avax"
  );
  let avaxPrice = 1;
  if (result.status === 200) {
    avaxPrice = result.data["wrapped-avax"]?.usd;
  }
  console.log("avaxPrice", avaxPrice);
  //
  await Promise.all(
    AllTranches.map(async (_tranche) => {
      const _marketAddress = _tranche?.address;
      const calls = [
        {
          address: _marketAddress,
          name: "tranches",
          params: [0]
        },
        {
          address: _marketAddress,
          name: "tranches",
          params: [1]
        },
        {
          address: _marketAddress,
          name: "tranches",
          params: [2]
        }
      ];

      const [t0, t1, t2] = await multicallNetwork(_tranche?.network, TrancheMasterAbi, calls);
      const _tranches = [t0, t1, t2];

      _tranches.map((_t, _i) => {
        const _principal = _t ? new BigNumber(_t.principal?._hex).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO;
        let rate = 1;
        if (_tranche?.coin === "wavax") {
          rate = avaxPrice;
        }
        const _principalInUSD = _principal.times(rate);
        _tvl = _tvl.plus(_principalInUSD);
      });
    })
  );
  return _tvl;
};
export const useTotalTvl = () => {
  const [totalTvl, setTotalTvl] = useState("0");
  const markets = useMarkets();
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const _totalTvl = await getTotalTVL();
      setTotalTvl(_totalTvl.toFormat(0).toString());
    };
    fetchBalance();
  }, [markets, slowRefresh]);

  return totalTvl;
};
export const useWeeklyReward = () => {
  const [weeklyReward, setWeeklyReward] = useState("0");
  const markets = useMarkets();
  let _rewardPerBlock = new BigNumber(BIG_ZERO);
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    markets.forEach((m) => {
      const _rpb = new BigNumber(m.rewardPerBlock || 0);
      _rewardPerBlock = _rewardPerBlock.plus(_rpb);
    });
    setWeeklyReward(_rewardPerBlock.times((86400 / 3) * 7).toString());
  }, [markets, slowRefresh]);

  return weeklyReward;
};
export const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getRpcUrl());
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};
export const getContractBNB = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getBscRpcUrl());
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};
export const getContract2 = (
  abi: any,
  address: string,
  network: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  const simpleRpcProvider =
    network === "avax"
      ? new ethers.providers.JsonRpcProvider(getRpcUrl())
      : new ethers.providers.JsonRpcProvider(getBscRpcUrl());
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};
export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, MulticallAddress[NETWORK], signer);
};

export const getMulticallBSCContract = () => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getBscRpcUrl());
  return new ethers.Contract("0x41263cba59eb80dc200f3e2544eda4ed6a90e76c", MultiCallAbi, simpleRpcProvider);
};

export const getSigner = () => {
  if (window?.ethereum) {
    const chainId = window.ethereum.chainId;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    if (signer) return signer;
  }
  return;
};
