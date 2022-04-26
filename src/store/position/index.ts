import { getContract, getContract2, getSigner } from "hooks";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Market } from "types";
// import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { MasterChefAddress, TranchesAddress } from "config/address";
import { BIG_TEN } from "utils/bigNumber";
import { NETWORK } from "config";
import multicall, { multicallBSC } from "utils/multicall";
import { useNetwork } from "hooks/useSelectors";

const initialState: IPosition = {
  positions: [],
  totalPendingReward: "0",
  tranchesPendingReward: [],
  balance: "0",
  invested: "0"
};

export const getTrancheBalance = createAsyncThunk<
  { balance: string; invested: string } | undefined,
  { account: string }
>("position/getTrancheBalance", async ({ account }) => {
  try {
    if (!account) return;
    const signer = getSigner();
    const network = useNetwork();
    const contractMasterChef = getContract2(TrancheMasterAbi, TranchesAddress[NETWORK], network, signer);
    const result = await contractMasterChef.balanceOf(account);
    return {
      balance: result.balance ? new BigNumber(result.balance?._hex).dividedBy(BIG_TEN.pow(18)).toString() : "0",
      invested: result.invested.toString()
    };
  } catch (e) {
    console.error(e);
  }
});

export const getPosition = createAsyncThunk<any, { market: Market; account: string }>(
  "position/getPosition",
  async ({ market, account }) => {
    try {
      if (!account) return;
      const signer = getSigner();
      if (!signer) return [];
      const network: string = useNetwork();

      const _marketAddress = market.address;
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
      const userInvest =
        network === "avax" ? await multicall(market.abi, calls) : await multicallBSC(market.abi, calls);

      return JSON.parse(JSON.stringify(userInvest));
    } catch (e) {
      console.error(e);
    }
  }
);

export const getPendingWTFReward = createAsyncThunk<
  { totalPendingReward: string; tranchesPendingReward: any[] } | undefined,
  { account: string }
>("position/getPendingWTFReward", async ({ account }) => {
  try {
    if (!account) return;
    const network = useNetwork();
    const contractMasterChef = getContract2(MasterChefAbi, MasterChefAddress[NETWORK], network);
    let _pendingReward = new BigNumber(0);
    const _tranchesPendingReward = [];

    const pendingReward0 = await contractMasterChef.pendingReward(account, 0);
    if (!pendingReward0.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward0.toString()));
    _tranchesPendingReward.push(!pendingReward0.isZero() ? pendingReward0.toString() : "0");

    const pendingReward1 = await contractMasterChef.pendingReward(account, 1);
    if (!pendingReward1.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward1.toString()));
    _tranchesPendingReward.push(!pendingReward1.isZero() ? pendingReward1.toString() : "0");
    const pendingReward2 = await contractMasterChef.pendingReward(account, 2);
    if (!pendingReward2.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward2.toString()));
    _tranchesPendingReward.push(!pendingReward2.isZero() ? pendingReward2.toString() : "0");
    return {
      totalPendingReward: _pendingReward.toString(),
      tranchesPendingReward: _tranchesPendingReward
    };
  } catch (e) {
    console.error(e);
  }
});

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<any[]>) => {
      state.positions = action.payload;
    },
    setPendingWTFReward: (
      state,
      action: PayloadAction<{ totalPendingReward: string; tranchesPendingReward: any[] }>
    ) => {
      state.totalPendingReward = action.payload.totalPendingReward;
      state.tranchesPendingReward = action.payload.tranchesPendingReward;
    },
    setTrancheBalance: (state, action: PayloadAction<{ balance: string; invested: string }>) => {
      state.balance = action.payload.balance;
      state.invested = action.payload.invested;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPosition.fulfilled, (state, { payload }) => {
      state.positions = payload;
    });
    builder.addCase(getPendingWTFReward.fulfilled, (state, { payload }) => {
      if (payload) {
        state.totalPendingReward = payload.totalPendingReward;
        state.tranchesPendingReward = payload.tranchesPendingReward;
      }
    });
    builder.addCase(getTrancheBalance.fulfilled, (state, { payload }) => {
      if (payload) {
        state.balance = payload.balance;
        state.invested = payload.invested;
      }
    });
  }
});

// Actions
export const { setPosition, setPendingWTFReward, setTrancheBalance } = positionSlice.actions;

export default positionSlice.reducer;
