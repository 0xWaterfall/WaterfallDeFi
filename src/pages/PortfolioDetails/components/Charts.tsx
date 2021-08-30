/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useLocation } from "react-router-dom";
import { Market } from "types";
import PortfolioChart from "./PortfolioChart";
import TrancheChart from "./TrancheChart";

const Block = styled.div`
  padding-left: 130px;
  flex: 1;
  display: flex;
  color: ${({ theme }) => theme.gray.normal7};

  @media screen and (max-width: 1024px) {
    background-color: ${({ theme }) => theme.primary.lightBrown};
    padding-left: 0;
    margin: auto;
    margin-bottom: 10px;
    width: 100%;
    padding: 20px;
    border-radius: 12px;

    display: flex;
    justfify-content: space-between;
    & > * {
    }
  }
`;

type TProps = WrappedComponentProps;

const Charts = memo<TProps>(() => {
  const location = useLocation<Market>();
  const data = location.state;
  return (
    <div
      css={{
        display: "flex",
        paddingTop: 62,
        "@media screen and (max-width: 1024px)": {
          paddingTop: 10,
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
