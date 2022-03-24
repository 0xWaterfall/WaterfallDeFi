import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EthersCall, Market, PORTFOLIO_STATUS, Token, Tranche } from "types";
import BigNumber from "bignumber.js";
import { BIG_TEN, BIG_ZERO } from "utils/bigNumber";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import multicall, { multicallBSC } from "utils/multicall";
import { formatAPY } from "utils/formatNumbers";
import { useWTFPrice } from "hooks/useSelectors";
import { abi as WTFRewardsABI } from "config/abi/WTFRewards.json";
import { getFarmsAPY } from "services/http";
import numeral from "numeral";

const initialState: Market[] = [];
const calculateJuniorAPY = (tranches: Tranche[], totalTarget: BigNumber, juniorTarget: BigNumber, decimals = 18) => {
  const juniorTVL = juniorTarget;
  tranches.map((_t, _i) => {
    let _apy = new BigNumber(_t.apy);
    _apy = _apy.plus(new BigNumber(100));
    _apy = _apy.dividedBy(new BigNumber(100));
    const _target = new BigNumber(_t.target);
    totalTarget = totalTarget.minus(_apy.times(_target));
  });
  totalTarget = totalTarget.dividedBy(juniorTVL);
  const result = numeral(totalTarget.minus(new BigNumber(1)).times(new BigNumber(100)).toString()).format("0,0.[00]");
  return result;
};
export const getMarkets = createAsyncThunk<Market[] | undefined, Market[]>("markets/getMarket", async (payload) => {
  try {
    // if (!Web3.givenProvider) return;
    const _payload: Market[] = JSON.parse(JSON.stringify(payload));
    // const _tt1 = Date.now();
    const farmsAPYResult = await getFarmsAPY();

    const markets = await Promise.all(
      _payload.map(async (marketData, marketId) => {
        const _marketAddress = marketData.address;
        const tokenCalls = !marketData.isMulticurrency
          ? []
          : marketData.assets.map((a, i) => ({ address: _marketAddress, name: "tokens", params: [i] }));
        const callsBasic = [
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
          },
          {
            address: _marketAddress,
            name: "active"
          },
          {
            address: _marketAddress,
            name: "duration"
          },
          {
            address: _marketAddress,
            name: "actualStartAt"
          },
          {
            address: _marketAddress,
            name: "cycle"
          }
        ];
        const calls = [...callsBasic, ...tokenCalls];
        // const venusAPY = await getVenusAPY();
        // const creamAPY = await getCreamAPY();
        // const apacaAPY = 0.136;
        let farmsAPY = 0;
        if (farmsAPYResult) {
          for (let i = 0; i < marketData.strategyFarms.length; i++) {
            const sf = marketData.strategyFarms[i];
            if (!sf || !sf.shares || !farmsAPYResult[sf.apiKey]) continue;
            farmsAPY += sf.shares * farmsAPYResult[sf.apiKey];
          }
          // if (farmsAPYResult?.venus) {
          //   farmsAPY += 0.3 * farmsAPYResult?.venus;
          // }
          // if (farmsAPYResult?.cream) {
          //   farmsAPY += 0.3 * farmsAPYResult?.cream;
          // }
          // if (farmsAPYResult?.alpaca) {
          //   farmsAPY += 0.4 * farmsAPYResult?.alpaca;
          // }
        }

        const [t0, t1, t2, active, duration, actualStartAt, cycle, ...tokens] = !marketData.isAvax
          ? await multicallBSC(marketData.abi, calls)
          : await multicall(marketData.abi, calls);
        // console.log("cycle", _marketAddress, new BigNumber(cycle[0]._hex).toString(), cycle.toString());
        const _tranches = [t0, t1, t2];
        console.log(_tranches);
        const tokenObjs = tokens.map((t: any) => {
          return { addr: t[0], strategy: t[1], percent: t[2] };
        });
        let totalTranchesTarget = BIG_ZERO;
        let tvl = BIG_ZERO;
        let totalTarget = BIG_ZERO;
        // let expectedAPY = new BigNumber("210000000000000000").dividedBy(BIG_TEN.pow(18));
        let expectedAPY = new BigNumber(farmsAPY);

        expectedAPY = expectedAPY.plus(new BigNumber(1));
        const tranches: Tranche[] = [];
        _tranches.map((_t, _i) => {
          const _target = new BigNumber(_t.target?._hex).dividedBy(BIG_TEN.pow(18));
          totalTarget = totalTarget.plus(_target);
        });
        totalTarget = totalTarget.times(expectedAPY);
        _tranches.map((_t, _i) => {
          const _principal = _t ? new BigNumber(_t.principal?._hex).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO;
          console.log(_t.autoPrincipal);
          const _autoPrincipal = _t ? new BigNumber(_t.autoPrincipal?._hex).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO;
          const _validPercent = _t ? new BigNumber(_t.validPercent?._hex).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO;

          const _fee = _t ? new BigNumber(_t.fee?._hex).dividedBy(1000) : BIG_ZERO;
          const _target = _t ? new BigNumber(_t.target?._hex).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO;
          const _apy =
            _t && _i !== _tranches.length - 1
              ? new BigNumber(_t.apy?._hex).dividedBy(BIG_TEN.pow(16))
              : calculateJuniorAPY(tranches, totalTarget, _target);

          totalTranchesTarget = totalTranchesTarget.plus(_target);
          tvl = marketData.autorollImplemented ? tvl.plus(_principal).plus(_autoPrincipal) : tvl.plus(_principal);
          const __t = {
            principal: _principal.toString(),
            autoPrincipal: _autoPrincipal.toString(),
            validPercent: _validPercent.toString(),
            apy: _apy.toString(),
            fee: _fee.toString(),
            target: _target.toString()
          };
          tranches.push(__t);
        });
        const status = active[0] ? PORTFOLIO_STATUS.ACTIVE : PORTFOLIO_STATUS.PENDING;

        const originalDuration = duration.toString();
        // const hackDuration = new BigNumber(duration).plus(86400).toString();
        marketData = {
          ...marketData,
          tranches,
          tokens: tokenObjs,
          // duration: duration.toString(),
          duration: originalDuration,
          actualStartAt: actualStartAt.toString(),
          status,
          totalTranchesTarget: totalTranchesTarget.toString(),
          tvl: tvl.toString(),
          cycle: cycle.toString()
        };
        const _masterchefAddress = marketData.masterChefAddress;
        //disabling staking calls for avax until avax staking is up
        if (!marketData.isAvax) {
          const calls2 = [
            {
              address: _masterchefAddress,
              name: "poolInfo",
              params: [0]
            },
            {
              address: _masterchefAddress,
              name: "poolInfo",
              params: [1]
            },
            {
              address: _masterchefAddress,
              name: "poolInfo",
              params: [2]
            },
            {
              address: _masterchefAddress,
              name: "rewardPerBlock"
            }
          ];
          const [p0, p1, p2, _rewardPerBlock] = !marketData.isAvax
            ? await multicallBSC(marketData.masterChefAbi, calls2)
            : await multicall(marketData.masterChefAbi, calls2);
          const rewardPerBlock = new BigNumber(_rewardPerBlock[0]._hex).dividedBy(BIG_TEN.pow(18)).toString();
          const pools: string[] = [];
          let totalAllocPoints = BIG_ZERO;
          const _pools = [p0, p1, p2];
          _pools.map((_p, _i) => {
            const _allocPoint = _p ? new BigNumber(_p?.allocPoint._hex) : BIG_ZERO;
            totalAllocPoints = totalAllocPoints.plus(_allocPoint);
            pools.push(_allocPoint.toString());
          });
          // const totalAllocPoints = getTotalAllocPoints(pools);
          marketData = { ...marketData, pools, totalAllocPoints: totalAllocPoints.toString(), rewardPerBlock };
        }
        if (marketData.isMulticurrency) {
          const trancheInvestCalls = marketData.depositAssetAddresses.map((addr: string) => [
            {
              address: _marketAddress,
              name: "trancheInvest",
              params: [cycle[0], 0, addr]
            },
            {
              address: _marketAddress,
              name: "trancheInvest",
              params: [cycle[0], 1, addr]
            },
            {
              address: _marketAddress,
              name: "trancheInvest",
              params: [cycle[0], 2, addr]
            }
          ]);
          const calls3 = trancheInvestCalls.reduce((acc: EthersCall[], next: EthersCall[]) => [...acc, ...next], []);
          const trancheInvestsRes = !marketData.isAvax
            ? await multicallBSC(marketData.abi, calls3)
            : await multicall(marketData.abi, calls3);
          const trancheInvestsResUnpacked = trancheInvestsRes.map((res: BigNumber[]) => res[0]);
          const trancheCount = tranches.length;
          const trancheInvests = tranches.map((t: Tranche, i: number) =>
            tokenObjs.map((t: Token, j: number) => trancheInvestsResUnpacked[i + trancheCount * j])
          );
          marketData = { ...marketData, trancheInvests: trancheInvests };
        }
        return marketData;
      })
    );
    return JSON.parse(JSON.stringify(markets));
  } catch (e) {
    console.error(e);
  }
});
// export const getMarkets = createAsyncThunk<Market[] | undefined, Market[]>("markets/getMarket", async (payload) => {
//   try {
//     // if (!Web3.givenProvider) return;
//     const _payload: Market[] = JSON.parse(JSON.stringify(payload));

//     const markets = await Promise.all(
//       _payload.map(async (marketData) => {
//         const contractTranches = getContract(marketData.abi, marketData.address);
//         const contractMasterChef = getContract(marketData.masterChefAbi, marketData.masterChefAddress);

//         if (contractTranches) {
//           const _tranches = await Promise.all([
//             contractTranches.tranches(0),
//             contractTranches.tranches(1),
//             contractTranches.tranches(2)
//           ]);

//           let totalTranchesTarget = BIG_ZERO;
//           let tvl = BIG_ZERO;
//           const tranches: Tranche[] = [];
//           _tranches.map((_t, _i) => {
//             const _principal = _t ? new BigNumber(_t.principal?._hex) : BIG_ZERO;
//             const _apy = _t ? new BigNumber(_t.apy?._hex) : BIG_ZERO;
//             const _fee = _t ? new BigNumber(_t.fee?._hex) : BIG_ZERO;
//             const _target = _t ? new BigNumber(_t.target?._hex) : BIG_ZERO;

//             totalTranchesTarget = totalTranchesTarget.plus(_target);
//             tvl = tvl.plus(_principal);
//             const __t = {
//               principal: _t.principal.toString(),
//               apy: _t.apy.toString(),
//               fee: _t.fee.toString(),
//               target: _t.target.toString()
//             };
//             tranches.push(__t);
//           });

//           const [active, duration, actualStartAt, cycle] = await Promise.all([
//             contractTranches.active(),
//             contractTranches.duration(),
//             contractTranches.actualStartAt(),
//             contractTranches.cycle()
//           ]);

//           const status = active ? PORTFOLIO_STATUS.ACTIVE : PORTFOLIO_STATUS.PENDING;

//           marketData = {
//             ...marketData,
//             tranches,
//             duration: duration.toString(),
//             actualStartAt: actualStartAt.toString(),
//             status,
//             totalTranchesTarget: totalTranchesTarget.toString(),
//             tvl: tvl.toString(),
//             cycle: cycle.toString()
//           };
//         }
//         if (contractMasterChef) {
//           const _poolLength = await contractMasterChef.poolLength();
//           const pools: string[] = [];
//           let totalAllocPoints = BIG_ZERO;
//           if (_poolLength > 0) {
//             const arr = [];
//             for (let i = 0; i < _poolLength; i++) {
//               arr.push(contractMasterChef.poolInfo(i));
//             }
//             const _pools = await Promise.all(arr);
//             _pools.map((_p, _i) => {
//               const _allocPoint = _p ? new BigNumber(_p?._hex) : BIG_ZERO;
//               totalAllocPoints = totalAllocPoints.plus(_allocPoint);

//               pools.push(_allocPoint.toString());
//             });
//           }
//           // const totalAllocPoints = getTotalAllocPoints(pools);

//           marketData = { ...marketData, pools, totalAllocPoints: totalAllocPoints.toString() };
//         }
//         return marketData;
//       })
//     );
//     return JSON.parse(JSON.stringify(markets));
//   } catch (e) {
//     console.error(e);
//   }
// });

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
