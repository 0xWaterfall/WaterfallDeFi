import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import {
  WalletConnectConnector,
  WalletConnectConnectorArguments,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from "@web3-react/walletconnect-connector";
import { connectorsByName } from "utils/web3React";

import { setupNetwork } from "utils/wallet";
import { ConnectorNames } from "schemas/enum";
import { useAppDispatch } from "store";

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? "", 10);

const useAuth = (network: string) => {
  const { activate, deactivate } = useWeb3React();

  const login = useCallback(
    (connectorID: string) => {
      const connector = connectorID === "injected" ? connectorsByName.injected : connectorsByName.walletconnect;
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
