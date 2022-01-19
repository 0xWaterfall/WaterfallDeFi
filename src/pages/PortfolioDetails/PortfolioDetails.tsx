/** @jsxImportSource @emotion/react */

import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import ContentCD from "./components/ContentCD";
import Charts from "./components/Charts";
import Information from "./components/Information";
import styled from "@emotion/styled";
import { useSelectedMarket } from "hooks/useSelectors";
import useScrollTop from "hooks/useScrollTop";

const PortfolioDetailsWrapper = styled.div`
  padding: 64px 24px;
  max-width: 1248px;
  margin: 0 auto;
  min-height: 100vh;
`;

type TProps = WrappedComponentProps;

const PortfolioDetails = memo<TProps>(() => {
  useScrollTop();
  const market = useSelectedMarket();
  const [selectedDepositAsset, setSelectedDepositAsset] = useState<string>("BUSD");
  return (
    <PortfolioDetailsWrapper>
      {market && (
        <>
          <Information
            data={market}
            selectedDepositAsset={selectedDepositAsset}
            setSelectedDepositAsset={setSelectedDepositAsset}
          />
          <Charts data={market} selectedDepositAsset={selectedDepositAsset} />
          <ContentCD
            data={market}
            selectedDepositAsset={selectedDepositAsset}
            setSelectedDepositAsset={setSelectedDepositAsset}
          />
        </>
      )}
    </PortfolioDetailsWrapper>
  );
});

export default injectIntl(PortfolioDetails);
