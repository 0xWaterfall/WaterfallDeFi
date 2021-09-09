import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISelected {
  marketKey: string | null;
}

const initialState: ISelected = {
  marketKey: null
};

export const selectedKeysSlice = createSlice({
  name: "selectedKeys",
  initialState,
  reducers: {
    setMarketKey: (state, action: PayloadAction<string | null>) => {
      state.marketKey = action.payload;
    }
  }
});

// All here will be synchronized with localStorage

export const { setMarketKey } = selectedKeysSlice.actions;

export default selectedKeysSlice.reducer;
