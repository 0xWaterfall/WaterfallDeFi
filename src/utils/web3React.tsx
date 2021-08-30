import { ethers } from "ethers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ConnectorNames } from "schemas/enum";

const POLLING_INTERVAL = 12000;

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? "", 10);

const injected = new InjectedConnector({ supportedChainIds: [chainId] });

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};
