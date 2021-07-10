/** @jsxImportSource @emotion/react */

import { WaterFall } from "assets/images";
import Button from "components/Button/Button";
import { useTheme } from "hooks/useTheme";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ConnectWalletModal from "./components/ConnectWalletModal";

type TStateProps = ReturnType<typeof mapStateToProps>;
type TDispatchProps = ReturnType<typeof mapDispatchToProps>;
type TProps = TStateProps & TDispatchProps & WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { gray, primary, white, shadow, warn } = useTheme();
  const { push } = useHistory();
  const location = useLocation();

  const MENU = [
    { pathname: "/", text: intl.formatMessage({ defaultMessage: "Dashboard" }) },
    { pathname: "/portfolio", text: intl.formatMessage({ defaultMessage: "Portfolio" }) },
    { pathname: "/pool", text: intl.formatMessage({ defaultMessage: "Pool" }) },
    { pathname: "/history", text: intl.formatMessage({ defaultMessage: "History" }) }
  ];

  return (
    <div
      css={{
        height: 64,
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: white.normal
      }}
    >
      <div css={{ display: "flex", alignItems: "center", height: "100%" }}>
        <WaterFall
          css={{ cursor: "pointer" }}
          onClick={() => {
            push({ pathname: "/" });
          }}
        />
        {MENU.map(({ pathname, text }) => (
          <section
            key={pathname}
            css={{
              marginLeft: 36,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              height: "100%",
              display: "flex",
              alignItems: "center",
              color: location.pathname === pathname ? primary.normal : gray.normal7
            }}
            onClick={() => {
              push({ pathname });
            }}
          >
            {text}
          </section>
        ))}
      </div>
      <div css={{ display: "flex", flexDirection: "row", alignItems: "center", fontSize: 16, fontWeight: 600 }}>
        <Button type="primary">{intl.formatMessage({ defaultMessage: "Connect wallet" })}</Button>
        <div
          css={{
            padding: "0 16px",
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: shadow.primary,
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
            borderColor: primary.deep2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: shadow.primary,
            color: primary.deep,
            borderRadius: 8,
            transform: "translateX(0)",
            zIndex: 1
          }}
        >
          <span>0x810f...95BB</span>
          <div css={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "#ccc", marginLeft: 10 }}></div>
        </div>
      </div>
      <ConnectWalletModal />
    </div>
  );
});

const mapStateToProps = (state: IState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Header));
