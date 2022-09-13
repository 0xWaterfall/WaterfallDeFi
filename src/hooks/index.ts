import { MasterChefAddress, MulticallAddress } from "config/address";
import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import { Market, PORTFOLIO_STATUS } from "types";
import { formatBalance, getPortfolioTvl, getPortfolioTotalTarget } from "utils/formatNumbers";
import getRpcUrl, { getBscRpcUrl } from "utils/getRpcUrl";
import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as ERC20Abi } from "config/abi/WTF.json";
import BigNumber from "bignumber.js";
import { BIG_ZERO, BIG_TEN } from "utils/bigNumber";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import MultiCallAbi from "config/abi/Multicall.json";
import { useMarkets, useNetwork } from "./useSelectors";
import { BLOCK_TIME, NETWORK } from "config";
import useRefresh from "./useRefresh";
import multicall, { multicallBSC, multicallNetwork } from "utils/multicall";
import numeral from "numeral";
import {
  useAVAXTrancheMasterContract,
  useTrancheMasterContract,
  useMulticurrencyTrancheMasterContract
} from "./useContract";
import { MarketList } from "config/market";
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
              ...(MarketList[i].trancheCount === 3
                ? [
                    {
                      address: MarketList[i].address,
                      name: "userInvest",
                      params: [account, 2]
                    }
                  ]
                : [])
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
              ...(MarketList[i].trancheCount === 3
                ? [
                    {
                      address: MarketList[i].address,
                      name: "userInvest",
                      params: [account, 2, a]
                    }
                  ]
                : [])
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
export const usePendingWTFReward = (masterChefAddress: string, trancheCount: number) => {
  const { account } = useWeb3React<Web3Provider>();
  const [totalPendingReward, setTotalPendingReward] = useState("0");
  const [tranchesPendingReward, setTranchesPendingReward] = useState<string[]>([]);
  const { slowRefresh } = useRefresh();
  const network = useNetwork();

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [];
      for (let i = 0; i < trancheCount; i++) {
        calls.push({
          address: masterChefAddress,
          name: "pendingReward",
          params: [account, i]
        });
      }
      const result = await multicallNetwork(network, MasterChefAbi, calls);
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

export const useMetamaskAvaxCBalance = () => {
  const [balance, setBalance] = useState("0");
  const [actualBalance, setActualBalance] = useState("0");
  const { account, ...p } = useWeb3React<Web3Provider>();
  const { slowRefresh, fastRefresh } = useRefresh();

  const fetchBalance = useCallback(async () => {
    const provider = window.ethereum;
    if (provider?.request && account) {
      const tokenBalance: any = await provider.request({
        method: "eth_getBalance",
        params: [account, "latest"]
      });
      const value = new BigNumber(tokenBalance.toString()).dividedBy(BIG_TEN.pow(18));
      setBalance(numeral(value.toString()).format("0,0.[0000]"));
      setActualBalance(value.toString());
    }
  }, [account]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, fastRefresh]);

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
const getCoingeckoPrices = async () => {
  const result = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=binancecoin,avalanche-2,wrapped-avax,wbnb"
  );
  if (result.status === 200) {
    return result.data;
  }
  return {};
};
const getTotalTVL = async () => {
  let _tvl = BIG_ZERO;
  const result = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=binancecoin,avalanche-2,wrapped-avax,wbnb"
  );
  let avaxPrice = 1;
  if (result.status === 200) {
    avaxPrice = result.data["wrapped-avax"]?.usd;
  }

  let wbnbPrice = 1;
  if (result.status === 200) {
    wbnbPrice = result.data["wbnb"]?.usd;
  }
  //
  await Promise.all(
    MarketList.map(async (_tranche, __id) => {
      if (_tranche.isRetired) return;
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
        ...(_tranche.trancheCount === 3
          ? [
              {
                address: _marketAddress,
                name: "tranches",
                params: [2]
              }
            ]
          : [])
      ];

      const [t0, t1, t2] = await multicallNetwork(_tranche?.isAvax ? "AVAX" : "BSC", _tranche?.abi, calls);
      const _tranches = [t0, t1, t2];
      _tranches.map((_t, _i) => {
        const _principal = _t ? new BigNumber(_t.principal?._hex).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO;
        const _autoPrincipal = _t ? new BigNumber(_t.autoPrincipal?._hex).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO;
        let rate = 1;
        if (_tranche?.assets?.includes("WAVAX")) {
          rate = avaxPrice;
        }

        if (_tranche?.assets?.includes("WBNB")) {
          rate = wbnbPrice;
        }
        // const _principalInUSD = _principal.times(rate);
        const _principalInUSD = _tranche?.autorollImplemented
          ? _principal.plus(_autoPrincipal).times(rate)
          : _principal.times(rate);

        if (!_principalInUSD.isNaN()) _tvl = _tvl.plus(_principalInUSD);
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
export const useCoingeckoPrices = () => {
  const [prices, setPrices] = useState({});
  const markets = useMarkets();
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const _prices = await getCoingeckoPrices();
      setPrices(_prices);
    };
    fetchBalance();
  }, [markets, slowRefresh]);

  return prices;
};
export const useWeeklyReward = () => {
  const [weeklyReward, setWeeklyReward] = useState("0");
  const markets = useMarkets();
  let _rewardPerBlock = new BigNumber(BIG_ZERO);
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    markets.forEach((m) => {
      if (m?.isRetired) return;
      const _rpb = new BigNumber(m.rewardPerBlock || 0);
      _rewardPerBlock = _rewardPerBlock.plus(_rpb);
    });

    const blockTime = BLOCK_TIME(process.env.REACT_APP_CHAIN_ID || "");
    setWeeklyReward(_rewardPerBlock.times((86400 / blockTime) * 7).toString());
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
