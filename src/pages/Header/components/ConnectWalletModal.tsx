/** @jsxImportSource @emotion/react */

import { MetaMask } from "assets/images";
import Modal from "components/Modal/Modal";
import React, { memo, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import detectEthereumProvider from "@metamask/detect-provider";
import { useCallback } from "react";
import { url } from "config";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { useTheme } from "@emotion/react";

type TProps = WrappedComponentProps & {
  visible?: boolean;
  onCancel?: (e: boolean) => void;
};

const ConnectWalletModal = memo<TProps>(({ intl, visible, onCancel }) => {
  const { gray, primary } = useTheme();
  const web3 = useWeb3ReactCore();
  console.log(web3);
  const onConnect = useCallback(async () => {
    if (window.ethereum?.isMetaMask && window.ethereum.request) {
      const r = await window.ethereum?.request({ method: "eth_requestAccounts" });
      console.log(r);
    } else {
      window.open(url.metamask);
    }
  }, []);

  useEffect(() => {
    // Subscribe to accounts change
    window.ethereum?.on?.(["accountsChanged", "chainChanged"], (accounts: string[], chainId: number) => {
      console.log(accounts, chainId);
    });

    // Subscribe to provider connection
    window.ethereum?.on?.("connect", (info: any) => {
      console.log(info);
    });

    // // Subscribe to provider disconnection
    // window.ethereum?.on?.("disconnect", (error: { code: number; message: string }) => {
    //   console.log(error);
    // });
  }, []);

  return (
    <Modal visible={visible} width={440} onCancel={onCancel?.bind(null, false)}>
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
              terms: <a css={{ fontWeight: 600 }}>{intl.formatMessage({ defaultMessage: "Terms of Service" })}</a>,
              privacy: <a css={{ fontWeight: 600 }}>{intl.formatMessage({ defaultMessage: "Privacy Policy" })}</a>
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
      </section>
    </Modal>
  );
});

export default injectIntl(ConnectWalletModal);
