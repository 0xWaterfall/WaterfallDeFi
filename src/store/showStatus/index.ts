import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IShowStatus {
  connectWalletModal: boolean;
  confirmModal?: {
    isOpen: boolean;
    tx: string;
  };
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
    },
    setConfirmModal: (state, action: PayloadAction<IShowStatus["confirmModal"]>) => {
      state.confirmModal = action.payload;
    }
  }
});

// All here will be synchronized with localStorage

export const { setConnectWalletModalShow, setConfirmModal } = showStatusSlice.actions;

export default showStatusSlice.reducer;
