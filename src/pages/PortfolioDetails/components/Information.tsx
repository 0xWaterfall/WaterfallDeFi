/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import { ArrowLeft } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";

type TProps = WrappedComponentProps;

const Information = memo<TProps>(({ intl }) => {
  const { primary, gray } = useTheme();
  const { width } = useSize(document.body);
  const { goBack } = useHistory();

  return (
    <div
      css={{
        paddingTop: 20,
        display: "flex"
      }}
    >
      <div
        css={{
          flex: 1,
          position: "relative",
          "@media screen and (max-width: 500px)": {
            display: "flex",
            justifyContent: "center"
          }
        }}
      >
        <ArrowLeft
          css={{
            position: "absolute",
            left: 0,
            top: 5,
            color: gray.normal7,
            ":hover": { color: primary.deep },
            cursor: "pointer"
          }}
          onClick={goBack}
        />
        <div
          css={{
            paddingLeft: 130,
            "@media screen and (max-width: 500px)": {
              paddingLeft: 0
            }
          }}
        >
          <h1 css={{ color: primary.deep, fontSize: 36 }}>USDC Falls</h1>
          <div
            css={{
              display: "flex",
              color: gray.normal7,
              fontSize: 16,
              marginTop: 16,
              "@media screen and (max-width: 500px)": {
                flexDirection: "column",
                lineHeight: 1.5
              }
            }}
          >
            <span css={{ marginRight: 27 }}>USDC</span>
            <span css={{ marginRight: 15 }}>TVL: 1,000,000 USDC</span>
            <span>14 Days</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default injectIntl(Information);
