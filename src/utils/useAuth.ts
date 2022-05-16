import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from "@web3-react/walletconnect-connector";
import { connectorsByName } from "utils/web3React";

import { setupNetwork } from "utils/wallet";

const useAuth = (network: string) => {
  const { activate, deactivate } = useWeb3React();

  const login = useCallback(
    (connectorID: string) => {
      let connector: InjectedConnector | WalletConnectConnector = connectorsByName.injected;
      if (connectorID === "walletconnect") connector = connectorsByName.walletconnect;
      if (connectorID === "walletconnect2") connector = connectorsByName.walletconnect2;

      window.localStorage.setItem("connectorIdv2", connectorID);
      // const connector = new InjectedConnector({ supportedChainIds: [chainId] });
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork(network);
            if (hasSetup) {
              activate(connector);
            }
          } else {
            if (error instanceof NoEthereumProviderError) {
              console.error(error);
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              console.log(error);
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector;
                walletConnector.walletConnectProvider = null;
              }
            } else {
              console.error(error);
            }
          }
        });
      } else {
        console.error("cannot connect");
      }
    },
    [activate]
  );

  const logout = useCallback(() => {
    deactivate();
    if (window.localStorage.getItem("walletconnect")) {
      connectorsByName.walletconnect.close();
      connectorsByName.walletconnect.walletConnectProvider = null;
      window.localStorage.removeItem("walletconnect");
    }
    window.localStorage.removeItem("connectorIdv2");
  }, [deactivate]);

  return { login, logout };
};

export default useAuth;
