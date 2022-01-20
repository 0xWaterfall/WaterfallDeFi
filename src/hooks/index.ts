import { MasterChefAddress, TranchesAddress, MulticallAddress, MC_TrancheMasterAddress } from "config/address";
import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import { Market, PORTFOLIO_STATUS, Token } from "types";
import { formatBalance, getPortfolioTvl, getPortfolioTotalTarget } from "utils/formatNumbers";
import getRpcUrl from "utils/getRpcUrl";
import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { abi as MC_TrancheMasterAbi } from "config/abi/MC_TrancheMaster.json";
import { abi as ERC20Abi } from "config/abi/WTF.json";
import BigNumber from "bignumber.js";
import { BIG_ZERO, BIG_TEN } from "utils/bigNumber";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import MultiCallAbi from "config/abi/Multicall.json";
import { useMarkets } from "./useSelectors";
import { NETWORK } from "config";
import useRefresh from "./useRefresh";
import multicall from "utils/multicall";
import numeral from "numeral";
import { useTrancheMasterContract, useTrancheMulticurrencyMasterContract } from "./useContract";
import { MarketList } from "config/market";

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
export const useTrancheBalance = (trancheMasterAddress: string) => {
  // const [balance, setBalance] = useState(BIG_ZERO);
  // const [invested, setInvested] = useState(BIG_ZERO);
  const [result, setResult] = useState({
    balance: "",
    invested: ""
  });
  const { account } = useWeb3React<Web3Provider>();

  const { fastRefresh } = useRefresh();
  const trancheMasterContract = useTrancheMasterContract(trancheMasterAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await trancheMasterContract.balanceOf(account);

        setResult({
          balance: result.balance ? new BigNumber(result.balance?._hex).dividedBy(BIG_TEN.pow(18)).toString() : "0",
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
  const trancheMasterContract = useTrancheMulticurrencyMasterContract(trancheMasterAddress);
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
    balance: result.balance[currencyIdx],
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
  const trancheMasterContract = useTrancheMulticurrencyMasterContract(trancheMasterAddress);
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

export const useTrancheSnapshot = (cycle: string | undefined) => {
  const [trancheSnapshot, setTrancheSnapshot] = useState([]);

  useEffect(() => {
    const getTrancheSnapshot = async () => {
      if (!cycle || cycle === "0") return;
      cycle = (Number(cycle) - 1).toString();
      // const contractTrancheMaster = getContract(TrancheMasterAbi, TranchesAddress[NETWORK]);
      // console.log(contractTrancheMaster);
      // const result = await contractTrancheMaster.trancheSnapshots(cycle, 1);

      const _address = TranchesAddress[NETWORK];
      const calls = [
        {
          address: _address,
          name: "trancheSnapshots",
          params: [cycle, 0]
        },
        {
          address: _address,
          name: "trancheSnapshots",
          params: [cycle, 1]
        },
        {
          address: _address,
          name: "trancheSnapshots",
          params: [cycle, 2]
        }
      ];
      const result = await multicall(TrancheMasterAbi, calls);
      setTrancheSnapshot(result);
    };

    getTrancheSnapshot();
  }, [cycle]);

  return trancheSnapshot;
};

export const useMulticurrencyTrancheInvest = (
  trancheMasterAddress: string,
  cycle: string | undefined,
  tokenAddresses: string[],
  tranchesCount: number //future proofing for DAO curated falls with more than 3 tranches
) => {
  const [trancheInvest, setTrancheInvest] = useState<any[]>([]);

  const { fastRefresh } = useRefresh();

  const trancheMasterContract = useTrancheMulticurrencyMasterContract(trancheMasterAddress);

  useEffect(() => {
    const fetchTrancheInvests = async () => {
      try {
        const trancheInvest = [];
        for (let i = 0; i < tranchesCount; i++) {
          const tokensInTranche = [];
          for (let j = 0; j < tokenAddresses.length; j++) {
            tokensInTranche.push(await trancheMasterContract.trancheInvest(cycle, i, tokenAddresses[j]));
          }
          trancheInvest.push(tokensInTranche);
        }
        setTrancheInvest(trancheInvest);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrancheInvests();
  }, [fastRefresh]);

  return trancheInvest;
};

export const usePositions = (marketId: string | undefined) => {
  const { account } = useWeb3React<Web3Provider>();
  const { slowRefresh } = useRefresh();
  const [result, setResult] = useState<any>([]);
  useEffect(() => {
    const fetchBalance = async () => {
      const _result = [];
      for (let i = 0; i < MarketList.length; i++) {
        if (marketId && parseInt(marketId) !== i) continue;
        const _marketAddress = MarketList[i].address;
        const calls = [
          {
            address: _marketAddress,
            name: "userInvest",
            params: [account, 0]
          },
          {
            address: _marketAddress,
            name: "userInvest",
            params: [account, 1]
          },
          {
            address: _marketAddress,
            name: "userInvest",
            params: [account, 2]
          }
        ];
        const userInvest = await multicall(MarketList[i].abi, calls);
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
      const result = await multicall(MasterChefAbi, calls);
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
  }, [masterChefAddress, slowRefresh, account]);

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
  const { account, ...p } = useWeb3React<Web3Provider>();
  const { fastRefresh } = useRefresh();

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const contract = getContract(ERC20Abi, address);
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

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const contract = getContract(ERC20Abi, address);
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

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const contract = getContract(ERC20Abi, address);
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

  useEffect(() => {
    const fetchBalance = async () => {
      const contractMasterChef = getContract(MasterChefAbi, MasterChefAddress[NETWORK]);
      const rewardPerBlock = await contractMasterChef.rewardPerBlock();
      const _weekDistribution = new BigNumber(rewardPerBlock.toString()).dividedBy(BIG_TEN.pow(18)).times(28800 * 7);
      setWeekDistribution(_weekDistribution);
    };

    fetchBalance();
  }, [MasterChefAddress]);

  return { weekDistribution };
};
export const useTotalTvl = () => {
  const [totalTvl, setTotalTvl] = useState("0");
  const markets = useMarkets();
  let _totalTvl = new BigNumber(BIG_ZERO);
  const { fastRefresh } = useRefresh();
  useEffect(() => {
    markets.forEach((m) => {
      const _tvl = new BigNumber(m.tvl);
      _totalTvl = _totalTvl.plus(_tvl);
    });
    setTotalTvl(_totalTvl.toFormat(0).toString());
  }, [markets, fastRefresh]);

  return totalTvl;
};

export const useMulticurrencyDepositableTokens = (trancheMasterAddress: string, tokenCount: number) => {
  const [result, setResult] = useState<Token[]>([]);
  const { fastRefresh } = useRefresh();
  const trancheMasterContract = useTrancheMulticurrencyMasterContract(trancheMasterAddress);
  useEffect(() => {
    const fetchDepositableTokens = async () => {
      try {
        const tokens = [];
        for (let index = 0; index < tokenCount; index++) {
          tokens.push(await trancheMasterContract.tokens(index));
        }
        setResult(tokens);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDepositableTokens();
  }, [fastRefresh]);

  return result.map((t) => {
    return {
      addr: t.addr,
      strategy: t.strategy,
      percent: new BigNumber(t.percent._hex).dividedBy(BIG_TEN.pow(5)).toString()
    };
  });
};

export const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getRpcUrl());
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};
export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, MulticallAddress[NETWORK], signer);
};

export const getSigner = () => {
  if (window?.ethereum) {
    const chainId = window.ethereum.chainId;
    if (chainId !== "0x61" && chainId !== "0x38") return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    if (signer) return signer;
  }
  return;
};
