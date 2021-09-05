/** @jsxImportSource @emotion/react */

import { ClassNames, useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import { CaretDown, I18n, Menu, ShortRight, Wallet, WaterFall } from "assets/images";
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
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useAuth from "utils/useAuth";
import { formatAccountAddress } from "utils/formatAddress";
import { languages } from "config";
import Tooltip from "components/Tooltip/Tooltip";

type TProps = WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { gray, primary, white, shadow, warn, fonts } = useTheme();
  const { push } = useHistory();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [isDrawerShow, setDrawerShow] = useState(false);

  const dispatch = useAppDispatch();
  const { locale } = useAppSelector((state) => state.i18n);

  const headerLeftRef = useRef<HTMLDivElement>(null);
  const headerRightRef = useRef<HTMLDivElement>(null);
  const [clientWidth, setClientWidth] = useState(0);
  const { width } = useSize(document.body);

  const { active, account, chainId, ...p } = useWeb3React<Web3Provider>();
  const { login } = useAuth();

  useEffect(() => {
    setClientWidth((headerLeftRef.current?.clientWidth ?? 0) + (headerRightRef.current?.clientWidth ?? 0));
  }, []);

  useEffect(() => {
    login();
  }, []);

  const MENU = [
    { pathname: "/", text: intl.formatMessage({ defaultMessage: "Dashboard" }), checked: ["/"] },
    {
      pathname: "/portfolio",
      text: intl.formatMessage({ defaultMessage: "Portfolio" }),
      checked: ["/portfolio/markets", "/portfolio/myPortfolio", "/portfolioDetails"],
      subMenu: [
        {
          pathname: "/portfolio/markets",
          text: intl.formatMessage({ defaultMessage: "Markets" })
        },
        {
          pathname: "/portfolio/myPortfolio",
          text: intl.formatMessage({ defaultMessage: "My Portfolio" })
        }
      ]
    },
    { pathname: "/staking", text: intl.formatMessage({ defaultMessage: "Staking" }), checked: ["/staking"] }
  ];

  const isPc = useMemo(() => {
    return width && width > clientWidth + 96;
  }, [width, clientWidth]);

  const I18nElement = useMemo(
    () => (
      <>
        {languages
          ?.filter((p) => p.code !== locale)
          ?.map((l) => (
            <li
              key={l.code}
              css={{
                width: 140,
                height: 32,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                color: gray.normal7,
                ":hover": { backgroundColor: primary.lightBrown }
              }}
              onClick={() => dispatch(fetchI18nMiddleware(l.code))}
            >
              {l.name}
            </li>
          ))}
      </>
    ),
    [locale]
  );

  const WaterFallDeFi = (
    <WaterFall
      css={{ cursor: "pointer" }}
      onClick={() => {
        push({ pathname: "/" });
      }}
    />
  );

  const MetaMaskElement = useMemo(() => {
    if (!active) {
      return (
        <Button type="primary" onClick={setVisible.bind(null, true)}>
          {intl.formatMessage({ defaultMessage: "Connect wallet" })}
        </Button>
      );
    }
    if (chainId?.toString() !== process.env.REACT_APP_CHAIN_ID) {
      return <Button type="warn">{intl.formatMessage({ defaultMessage: "Wrong Network" })}</Button>;
    }
    return (
      <div css={{ display: "flex", alignItems: "center" }}>
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
            transform: "translateX(10px)",
            whiteSpace: "normal"
          }}
        >
          BSC Testnet
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
          <span>{formatAccountAddress(account)}</span>
          <Wallet css={{ marginLeft: 10 }} />
        </div>
      </div>
    );
  }, [account, active, chainId]);

  const MenuLink = useMemo(
    () =>
      MENU.map(({ pathname, text, checked, subMenu }) => (
        <div
          key={pathname}
          css={{
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            position: "relative",
            ...(isPc ? { marginLeft: 36, height: "100%" } : { padding: "12px 20px" }),
            ":hover": {
              "&>div": {
                display: "block"
              }
            }
          }}
        >
          <Link
            to={pathname}
            css={{
              display: "flex",
              alignItems: "center",
              color: checked.includes(location.pathname) ? primary.deep : gray.normal7,
              ":hover": {
                "&>svg": {
                  transform: "rotate(180deg)"
                }
              }
            }}
          >
            {text} {Boolean(subMenu) && <CaretDown css={{ transition: "transform .2s" }} />}
          </Link>
          {Boolean(subMenu) && (
            <div
              css={{
                minWidth: 250,
                position: "absolute",
                zIndex: 1,
                bottom: 0,
                left: 0,
                padding: 20,
                background: white.normal,
                borderRadius: 12,
                transform: isPc ? "translate(-20%,100%)" : "translate(0,100%)",
                filter: "drop-shadow(0px 4px 20px rgba(0, 108, 253, 0.04))",
                display: "none",
                fontFamily: fonts.IBMPlexSans
              }}
            >
              {subMenu?.map((r) => (
                <Link
                  key={r.pathname}
                  css={{
                    fontWeight: 500,
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: gray.normal85,
                    height: 52,
                    padding: "0 20px",
                    borderRadius: 10,
                    ":hover": {
                      background: primary.deep04,
                      color: primary.normal,
                      fontWeight: 700,
                      svg: {
                        display: "block"
                      }
                    }
                  }}
                  to={r.pathname}
                >
                  <div css={{ display: "flex", alignItems: "center" }}>
                    <div
                      css={{ width: 6, height: 6, borderRadius: "50%", background: primary.normal, marginRight: 8 }}
                    />
                    {r.text}
                  </div>
                  <ShortRight css={{ display: "none" }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )),
    [isPc, location.pathname]
  );

  const ConfigElement = (
    <div css={{ display: "flex", flexDirection: "row" }}>
      <ClassNames>
        {({ css }) => (
          <Tooltip
            overlay={I18nElement}
            openClassName={css({ color: gray.normal85 })}
            overlayInnerStyle={{ padding: "4px 0" }}
          >
            <I18n css={{ color: gray.normal5, display: "block", marginLeft: 24, cursor: "pointer" }} />
          </Tooltip>
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
