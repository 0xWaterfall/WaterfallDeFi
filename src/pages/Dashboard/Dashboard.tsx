/** @jsxImportSource @emotion/react */

import React, { memo, useEffect, useCallback } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { useWeb3React } from "@web3-react/core";
type TProps = WrappedComponentProps;
import { abi as WTFAbi } from "config/abi/WTF.json";
import { abi as BUSDAbi } from "config/abi/IbBUSD.json";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as StrategyAbi } from "config/abi/Strategy.json";
import { WTFAddress, BUSDAddress, MasterChefAddress, TranchesAddress, StrategyAddress } from "config/address";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

const Dashboard = memo<TProps>(() => {
  const { account } = useWeb3React();
  console.log(account);
  const testContract = useCallback(async () => {
    if (window.ethereum?.isMetaMask && window.ethereum.request) {
      const accounts = await window.ethereum?.request({ method: "eth_requestAccounts" });
      const myAccount = accounts?.[0] || "";
      console.log(myAccount);

      // const provider = new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
      const web3 = new Web3(Web3.givenProvider);

      // const accounts = await web3.eth.getAccounts();
      const contractWTF = new web3.eth.Contract(WTFAbi as AbiItem[], WTFAddress);
      const contractBUSD = new web3.eth.Contract(WTFAbi as AbiItem[], BUSDAddress);
      const contractTrancheMaster = new web3.eth.Contract(TrancheMasterAbi as AbiItem[], TranchesAddress);
      const contractMasterChef = new web3.eth.Contract(MasterChefAbi as AbiItem[], MasterChefAddress);
      const contractStrategy = new web3.eth.Contract(StrategyAbi as AbiItem[], StrategyAddress);
      if (myAccount) {
        const WTFbalance = await contractWTF.methods.balanceOf(myAccount).call();
        const BUSDBalance = await contractBUSD.methods.balanceOf(myAccount).call();
        console.log(WTFbalance);
        console.log(BUSDBalance);
      }
      const tranches = await contractTrancheMaster.methods.tranches(0).call();
      console.log(tranches);
      const tranches1 = await contractTrancheMaster.methods.tranches(1).call();
      console.log(tranches1);
      const tranches2 = await contractTrancheMaster.methods.tranches(2).call();
      console.log(tranches2);

      const active = await contractTrancheMaster.methods.active().call();
      console.log("active", active);

      //BUSD
      const currency = await contractTrancheMaster.methods.currency().call();

      //MasterChefAddress
      const staker = await contractTrancheMaster.methods.staker().call();

      const strategy = await contractTrancheMaster.methods.strategy().call();

      //0
      const cycle = await contractTrancheMaster.methods.cycle().call();
      //0
      const actualStartAt = await contractTrancheMaster.methods.actualStartAt().call();

      console.log(currency, staker, strategy, cycle, actualStartAt);

      console.log(contractTrancheMaster);

      // const _result = contractTrancheMaster.methods.percentageScale().call();
      // console.log(_result);
      console.log(contractMasterChef);

      // const result = await contractTrancheMaster.getPastEvents("TrancheAdd", {
      //   fromBlock: 11722764,
      //   toBlock: 11732768
      // });
      // console.log(result);

      const poolInfo = await contractMasterChef.methods.poolInfo(0).call();
      const poolInfo2 = await contractMasterChef.methods.poolInfo(1).call();
      const poolInfo3 = await contractMasterChef.methods.poolInfo(2).call();
      /*
      accRewardPerShare: "0"
      allocPoint: "30"
      lastRewardBlock: "11732849"
      totalSupply
      */
      console.log(poolInfo, poolInfo2, poolInfo3);

      //WTF
      const rewardToken = await contractMasterChef.methods.rewardToken().call();
      console.log(rewardToken);

      //1000000000000000000
      const rewardPerBlock = await contractMasterChef.methods.rewardPerBlock().call();
      console.log(rewardPerBlock);

      //0
      const startBlock = await contractMasterChef.methods.startBlock().call();
      console.log(startBlock);

      //1000000000000000000
      const endBlock = await contractMasterChef.methods.endBlock().call();
      console.log(endBlock);

      //60
      const totalAllocPoint = await contractMasterChef.methods.totalAllocPoint().call();
      console.log(totalAllocPoint);

      // const reserves = await contract.methods.getReserves().call();
      // console.log(reserves);

      console.log(contractStrategy);
      // const farm = await contractStrategy.methods.farms().call();
      // console.log(farm);
    }
  }, []);
  useEffect(() => {
    testContract();
  }, []);
  return <div style={{ marginTop: 100 }}>dashboard</div>;
});

export default injectIntl(Dashboard);
