import { getContract, getSigner } from "hooks";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Market } from "types";
import { AbiItem } from "web3-utils";
import { useAppSelector } from "store";

const initialState: any[] = [];

export const getPosition = createAsyncThunk<any, { market: Market; account: string }>(
  "position/getPosition",
  async ({ market, account }) => {
    try {
      const contractTrancheMaster = getContract(market.abi as AbiItem[], market.address, getSigner());
      const userInvest = await Promise.all([
        contractTrancheMaster.userInvest(account, 0),
        contractTrancheMaster.userInvest(account, 1),
        contractTrancheMaster.userInvest(account, 2)
      ]);
      return JSON.parse(JSON.stringify(userInvest));
    } catch (e) {
      console.error(e);
    }
  }
);

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<Market[]>) => action.payload
  },
  extraReducers: (builder) => {
    builder.addCase(getPosition.fulfilled, (state, { payload }) => payload && payload);
  }
});

// Actions
export const { setPosition } = positionSlice.actions;

export default positionSlice.reducer;
