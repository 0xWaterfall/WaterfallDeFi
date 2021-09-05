import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Market, PORTFOLIO_STATUS } from "types";
import { getPortfolioTotalTarget, getPortfolioTvl, getTotalAllocPoints } from "utils/formatNumbers";
import Web3 from "web3";
import { AbiItem } from "web3-utils/types";

const initialState: Market[] = [];

export const getMarkets = createAsyncThunk<Market[] | undefined, Market[]>("markets/getMarket", async (payload) => {
  try {
    if (!Web3.givenProvider) return;
    const markets = await Promise.all(
      payload.map(async (marketData) => {
        const web3 = new Web3(Web3.givenProvider);
        const contractTranches = new web3.eth.Contract(marketData.abi as AbiItem[], marketData.address);
        const contractMasterChef = new web3.eth.Contract(
          marketData.masterChefAbi as AbiItem[],
          marketData.masterChefAddress
        );

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
      })
    );
    return markets;
  } catch (e) {
    console.error(new Error(e));
  }
});

export const marketsSlice = createSlice({
  name: "markets",
  initialState,
  reducers: {
    setMarkets: (state, action: PayloadAction<Market[]>) => action.payload
  },
  extraReducers: (builder) => {
    builder.addCase(getMarkets.fulfilled, (state, { payload }) => payload && payload);
  }
});

// Actions
export const { setMarkets } = marketsSlice.actions;

export default marketsSlice.reducer;
