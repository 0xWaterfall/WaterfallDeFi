import { ethers } from "ethers";
import { InjectedConnector } from "@web3-react/injected-connector";

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 12000;

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? "", 10);
const bnbChainId = parseInt(process.env.REACT_APP_BNB_CHAIN_ID ?? "", 10);

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: process.env.REACT_APP_NODE_1 || "" },
  supportedChainIds: [chainId],
  qrcode: true,
  bridge: "https://bridge.walletconnect.org"
  // pollingInterval: POLLING_INTERVAL
});
const walletconnect2 = new WalletConnectConnector({
  rpc: { [bnbChainId]: process.env.REACT_APP_BSC_NODE_1 || "" },
  supportedChainIds: [bnbChainId],
  qrcode: true,
  bridge: "https://bridge.walletconnect.org"
  // pollingInterval: POLLING_INTERVAL
});
console.log("walletconnect", walletconnect);
const injected = new InjectedConnector({ supportedChainIds: [chainId, bnbChainId] });
export const connectorsByName = {
  ["injected"]: injected,
  ["walletconnect"]: walletconnect,
  ["walletconnect2"]: walletconnect2
};
export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};
