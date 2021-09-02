import { MasterChefAddress } from "config/address";
import { ethers } from "ethers";
import { useEffect, useState, useCallback, useRef } from "react";
import { Market, PORTFOLIO_STATUS } from "types";
import { formatBalance, getPortfolioTvl, getTotalAllocPoints, getPortfolioTotalTarget } from "utils/formatNumbers";
import getRpcUrl from "utils/getRpcUrl";
import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import BigNumber from "bignumber.js";
import { BIG_ZERO, BIG_TEN } from "utils/bigNumber";

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
    marketData.totalAllocPoints = getTotalAllocPoints(_poolInfos);
  }
  return marketData;
};
export const useBalance = (abi: any, address: string) => {
  const [balance, setBalance] = useState("0");
  // Using React ref here to prevent component re-rendering when changing
  // previous balance value
  const prevBalanceRef = useRef("0");
  const provider = Web3.givenProvider;

  const fetchBalance = useCallback(async () => {
    console.log("fetching balance..");
    if (!Web3.givenProvider) return;
    if (!(window.ethereum?.isMetaMask && window.ethereum.request)) return;

    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(abi as AbiItem[], address);
    const accounts = await window?.ethereum?.request({ method: "eth_requestAccounts" });

    const myAccount = accounts?.[0] || "";
    if (!myAccount) return;

    const BUSDBalance = await contract.methods.balanceOf(myAccount).call();
    console.log("BUSD", BUSDBalance);
    const value = formatBalance(BUSDBalance);

    if (value !== prevBalanceRef.current) {
      prevBalanceRef.current = value;
      setBalance(value);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // useEffect(() => {
  //   // Fetch user balance on each block
  //   provider.on("block", fetchBalance);

  //   // Cleanup function is used to unsubscribe from 'block' event and prevent
  //   // a possible memory leak in your application.
  //   return () => {
  //     provider.off("block", fetchBalance);
  //   };
  // }, [fetchBalance]);

  return balance;
};
export const useWTF = () => {
  const [weekDistribution, setWeekDistribution] = useState(BIG_ZERO);

  useEffect(() => {
    const fetchBalance = async () => {
      const contractMasterChef = getContract(MasterChefAbi, MasterChefAddress);
      const rewardPerBlock = await contractMasterChef.rewardPerBlock();
      const _weekDistribution = new BigNumber(rewardPerBlock.toString()).dividedBy(BIG_TEN.pow(18)).times(28800 * 7);
      setWeekDistribution(_weekDistribution);
    };

    fetchBalance();
  }, [MasterChefAddress]);

  return { weekDistribution };
};
export const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getRpcUrl());
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};
