import { getContract } from "hooks";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Market, PORTFOLIO_STATUS } from "types";
import { getPortfolioTotalTarget, getPortfolioTvl, getTotalAllocPoints } from "utils/formatNumbers";
import Web3 from "web3";

const initialState: Market[] = [];

export const getMarkets = createAsyncThunk<Market[] | undefined, Market[]>("markets/getMarket", async (payload) => {
  try {
    if (!Web3.givenProvider) return;
    const _payload: Market[] = JSON.parse(JSON.stringify(payload));

    const markets = await Promise.all(
      _payload.map(async (marketData) => {
        const contractTranches = getContract(marketData.abi, marketData.address);
        const contractMasterChef = getContract(marketData.masterChefAbi, marketData.masterChefAddress);

        if (contractTranches) {
          const tranches = await Promise.all([
            contractTranches.tranches(0),
            contractTranches.tranches(1),
            contractTranches.tranches(2)
          ]);

          const [active, duration, actualStartAt] = await Promise.all([
            contractTranches.active(),
            contractTranches.duration(),
            contractTranches.actualStartAt()
          ]);

          const status = active ? PORTFOLIO_STATUS.ACTIVE : PORTFOLIO_STATUS.PENDING;
          const totalTranchesTarget = getPortfolioTotalTarget(tranches);
          const tvl = getPortfolioTvl(tranches);

          marketData = { ...marketData, tranches, duration, actualStartAt, status, totalTranchesTarget, tvl };
        }
        if (contractMasterChef) {
          const pools = await Promise.all([
            contractMasterChef.poolInfo(0),
            contractMasterChef.poolInfo(1),
            contractMasterChef.poolInfo(2)
          ]);
          const totalAllocPoints = getTotalAllocPoints(pools);

          marketData = { ...marketData, pools, totalAllocPoints };
        }
        return marketData;
      })
    );
    return JSON.parse(JSON.stringify(markets));
  } catch (e) {
    console.error(e);
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
