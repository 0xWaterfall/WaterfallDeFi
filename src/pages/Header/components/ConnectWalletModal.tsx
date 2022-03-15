/** @jsxImportSource @emotion/react */

import { MetaMask, WalletConnect } from "assets/images";
import Modal from "components/Modal/Modal";
import React, { memo, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useCallback } from "react";
import { url } from "config";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { useTheme } from "@emotion/react";
import useAuth from "utils/useAuth";
import { useConnectWalletModalShow, useNetwork } from "hooks/useSelectors";
import { useAppDispatch } from "store";
import { setConnectWalletModalShow } from "store/showStatus";

type TProps = WrappedComponentProps;

const ConnectWalletModal = memo<TProps>(({ intl }) => {
  const { gray, primary } = useTheme();
  const { active } = useWeb3ReactCore();
  const network = useNetwork();
  const { login } = useAuth(network);
  const onConnect = useCallback(async () => {
    if (window.ethereum?.isMetaMask && window.ethereum.request) {
      login("injected");
    } else {
      window.open(url.metamask);
    }
  }, []);

  const visible = useConnectWalletModalShow();

  const dispatch = useAppDispatch();

  useEffect(() => {
    active && dispatch(setConnectWalletModalShow(false));
  }, [active]);

  return (
    <Modal
      visible={visible}
      width={440}
      onCancel={() => {
        dispatch(setConnectWalletModalShow(false));
      }}
    >
      <title css={{ color: gray.normal, fontWeight: 600, fontSize: 16, marginBottom: 14 }}>
        {intl.formatMessage({ defaultMessage: "Connect wallet" })}
      </title>
      <section css={{ display: "flex", flexDirection: "column" }}>
        <div css={{ padding: 16, backgroundColor: gray.normal04, borderRadius: 12, color: gray.normal7 }}>
          {intl.formatMessage(
            {
              defaultMessage:
                "By connecting a wallet, you agree to {terms} and acknowledge that you have read and understand the {privacy}."
            },
            {
              terms: (
                <a
                  css={{ fontWeight: 600 }}
                  href="https://waterfalldefi.org/terms-of-service/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {intl.formatMessage({ defaultMessage: "Terms of Service" })}
                </a>
              ),
              privacy: (
                <a
                  css={{ fontWeight: 600 }}
                  href="https://waterfalldefi.org/privacy-policy/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {intl.formatMessage({ defaultMessage: "Privacy Policy" })}
                </a>
              )
            }
          )}
        </div>
        <div
          css={{
            padding: "0 16px",
            height: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "transparent",
            backgroundColor: gray.normal08,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 16,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
            color: gray.normal85,
            "&:hover": {
              borderColor: primary.deep
            }
          }}
          onClick={onConnect}
        >
          <div>
            {!window.ethereum?.isMetaMask && <span>{intl.formatMessage({ defaultMessage: "Install " })}</span>}
            <span>Metamask</span>
          </div>
          <MetaMask />
        </div>
        <div
          css={{
            padding: "0 16px",
            height: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "transparent",
            backgroundColor: gray.normal08,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 16,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
            color: gray.normal85,
            "&:hover": {
              borderColor: primary.deep
            }
          }}
          onClick={() => login("walletconnect")}
        >
          <div>
            <span>WalletConnect</span>
          </div>
          <WalletConnect />
        </div>
      </section>
    </Modal>
  );
});

export default injectIntl(ConnectWalletModal);
