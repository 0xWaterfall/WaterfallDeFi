/** @jsxImportSource @emotion/react */

import { ClassNames, useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import {
  CaretDown,
  DarkIcon,
  I18n,
  LightIcon,
  Menu,
  ShortRight,
  Wallet,
  WaterFall,
  WaterFallDark
} from "assets/images";
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
import { setConnectWalletModalShow } from "store/showStatus";
import styled from "@emotion/styled";
import { colorMode } from "hooks/useColorMode";
import { setTheme } from "store/selectedKeys";

const ThemeIcon = styled.div`
  color: ${({ theme: { useColorModeValue, gray, white } }) => useColorModeValue(gray.normal5, white.normal7)};
  margin-left: 26px;
  svg {
    cursor: pointer;
  }
  :hover {
    color: ${({ theme: { useColorModeValue, gray, white } }) => useColorModeValue(gray.normal7, white.normal5)};
  }
`;

type TProps = WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { gray, primary, white, warn, fonts, shadow, dark, useColorModeValue } = useTheme();
  const { push } = useHistory();
  const location = useLocation();
  const [isDrawerShow, setDrawerShow] = useState(false);

  const dispatch = useAppDispatch();
  const { locale } = useAppSelector((state) => state.i18n);

  const headerLeftRef = useRef<HTMLDivElement>(null);
  const headerRightRef = useRef<HTMLDivElement>(null);
  const [clientWidth, setClientWidth] = useState(0);
  const { width } = useSize(document.body);

  const theme = colorMode();
  const { active, account, chainId } = useWeb3React<Web3Provider>();
  const { login } = useAuth();

  useEffect(() => {
    setClientWidth((headerLeftRef.current?.clientWidth ?? 0) + (headerRightRef.current?.clientWidth ?? 0));
  }, []);

  useEffect(() => {
    login();
  }, []);

  const MENU = [
    { pathname: "/", text: intl.formatMessage({ defaultMessage: "Dashboard" }), checked: undefined },
    {
      pathname: "/portfolio",
      text: intl.formatMessage({ defaultMessage: "Portfolio" }),
      checked: "portfolio",
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
    {
      pathname: "/stake",
      text: intl.formatMessage({ defaultMessage: "Staking" }),
      checked: "stake"
    }
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
          backgroundColor: theme === "dark" ? dark.header : white.normal,
          borderRadius: 4,
          marginTop: 10,
          padding: "4px 0"
        }}
      >
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
                color: theme === "dark" ? white.normal5 : gray.normal7,
                ":hover": { backgroundColor: theme === "dark" ? primary.deep04 : primary.lightBrown }
              }}
              onClick={() => dispatch(fetchI18nMiddleware(l.code))}
            >
              {l.name}
            </li>
          ))}
      </ul>
    ),
    [locale, theme]
  );

  const WaterFallDeFi = useMemo(() => {
    return theme === "dark" ? (
      <WaterFallDark
        css={{ cursor: "pointer" }}
        onClick={() => {
          push({ pathname: "/" });
        }}
      />
    ) : (
      <WaterFall
        css={{ cursor: "pointer" }}
        onClick={() => {
          push({ pathname: "/" });
        }}
      />
    );
  }, [theme]);

  const MetaMaskElement = useMemo(() => {
    if (!active) {
      return (
        <Button
          type="primary"
          onClick={() => {
            dispatch(setConnectWalletModalShow(true));
          }}
        >
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
            backgroundColor: theme === "dark" ? dark.block : gray.light,
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
            backgroundColor: theme === "dark" ? dark.block : white.normal,
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
  }, [account, active, chainId, theme]);

  const MenuLink = MENU.map(({ pathname, text, checked, subMenu }) => (
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
          color: checked
            ? location.pathname.split("/").join().includes(checked)
              ? primary.deep
              : useColorModeValue(gray.normal7, white.normal5)
            : location.pathname === "/"
            ? primary.deep
            : useColorModeValue(gray.normal7, white.normal5),
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
            background: useColorModeValue(white.normal, dark.header),
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
                color: useColorModeValue(gray.normal85, white.normal5),
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
                <div css={{ width: 6, height: 6, borderRadius: "50%", background: primary.normal, marginRight: 8 }} />
                {r.text}
              </div>
              <ShortRight css={{ display: "none" }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  ));

  const ConfigElement = useMemo(() => {
    return (
      <div css={{ display: "flex", flexDirection: "row" }}>
        <ThemeIcon>
          {theme === "dark" ? (
            <LightIcon
              onClick={() => {
                dispatch(setTheme("light"));
              }}
            />
          ) : (
            <DarkIcon
              onClick={() => {
                dispatch(setTheme("dark"));
              }}
            />
          )}
        </ThemeIcon>
        <ClassNames>
          {({ css }) => (
            <Dropdown
              overlay={I18nElement}
              openClassName={css({
                color: theme === "dark" ? white.normal5 : gray.normal85
                // background: theme === "dark" ? dark.header : white.normal
              })}
            >
              <I18n
                css={{
                  color: theme === "dark" ? white.normal7 : gray.normal5,
                  display: "block",
                  marginLeft: 24,
                  cursor: "pointer"
                }}
              />
            </Dropdown>
          )}
        </ClassNames>
      </div>
    );
  }, [theme]);
  return (
    <div
      css={{
        height: 64,
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: useColorModeValue(white.normal, dark.header)
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
            <Menu
              css={{ marginRight: 16, fill: theme === "dark" ? white.normal7 : gray.normal5 }}
              onClick={setDrawerShow.bind(null, true)}
            />
            {/* {WaterFallDeFi} */}
          </div>
          {MetaMaskElement}

          <Drawer placement="left" visible={isDrawerShow} closable={false} onClose={setDrawerShow}>
            <div css={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div css={{ display: "flex", alignItems: "center", height: 64, paddingLeft: 20 }}>
                  <Menu
                    css={{ marginRight: 16, fill: theme === "dark" ? white.normal7 : gray.normal5 }}
                    onClick={setDrawerShow.bind(null, false)}
                  />
                  {WaterFallDeFi}
                </div>
                {MenuLink}
              </div>
              <div css={{ height: 40 }}>{ConfigElement}</div>
            </div>
          </Drawer>
        </React.Fragment>
      )}
      <ConnectWalletModal />
    </div>
  );
});

export default injectIntl(Header);
