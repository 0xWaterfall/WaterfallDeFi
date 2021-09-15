import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import { setupNetwork } from "utils/wallet";
import { useAppDispatch } from "store";
import { ConnectorNames } from "schemas/enum";

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? "", 10);

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { activate, deactivate } = useWeb3React();

  const login = useCallback(() => {
    const connector = new InjectedConnector({ supportedChainIds: [chainId] });
    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            activate(connector);
          }
        } else {
          if (error instanceof NoEthereumProviderError) {
            console.error(error);
          } else if (error instanceof UserRejectedRequestErrorInjected) {
            console.error(error);
          } else {
            console.error(error);
          }
        }
      });
    } else {
      console.warn("Unable to find connector", "The connector config is wrong");
    }
  }, [activate]);

  const logout = useCallback(() => {
    deactivate();
  }, [deactivate, dispatch]);

  return { login, logout };
};

export default useAuth;
