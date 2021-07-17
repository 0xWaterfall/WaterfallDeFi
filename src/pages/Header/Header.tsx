/** @jsxImportSource @emotion/react */

import { ClassNames, useTheme } from "@emotion/react";
import { I18n, WaterFall } from "assets/images";
import Button from "components/Button/Button";
import Dropdown from "components/Dropdown/Dropdown";
import React, { memo } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store";
import { fetchI18nMiddleware, setI18n } from "store/i18n";
import ConnectWalletModal from "./components/ConnectWalletModal";

type TProps = WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { gray, primary, white, shadow, warn } = useTheme();
  const { push } = useHistory();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const dispatch = useAppDispatch();
  const { locale, languages } = useAppSelector((state) => state.i18n);

  const MENU = [
    { pathname: "/", text: intl.formatMessage({ defaultMessage: "Dashboard" }) },
    { pathname: "/portfolio", text: intl.formatMessage({ defaultMessage: "Portfolio" }) },
    { pathname: "/staking", text: intl.formatMessage({ defaultMessage: "Staking" }) }
  ];

  const I18nElement = useMemo(
    () => (
      <ul css={{ cursor: "pointer", boxShadow: shadow.primary, borderRadius: 4, marginTop: 10, padding: "4px 0" }}>
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
        <Button type="primary" onClick={setVisible.bind(null, true)}>
          {intl.formatMessage({ defaultMessage: "Connect wallet" })}
        </Button>
        <Button type="warn">{intl.formatMessage({ defaultMessage: "Wrong Network" })}</Button>
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
        </div>
        <div css={{ display: "flex", flexDirection: "row" }}>
          <ClassNames>
            {({ css }) => (
              <Dropdown overlay={I18nElement} openClassName={css({ color: gray.normal85 })}>
                <I18n css={{ color: gray.normal5, display: "block", marginLeft: 24, cursor: "pointer" }} />
              </Dropdown>
            )}
          </ClassNames>
        </div>
      </div>
      {visible && <ConnectWalletModal visible={visible} onCancel={setVisible} />}
    </div>
  );
});

export default injectIntl(Header);
