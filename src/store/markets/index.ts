import { getContract } from "hooks";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Market, Pool, PORTFOLIO_STATUS, Tranche } from "types";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const initialState: Market[] = [];

export const getMarkets = createAsyncThunk<Market[] | undefined, Market[]>("markets/getMarket", async (payload) => {
  try {
    // if (!Web3.givenProvider) return;
    const _payload: Market[] = JSON.parse(JSON.stringify(payload));

    const markets = await Promise.all(
      _payload.map(async (marketData) => {
        const contractTranches = getContract(marketData.abi, marketData.address);
        const contractMasterChef = getContract(marketData.masterChefAbi, marketData.masterChefAddress);

        if (contractTranches) {
          const _tranches = await Promise.all([
            contractTranches.tranches(0),
            contractTranches.tranches(1),
            contractTranches.tranches(2)
          ]);

          let totalTranchesTarget = BIG_ZERO;
          let tvl = BIG_ZERO;
          const tranches: Tranche[] = [];
          _tranches.map((_t, _i) => {
            const _principal = _t ? new BigNumber(_t.principal?._hex) : BIG_ZERO;
            const _apy = _t ? new BigNumber(_t.apy?._hex) : BIG_ZERO;
            const _fee = _t ? new BigNumber(_t.fee?._hex) : BIG_ZERO;
            const _target = _t ? new BigNumber(_t.target?._hex) : BIG_ZERO;

            totalTranchesTarget = totalTranchesTarget.plus(_target);
            tvl = tvl.plus(_principal);
            const __t = {
              principal: _t.principal.toString(),
              apy: _t.apy.toString(),
              fee: _t.fee.toString(),
              target: _t.target.toString()
            };
            tranches.push(__t);
          });

          const [active, duration, actualStartAt, cycle] = await Promise.all([
            contractTranches.active(),
            contractTranches.duration(),
            contractTranches.actualStartAt(),
            contractTranches.cycle()
          ]);

          const status = active ? PORTFOLIO_STATUS.ACTIVE : PORTFOLIO_STATUS.PENDING;

          marketData = {
            ...marketData,
            tranches,
            duration: duration.toString(),
            actualStartAt: actualStartAt.toString(),
            status,
            totalTranchesTarget: totalTranchesTarget.toString(),
            tvl: tvl.toString(),
            cycle: cycle.toString()
          };
        }
        if (contractMasterChef) {
          const _poolLength = await contractMasterChef.poolLength();
          const pools: string[] = [];
          let totalAllocPoints = BIG_ZERO;
          if (_poolLength > 0) {
            const arr = [];
            for (let i = 0; i < _poolLength; i++) {
              arr.push(contractMasterChef.poolInfo(i));
            }
            const _pools = await Promise.all(arr);
            _pools.map((_p, _i) => {
              const _allocPoint = _p ? new BigNumber(_p?._hex) : BIG_ZERO;
              totalAllocPoints = totalAllocPoints.plus(_allocPoint);

              pools.push(_allocPoint.toString());
            });
          }
          // const totalAllocPoints = getTotalAllocPoints(pools);

          marketData = { ...marketData, pools, totalAllocPoints: totalAllocPoints.toString() };
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
