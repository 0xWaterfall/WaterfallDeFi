import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

export const PORTFOLIO_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  EXPIRED: "EXPIRED"
};
export interface Tranche {
  apy: string;
  fee: string;
  principal: string;
  target: string;
}

export interface Pool {
  accRewardPerShare: string;
  allocPoint: string;
  lastRewardBlock: string;
  totalSupply: string;
}

export interface Market {
  portfolio: string;
  assets: string;
  lockupPeriod: string;
  tranches: Tranche[];
  totalTranchesTarget: string;
  tvl: string;
  status: string;
  nextTime: string;
  address: string;
  abi: any;
  contract?: Contract;
  masterChefAddress: string;
  masterChefAbi: any;
  masterChefContract?: Contract;
  pools: Pool[];
  totalAllocPoints?: number;
  depositAssetAddress: string;
  depositAssetAbi: any;
  depositAssetContract?: Contract;
  strategyAbi: any;
  strategyAddress: string;
  strategyContract?: Contract;
}
