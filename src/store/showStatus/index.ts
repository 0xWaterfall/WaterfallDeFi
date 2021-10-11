import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IShowStatus {
  connectWalletModal: boolean;
  cookieModal: boolean;
}

const initialState: IShowStatus = {
  connectWalletModal: false,
  cookieModal: true
};

export const showStatusSlice = createSlice({
  name: "showStatus",
  initialState,
  reducers: {
    setConnectWalletModalShow: (state, action: PayloadAction<boolean>) => {
      state.connectWalletModal = action.payload;
    },
    setCookieModal: (state, action: PayloadAction<boolean>) => {
      state.cookieModal = action.payload;
    }
  }
});

// All here will be synchronized with localStorage

export const { setConnectWalletModalShow, setCookieModal } = showStatusSlice.actions;

export default showStatusSlice.reducer;
