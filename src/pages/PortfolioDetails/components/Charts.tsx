/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import PortfolioChart from "./PortfolioChart";
import TrancheChart from "./TrancheChart";

const Block = styled.div`
  padding-left: 130px;
  flex: 1;
  display: flex;
  color: ${({ theme }) => theme.gray.normal7};
  @media screen and (max-width: 1024px) {
    padding-left: 0;
  }
`;

type TProps = WrappedComponentProps;

const Charts = memo<TProps>(() => {
  return (
    <div
      css={{
        display: "flex",
        paddingTop: 62,
        "@media screen and (max-width: 825px)": {
          flexDirection: "column"
        }
      }}
    >
      <Block>
        <PortfolioChart />
      </Block>
      <Block css={{ paddingTop: 8 }}>
        <TrancheChart />
      </Block>
    </div>
  );
});

export default injectIntl(Charts);
