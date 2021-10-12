import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISelected {
  marketKey: string | null;
  theme: ITheme;
  cookieModal: boolean;
}

const initialState: ISelected = {
  marketKey: null,
  theme: "light",
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
    setCookieModal: (state, action: PayloadAction<boolean>) => {
      state.cookieModal = action.payload;
    }
  }
});

// All here will be synchronized with localStorage

export const { setMarketKey, setTheme, setCookieModal } = selectedKeysSlice.actions;

export default selectedKeysSlice.reducer;
