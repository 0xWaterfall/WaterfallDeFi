export declare enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect"
  // BSC = "bsc"
}
export declare type Login = (connectorId: ConnectorNames) => void;
