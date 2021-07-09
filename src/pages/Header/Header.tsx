/** @jsxImportSource @emotion/react */

import { WaterFall } from "assets/images";
import { useTheme } from "hooks/useTheme";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

type TStateProps = ReturnType<typeof mapStateToProps>;
type TDispatchProps = ReturnType<typeof mapDispatchToProps>;
type TProps = TStateProps & TDispatchProps & WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { fontBasic, primary, white } = useTheme();
  const { push } = useHistory();
  const location = useLocation();

  const MENU = [
    { pathname: "/dashboard", text: intl.formatMessage({ defaultMessage: "Dashboard" }) },
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
              color: location.pathname === pathname ? primary.normal : fontBasic.normal7
            }}
            onClick={() => {
              push({ pathname });
            }}
          >
            {text}
          </section>
        ))}
      </div>
    </div>
  );
});

const mapStateToProps = (state: IState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Header));
