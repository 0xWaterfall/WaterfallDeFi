/** @jsxImportSource @emotion/react */

import React, { memo, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import ContentCD from "./components/ContentCD";
import Charts from "./components/Charts";
import Information from "./components/Information";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Market } from "types";
import { useHistory, useLocation } from "react-router-dom";

const PortfolioDetailsWrapper = styled.div`
  padding: 64px 24px;
  max-width: 1248px;
  margin: 0 auto;
  min-height: 100vh;
`;

type TProps = WrappedComponentProps;

const PortfolioDetails = memo<TProps>(() => {
  const location = useLocation<Market>();
  const { push } = useHistory();

  const data = location.state;
  console.log(data);

  useEffect(() => {
    if (!data) {
      push({ pathname: "/portfolio/" });
    }
  }, []);
  return (
    <PortfolioDetailsWrapper>
      <Information />
      <Charts />
      <ContentCD data={data} />
    </PortfolioDetailsWrapper>
  );
});

export default injectIntl(PortfolioDetails);
