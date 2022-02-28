/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { Logout, Menu, Wallet, WaterFall, WaterFallDark } from "assets/images";
import Button from "components/Button/Button";
import Drawer from "components/Drawer/Drawer";
import React, { memo, useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAppDispatch } from "store";
import ConnectWalletModal from "./components/ConnectWalletModal";
import useEagerConnect from "hooks/useEagerConnect";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useAuth from "utils/useAuth";
import { formatAccountAddress } from "utils/formatAddress";
import { setConnectWalletModalShow } from "store/showStatus";
import styled from "@emotion/styled";
import ActionIconGroup from "./ActionIconGroup";
import { NETWORK, NETWORKS } from "config";
import { NetworkStatus } from "@apollo/client";

const Wrapper = styled.div`
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.header)};
`;

const WalletWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Network = styled.div`
  padding: 0 16px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.useColorModeValue(theme.gray.light, theme.dark.block)};
  color: #e84142;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  transform: translateX(10px);
  white-space: normal;
`;

const Address = styled.div`
  padding: 0 16px;
  height: 38px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.block)};
  border-width: 2px;
  border-style: solid;
  border-color: ${({ theme }) => theme.primary.light};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary.deep};
  border-radius: 8px;
  transform: translateX(0);
  z-index: 1;
`;

const MenuBlockWrapper = styled.div`
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  @media screen and (max-width: 1024px) {
    padding: 6px 0;
  }
  :hover {
    & > div {
      display: block;
    }
  }
`;

const LinkWrapper = styled(Link)`
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal5)};
  &[data-selected="true"] {
    color: ${({ theme }) => theme.primary.deep};
  }
`;

const PCLeft = styled.div`
  display: grid;
  gap: 36px;
  grid-auto-flow: column;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const MobileLeft = styled.div`
  display: none;
  @media screen and (max-width: 1024px) {
    display: block;
  }
`;

const Right = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
`;

const ActionIconGroupHeader = styled(ActionIconGroup)`
  margin-left: 24px;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;

const ActionIconGroupDrawer = styled(ActionIconGroup)`
  width: fit-content;
  display: none;
  @media screen and (max-width: 500px) {
    display: grid;
  }
`;

const DrawerWrapper = styled.div`
  padding: 0 24px 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  header {
    display: grid;
    align-items: center;
    height: 64px;
    gap: 16px;
    grid-auto-flow: column;
    width: fit-content;
  }
`;
const LogoutWrapper = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-left: 5px;
  > svg {
    width: 20px;
    height: 20px;
    color: #999999;
  }
`;
type TProps = WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { gray, white, colorMode } = useTheme();
  const { push } = useHistory();
  const location = useLocation();
  const [isDrawerShow, setDrawerShow] = useState(false);

  const dispatch = useAppDispatch();

  const { active, account, chainId } = useWeb3React<Web3Provider>();
  const { login, logout } = useAuth();

  useEagerConnect();

  useEffect(() => {
    // login("injected");
  }, []);

  const MENU = [
    { pathname: "/", text: intl.formatMessage({ defaultMessage: "Dashboard" }), checked: undefined },
    {
      pathname: "/portfolio/markets",
      text: intl.formatMessage({ defaultMessage: "Markets" }),
      checked: "/portfolio/markets"
    },
    {
      pathname: "/portfolio/my-portfolio",
      text: intl.formatMessage({ defaultMessage: "My Portfolio" }),
      checked: "/portfolio/my-portfolio"
    },
    {
      pathname: "/stake",
      text: intl.formatMessage({ defaultMessage: "Stake" }),
      checked: "/stake"
    },
    // {
    //   pathname: "/farms",
    //   text: intl.formatMessage({ defaultMessage: "Farm" }),
    //   checked: "/farms"
    // },
    {
      pathname: "https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide",
      text: intl.formatMessage({ defaultMessage: "User Guide" }),
      target: "_blank"
      // checked: ""
    },
    {
      pathname: "https://bnb.waterfalldefi.org",
      text: intl.formatMessage({ defaultMessage: "BNB Falls" }),
      target: "_blank",
      color: "#F0B90B"
      // checked: ""
    }
  ];

  const WaterFallDeFiLogo =
    colorMode === "dark" ? (
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

  const WalletElement = useMemo(() => {
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
      <WalletWrapper>
        <Network>{NETWORK === NETWORKS.MAINNET ? "AVAX" : "AVAX Testnet"}</Network>
        <Address>
          <span>{formatAccountAddress(account)}</span>
          <Wallet css={{ marginLeft: 10 }} />
        </Address>
        <LogoutWrapper onClick={logout}>
          <Logout />
        </LogoutWrapper>
      </WalletWrapper>
    );
  }, [account, active, chainId]);

  const MenuLink = MENU.map(({ pathname, text, target, color }) =>
    target ? (
      <MenuBlockWrapper key={pathname}>
        <LinkWrapper
          to={{ pathname }}
          data-selected={location.pathname === pathname}
          target="_blank"
          style={color ? { color: color } : undefined}
        >
          {text}
        </LinkWrapper>
      </MenuBlockWrapper>
    ) : (
      <MenuBlockWrapper key={pathname}>
        <LinkWrapper to={pathname} data-selected={location.pathname === pathname}>
          {text}
        </LinkWrapper>
      </MenuBlockWrapper>
    )
  );

  return (
    <Wrapper>
      <PCLeft>
        {WaterFallDeFiLogo}
        {MenuLink}
      </PCLeft>
      <MobileLeft>
        <Menu
          css={{ marginRight: 16, fill: colorMode === "dark" ? white.normal7 : gray.normal5 }}
          onClick={setDrawerShow.bind(null, true)}
        />
      </MobileLeft>

      <Right>
        {WalletElement}
        <ActionIconGroupHeader />
      </Right>

      <Drawer placement="left" visible={isDrawerShow} closable={false} onClose={setDrawerShow}>
        <DrawerWrapper>
          <div>
            <header>
              <Menu
                css={{ fill: colorMode === "dark" ? white.normal7 : gray.normal5 }}
                onClick={setDrawerShow.bind(null, false)}
              />
              {WaterFallDeFiLogo}
            </header>
            {MenuLink}
          </div>
          <ActionIconGroupDrawer />
        </DrawerWrapper>
      </Drawer>
      <ConnectWalletModal />
    </Wrapper>
  );
});

export default injectIntl(Header);
