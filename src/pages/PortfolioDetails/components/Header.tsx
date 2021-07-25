/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useSize } from "ahooks";
import { ArrowLeft } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Block = styled.div`
  padding: 62px 0 0 143px;
  flex: 1;
  display: flex;
  color: ${({ theme }) => theme.gray.normal7};
`;

type TProps = WrappedComponentProps;

const Header = memo<TProps>(({ intl }) => {
  const { primary, gray } = useTheme();
  const { width } = useSize(document.body);
  return (
    <div
      css={{
        paddingTop: 20
      }}
    >
      <div
        css={{
          display: "flex",
          "@media screen and (max-width: 612px)": {
            justifyContent: "space-between"
          }
        }}
      >
        <ArrowLeft
          css={{
            color: gray.normal7,
            ":hover": { color: primary.deep },
            cursor: "pointer"
          }}
        />
        <div
          css={{
            paddingLeft: 123,
            "@media screen and (max-width: 612px)": {
              paddingLeft: 0,
              paddingRight: 20
            }
          }}
        >
          <h1 css={{ color: primary.deep, fontSize: 36 }}>USDC Falls</h1>
          <div css={{ display: "flex", color: gray.normal7, fontSize: 16, marginTop: 16 }}>
            <span css={{ marginRight: 27 }}>USDC</span>
            <span css={{ marginRight: 15 }}>TVL: 1,000,000 USDC</span>
            <span>14 Days</span>
          </div>
        </div>
      </div>

      <div css={{ display: "flex" }}>
        <Block>
          <div>{intl.formatMessage({ defaultMessage: "Portfolio" })}</div>
        </Block>
        <Block>
          <div>{intl.formatMessage({ defaultMessage: "Tranche" })}</div>
        </Block>
      </div>
    </div>
  );
});

export default injectIntl(Header);
