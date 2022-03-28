/** @jsxImportSource @emotion/react */

import { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import ContentCD from "./components/ContentCD";
import Charts from "./components/Charts";
import Information from "./components/Information";
import styled from "@emotion/styled";
import { useSelectedMarket } from "hooks/useSelectors";
import useScrollTop from "hooks/useScrollTop";
import { getAPYHourly } from "services/http";
import { useHistoricalAPY } from "./hooks/useSubgraph";

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
  useEffect(() => {
    market && setSelectedDepositAsset(market.assets[0]);
  }, [market]);
  const [depositMultipleSimultaneous, setDepositMultipleSimultaneous] = useState<boolean>(false);

  const today = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14);

  const [APYData, setAPYData] = useState([]);

  useEffect(() => {
    useHistoricalAPY(twoWeeksAgo.toISOString(), today.toISOString()).then((res) => {
      setAPYData(res);
    });
  }, []);

  return (
    <PortfolioDetailsWrapper>
      {market && (
        <>
          <Information
            data={market}
            selectedDepositAsset={selectedDepositAsset}
            setSelectedDepositAsset={setSelectedDepositAsset}
            depositMultipleSimultaneous={depositMultipleSimultaneous}
            setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
          />
          <Charts
            data={market}
            selectedDepositAsset={selectedDepositAsset}
            depositMultipleSimultaneous={depositMultipleSimultaneous}
            setSelectedDepositAsset={setSelectedDepositAsset}
            setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
            APYData={APYData}
          />
          <ContentCD
            data={market}
            selectedDepositAsset={selectedDepositAsset}
            setSelectedDepositAsset={setSelectedDepositAsset}
            depositMultipleSimultaneous={depositMultipleSimultaneous}
            setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
          />
        </>
      )}
    </PortfolioDetailsWrapper>
  );
});

export default injectIntl(PortfolioDetails);
