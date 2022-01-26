import { ethers } from "ethers";
import { InjectedConnector } from "@web3-react/injected-connector";

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import getNodeUrl from "./getRpcUrl";
enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  BSC = "bsc"
}
const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? "", 10);
const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: process.env.REACT_APP_NODE_1 || "" },
  supportedChainIds: [chainId],
  qrcode: true,
  bridge: "https://bridge.walletconnect.org"
  // pollingInterval: POLLING_INTERVAL
});
console.log("walletconnect", walletconnect);
const injected = new InjectedConnector({ supportedChainIds: [chainId] });
export const connectorsByName = {
  ["injected"]: injected,
  ["walletconnect"]: walletconnect
};
export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};
