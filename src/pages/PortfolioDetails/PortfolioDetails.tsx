/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import ContentCD from "./components/ContentCD";
import Charts from "./components/Charts";
import Information from "./components/Information";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
type TProps = WrappedComponentProps;

const PortfolioDetails = memo<TProps>(() => {
  const PortfolioDetailsWrapper = styled.div`
    padding: 64px 24px;
    max-width: 1248px;
    margin: 0 auto;
    min-height: 100vh;
  `;
  return (
    <main css={{ minHeight: "100vh" }}>
      <PortfolioDetailsWrapper>
        <Information />
        <Charts />
        <ContentCD />
      </PortfolioDetailsWrapper>
    </main>
  );
});

export default injectIntl(PortfolioDetails);
