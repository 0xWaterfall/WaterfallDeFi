import { getPrice } from "./../../services/http";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IWTFInfo {
  price: string | null;
  marketCap: string | null;
}

const initialState: IWTFInfo = {
  price: null,
  marketCap: null
};

export const getInfo = createAsyncThunk<IWTFInfo | undefined>("WTFInfo/getInfo", async () => {
  try {
    const price = await getPrice();
    return {
      price,
      marketCap: null
    };
  } catch (e) {
    console.error(e);
  }
});

export const WTFInfoSlice = createSlice({
  name: "WTFInfo",
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<IWTFInfo>) => action.payload && action.payload
  },
  extraReducers: (builder) => {
    builder.addCase(getInfo.fulfilled, (state, { payload }) => payload && payload);
  }
});

// All here will be synchronized with localStorage

export const { setInfo } = WTFInfoSlice.actions;

export default WTFInfoSlice.reducer;
