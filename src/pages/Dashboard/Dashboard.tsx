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
import { ethers } from "ethers";
import { AbiItem } from "web3-utils";

import { Web3Provider } from "@ethersproject/providers";
import getRpcUrl from "utils/getRpcUrl";
import { getContract, usePendingWTFReward, useStrategyFarm, useWTF } from "hooks";
import { useMarkets, useSelectedMarket } from "hooks/useSelectors";
import { useAppDispatch } from "store";
import { setMarketKey } from "store/selectedKeys";
import useWithdraw from "pages/PortfolioDetails/hooks/useWithdraw";
import Button from "components/Button/Button";

const Dashboard = memo<TProps>(() => {
  // const { account } = useWeb3React();
  const { active, account, chainId, library, connector, ...p } = useWeb3React<Web3Provider>();
  const { weekDistribution } = useWTF();
  console.log("weekDistribution", weekDistribution.toString());
  console.log(connector);
  const { onWithdraw } = useWithdraw();
  const markets = useMarkets();
  console.log(markets);

  const selectedMarket = useSelectedMarket();
  console.log(selectedMarket);
  if (selectedMarket) {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractTrancheMaster2 = new ethers.Contract(selectedMarket.address, selectedMarket.abi, signer);
      console.log(contractTrancheMaster2);
    }
  }
  const dispatch = useAppDispatch();
  dispatch(setMarketKey("0"));

  const handleConfirmClick = async (account: string) => {
    console.log("AAA");
    try {
      const web3 = new Web3(Web3.givenProvider);
      const contractTrancheMaster = new web3.eth.Contract(TrancheMasterAbi as AbiItem[], TranchesAddress);
      const stop = await contractTrancheMaster.methods.stop().send({ from: account });
      // console.log(stop);
      // staking
      // await onWithdraw("100");
      // toastSuccess(
      //   `${t('Staked')}!`,
      //   t('Your %symbol% funds have been staked in the pool!', {
      //     symbol: stakingToken.symbol,
      //   }),
      // )
      // setPendingTx(false)
      // onDismiss()
    } catch (e) {
      console.log(e);
      // toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      // setPendingTx(false)
    }
  };

  // const pendingReward_ = usePendingWTFReward();
  // console.log("pendingReward_", pendingReward_);
  const testContract = useCallback(async () => {
    if (window.ethereum?.isMetaMask && window.ethereum.request) {
      const accounts = await window.ethereum?.request({ method: "eth_requestAccounts" });
      const myAccount = accounts?.[0] || "";
      console.log(myAccount);

      // const provider = new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
      // console.log(Web3.givenProvider);
      const web3 = new Web3(Web3.givenProvider);

      const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getRpcUrl());
      // const currentBlock = await simpleRpcProvider.getBlockNumber();
      // console.log("currentBlock", currentBlock);

      const contractTrancheMaster2 = new ethers.Contract(TranchesAddress, TrancheMasterAbi, simpleRpcProvider);
      console.log(contractTrancheMaster2);
      // const tranches = await contractTrancheMaster.tranches(0);
      // console.log(tranches);
      // const __ = await contractTrancheMaster.methods.balanceOf(myAccount).call();
      // console.log(__);
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

      const duration = await contractTrancheMaster.methods.duration().call();
      console.log("duration", duration);

      //BUSD
      const currency = await contractTrancheMaster.methods.currency().call();

      //MasterChefAddress
      const staker = await contractTrancheMaster.methods.staker().call();

      const strategy = await contractTrancheMaster.methods.strategy().call();

      //0
      const cycle = await contractTrancheMaster.methods.cycle().call();
      console.log("cycle", cycle);
      //0
      const actualStartAt = await contractTrancheMaster.methods.actualStartAt().call();

      console.log(currency, staker, strategy, cycle, actualStartAt, duration);

      console.log(contractTrancheMaster);

      // const _result = contractTrancheMaster.methods.percentageScale().call();
      // console.log(_result);
      console.log(contractMasterChef);

      // const result = await contractTrancheMaster.getPastEvents("TrancheAdd", {
      //   fromBlock: 11722764,
      //   toBlock: 11732768
      // });
      // console.log(result);

      const poolLength = await contractMasterChef.methods.poolLength().call();
      console.log(poolLength);
      const poolInfo = await contractMasterChef.methods.poolInfo(0).call();
      console.log(poolInfo);
      // const poolInfo2 = await contractMasterChef.methods.poolInfo(1).call();
      // console.log(poolInfo2);
      // const poolInfo3 = await contractMasterChef.methods.poolInfo(2).call();
      // console.log(poolInfo3);
      /*
      accRewardPerShare: "0"
      allocPoint: "30"
      lastRewardBlock: "11732849"
      totalSupply
      */

      //WTF
      const rewardToken = await contractMasterChef.methods.rewardToken().call();
      console.log(rewardToken);

      //1000000000000000000
      // const rewardPerBlock = await contractMasterChef.methods.rewardPerBlock().call();
      // console.log(rewardPerBlock);

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

      console.log(contractTrancheMaster);
      // contractTrancheMaster.methods.deposit(0)

      console.log(contractBUSD);
      const BUSDBalance = await contractBUSD.methods.balanceOf(myAccount).call();
      console.log(BUSDBalance);

      //approve
      // const re = await contractBUSD.methods
      //   .approve("0x18dD65280baabAf85fB875036f90d1ea794ABF6e", web3.utils.toWei("999999999", "ether"))
      //   .send({ from: myAccount });
      // console.log(re);

      //allowance
      const allowance = await contractBUSD.methods
        .allowance("0x4324DcFA175bcccabB5f85b1531e23dCF218dC93", "0x18dD65280baabAf85fB875036f90d1ea794ABF6e")
        .call();
      console.log(allowance); // > 0

      // //deposit
      // const deposit = await contractTrancheMaster.methods.deposit(200000).send({ from: myAccount });
      // console.log(deposit);

      //check deposit balance
      const ret = await contractTrancheMaster.methods.balanceOf(myAccount).call();
      console.log("deposit balance", ret);

      //check getInvest
      const getInvest = await contractTrancheMaster.methods.getInvest(1).call();
      console.log("getInvest", getInvest);

      //invest
      // const invest = await contractTrancheMaster.methods.investDirect(1, 200000, false).send({ from: myAccount });
      // console.log(invest);

      //userInfo
      const userInfo = await contractTrancheMaster.methods.userInfo(myAccount).call();
      console.log(userInfo);

      //userInvest
      const userInvest = await contractTrancheMaster.methods.userInvest(myAccount, 0).call();
      console.log(userInvest);

      userInvest;
      const userInvest2 = await contractTrancheMaster.methods.userInvest(myAccount, 1).call();
      console.log(userInvest2);

      //userInvest
      const userInvest3 = await contractTrancheMaster.methods.userInvest(myAccount, 2).call();
      console.log(userInvest3);

      console.log(contractTrancheMaster.methods);

      const rewardPerBlock = await contractMasterChef.methods.rewardPerBlock().call();
      console.log(rewardPerBlock);

      console.log("myAccount", myAccount);

      const pendingReward = await contractMasterChef.methods.pendingReward(myAccount, 0).call();
      console.log(pendingReward);
      const pendingReward1 = await contractMasterChef.methods.pendingReward(myAccount, 1).call();
      console.log(pendingReward1);
      const pendingReward2 = await contractMasterChef.methods.pendingReward(myAccount, 2).call();
      console.log(pendingReward2);

      // const claimAll = await contractMasterChef.methods.claimAll().send({ from: myAccount });
      // console.log(claimAll);
      const activeCycle = await contractTrancheMaster.methods.active().call();
      console.log(activeCycle);

      //

      const farms = await contractStrategy.methods.farms(0).call();
      console.log(farms);

      const farms1 = await contractStrategy.methods.farms(1).call();
      console.log(farms1);
      const farms2 = await contractStrategy.methods.farms(2).call();
      console.log(farms2);
    }
  }, []);
  useEffect(() => {
    testContract();
  }, []);
  return (
    <div style={{ marginTop: 100 }}>
      dashboard
      {account && (
        <Button type="default" onClick={() => handleConfirmClick(account)}>
          stop cycle
        </Button>
      )}
    </div>
  );
});

export default injectIntl(Dashboard);
