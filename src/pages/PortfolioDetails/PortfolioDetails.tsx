/** @jsxImportSource @emotion/react */

import { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import ContentCD from "./components/ContentCD";
import Charts from "./components/Charts";
import Information from "./components/Information";
import styled from "@emotion/styled";
import { useNetwork, useSelectedMarket } from "hooks/useSelectors";
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
  const [selectedDepositAssetIndex, setSelectedDepositAssetIndex] = useState<number>(0);
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
            selectedDepositAssetIndex={selectedDepositAssetIndex}
            setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
            depositMultipleSimultaneous={depositMultipleSimultaneous}
            setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
          />
          <Charts
            data={market}
            selectedDepositAssetIndex={selectedDepositAssetIndex}
            depositMultipleSimultaneous={depositMultipleSimultaneous}
            setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
            setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
            APYData={APYData}
          />
          <ContentCD
            data={market}
            selectedDepositAssetIndex={selectedDepositAssetIndex}
            setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
            depositMultipleSimultaneous={depositMultipleSimultaneous}
            setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
          />
        </>
      )}
    </PortfolioDetailsWrapper>
  );
});

export default injectIntl(PortfolioDetails);
