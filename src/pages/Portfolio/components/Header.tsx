/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { Forest, Intersect, Star } from "assets/images";
import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Claim from "./Claim";

type TProps = WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { primary } = useTheme();

  return (
    <div css={{ display: "flex", transform: "translate(55px,55px)", color: primary.deep }}>
      <div css={{ display: "flex" }}>
        <Forest />
      </div>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 137,
          marginLeft: 48,
          paddingBottom: 55,
          justifyContent: "space-between"
        }}
      >
        <div css={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 css={{ fontSize: 40, color: primary.deep, marginBottom: 15, position: "relative" }}>
            {intl.formatMessage({ defaultMessage: "Redefining the revenue model" })}
            <Star css={{ position: "absolute", top: 0, right: 0, transform: "translate(35px,-25px)" }} />
          </h1>
          <p css={{ width: 435, textAlign: "center", lineHeight: 1.5 }}>
            {intl.formatMessage({
              defaultMessage: "You can choose the tranche that suits you according to your investment preferences"
            })}
          </p>
        </div>
        <Claim />
      </div>
    </div>
  );
});

export default injectIntl(Header);
