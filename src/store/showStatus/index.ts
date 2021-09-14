import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IShowStatus {
  connectWalletModal: boolean;
}

const initialState: IShowStatus = {
  connectWalletModal: false
};

export const showStatusSlice = createSlice({
  name: "showStatus",
  initialState,
  reducers: {
    setConnectWalletModalShow: (state, action: PayloadAction<boolean>) => {
      state.connectWalletModal = action.payload;
    }
  }
});

// All here will be synchronized with localStorage

export const { setConnectWalletModalShow } = showStatusSlice.actions;

export default showStatusSlice.reducer;
