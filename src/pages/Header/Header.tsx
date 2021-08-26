/** @jsxImportSource @emotion/react */

import { ClassNames, useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import { I18n, Menu, WaterFall } from "assets/images";
import Button from "components/Button/Button";
import Drawer from "components/Drawer/Drawer";
import Dropdown from "components/Dropdown/Dropdown";
import React, { memo, useEffect, useRef } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store";
import { fetchI18nMiddleware } from "store/i18n";
import ConnectWalletModal from "./components/ConnectWalletModal";
import { getLibrary } from "utils/web3React";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

type TProps = WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { gray, primary, white, shadow, warn, fonts } = useTheme();
  const { push } = useHistory();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [isDrawerShow, setDrawerShow] = useState(false);

  const dispatch = useAppDispatch();
  const { locale, languages } = useAppSelector((state) => state.i18n);

  const headerLeftRef = useRef<HTMLDivElement>(null);
  const headerRightRef = useRef<HTMLDivElement>(null);
  const [clientWidth, setClientWidth] = useState(0);
  const { width } = useSize(document.body);

  // const library = getLibrary(ethers.providers.Web3Provider);
  // const { account, library } = useWeb3React();
  const { chainId, account, library, activate, active, connector } = useWeb3React<Web3Provider>();
  // console.log(account);
  // console.log(library);

  // if (window.ethereum?.isMetaMask && window.ethereum.request) {
  //   const r = window.ethereum?.request({ method: "eth_requestAccounts" }).then((v) => {
  //     console.log(v);
  //   });
  //   console.log(r);
  // }
  useEffect(() => {
    setClientWidth((headerLeftRef.current?.clientWidth ?? 0) + (headerRightRef.current?.clientWidth ?? 0));
  }, []);

  const MENU = [
    { pathname: "/", text: intl.formatMessage({ defaultMessage: "Dashboard" }), checked: ["/"] },
    {
      pathname: "/portfolio",
      text: intl.formatMessage({ defaultMessage: "Portfolio" }),
      checked: ["/portfolio", "/portfolio/details"]
    },
    { pathname: "/staking", text: intl.formatMessage({ defaultMessage: "Staking" }), checked: ["/staking"] }
  ];

  const isPc = useMemo(() => {
    return width && width > clientWidth + 96;
  }, [width, clientWidth]);

  const I18nElement = useMemo(
    () => (
      <ul
        css={{
          cursor: "pointer",
          boxShadow: shadow.primary,
          backgroundColor: white.normal,
          borderRadius: 4,
          marginTop: 10,
          padding: "4px 0"
        }}
      >
        {languages
          ?.filter((p) => p !== locale)
          ?.map((l) => (
            <li
              key={l}
              css={{
                width: 140,
                height: 32,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                color: gray.normal7,
                ":hover": { backgroundColor: primary.lightBrown }
              }}
              onClick={() => dispatch(fetchI18nMiddleware(l))}
            >
              {l}
            </li>
          ))}
      </ul>
    ),
    [locale, languages]
  );

  const WaterFallDeFi = (
    <WaterFall
      css={{ cursor: "pointer" }}
      onClick={() => {
        push({ pathname: "/" });
      }}
    />
  );

  const MetaMaskElement = useMemo(
    () => (
      <React.Fragment>
        <Button type="primary" onClick={setVisible.bind(null, true)}>
          {intl.formatMessage({ defaultMessage: "Connect wallet" })}
        </Button>
        {/* <Button type="warn">{intl.formatMessage({ defaultMessage: "Wrong Network" })}</Button>
        <div
          css={{
            padding: "0 16px",
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: gray.light,
            color: warn.normal,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            transform: "translateX(10px)"
          }}
        >
          BSC
        </div>
        <div
          css={{
            padding: "0 16px",
            height: 38,
            backgroundColor: white.normal,
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: primary.light,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: primary.deep,
            borderRadius: 8,
            transform: "translateX(0)",
            zIndex: 1
          }}
        >
          <span>0x810f...95BB</span>
          <div css={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "#ccc", marginLeft: 10 }}></div>
        </div> */}
      </React.Fragment>
    ),
    []
  );

  const MenuLink = useMemo(
    () =>
      MENU.map(({ pathname, text, checked }) => (
        <Link
          key={pathname}
          css={{
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: checked.includes(location.pathname) ? primary.deep : gray.normal7,
            ...(isPc ? { marginLeft: 36, height: "100%" } : { padding: "12px 20px" })
          }}
          to={pathname}
        >
          {text}
        </Link>
      )),
    [isPc, location.pathname]
  );

  const ConfigElement = (
    <div css={{ display: "flex", flexDirection: "row" }}>
      <ClassNames>
        {({ css }) => (
          <Dropdown overlay={I18nElement} openClassName={css({ color: gray.normal85 })}>
            <I18n css={{ color: gray.normal5, display: "block", marginLeft: 24, cursor: "pointer" }} />
          </Dropdown>
        )}
      </ClassNames>
    </div>
  );
  return (
    <div
      css={{
        height: 64,
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: white.normal,
        fontFamily: fonts.CarterOne
      }}
    >
      {isPc ? (
        <React.Fragment>
          <div css={{ display: "flex", alignItems: "center", height: "100%" }} ref={headerLeftRef}>
            {WaterFallDeFi}
            {MenuLink}
          </div>
          <div
            css={{ display: "flex", flexDirection: "row", alignItems: "center", fontSize: 16, fontWeight: 600 }}
            ref={headerRightRef}
          >
            {MetaMaskElement}
            {ConfigElement}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div css={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Menu css={{ marginRight: 16 }} onClick={setDrawerShow.bind(null, true)} />
            {/* {WaterFallDeFi} */}
          </div>
          {MetaMaskElement}

          <Drawer placement="left" visible={isDrawerShow} closable={false} onClose={setDrawerShow}>
            <div css={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div css={{ display: "flex", alignItems: "center", height: 64, paddingLeft: 20 }}>
                  <Menu css={{ marginRight: 16 }} onClick={setDrawerShow.bind(null, false)} />
                  {WaterFallDeFi}
                </div>
                {MenuLink}
              </div>
              <div css={{ height: 40 }}>{ConfigElement}</div>
            </div>
          </Drawer>
        </React.Fragment>
      )}
      {visible && <ConnectWalletModal visible={visible} onCancel={setVisible} />}
    </div>
  );
});

export default injectIntl(Header);
