import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISelected {
  marketKey: string | null;
  theme: ITheme;
}

const initialState: ISelected = {
  marketKey: null,
  theme: "dark"
};

export const selectedKeysSlice = createSlice({
  name: "selectedKeys",
  initialState,
  reducers: {
    setMarketKey: (state, action: PayloadAction<string | null>) => {
      state.marketKey = action.payload;
    },
    setTheme: (state, action: PayloadAction<ITheme>) => {
      state.theme = action.payload;
    }
  }
});

// All here will be synchronized with localStorage

export const { setMarketKey, setTheme } = selectedKeysSlice.actions;

export default selectedKeysSlice.reducer;
