/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import { Forest, Star } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Claim from "./Claim";

type TProps = WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { primary } = useTheme();
  const { width } = useSize(document.body);
  return (
    <div
      css={{
        display: "flex",
        transform: "translate(55px,55px)",
        color: primary.deep,
        "@media screen and (max-width: 1148px)": {
          transform: "translate(0,0)",
          justifyContent: "center"
        }
      }}
    >
      {Boolean(width && width > 1148) && (
        <div css={{ display: "flex" }}>
          <Forest />
        </div>
      )}
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 137,
          marginLeft: 48,
          paddingBottom: 55,
          justifyContent: "space-between",
          "@media screen and (max-width: 1148px)": {
            margin: "60px 0 20px",
            padding: 0
          },
          "@media screen and (max-width: 512px)": {
            alignItems: "flex-start"
          }
        }}
      >
        <div css={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1
            css={{
              fontSize: 40,
              color: primary.deep,
              marginBottom: 15,
              position: "relative",
              "@media screen and (max-width: 678px)": {
                fontSize: 30
              }
            }}
          >
            {intl.formatMessage({ defaultMessage: "Redefining the revenue model" })}
            <Star css={{ position: "absolute", top: -35, right: -25 }} />
          </h1>
          <p
            css={{
              maxWidth: 435,
              textAlign: "center",
              lineHeight: 1.5,
              "@media screen and (max-width: 512px)": {
                textAlign: "left"
              }
            }}
          >
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
