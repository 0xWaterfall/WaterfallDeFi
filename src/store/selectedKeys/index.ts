import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISelected {
  marketKey: string | null;
  theme: ITheme;
  network: Network;
  cookieModal: boolean;
}

const initialState: ISelected = {
  marketKey: null,
  theme: "light",
  network: Network.Avax,
  cookieModal: true
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
    },
    setNetwork: (state, action: PayloadAction<Network>) => {
      state.network = action.payload;
    },
    setCookieModal: (state, action: PayloadAction<boolean>) => {
      state.cookieModal = action.payload;
    }
  }
});

// All here will be synchronized with localStorage

export const { setMarketKey, setTheme, setNetwork, setCookieModal } = selectedKeysSlice.actions;

export default selectedKeysSlice.reducer;
