/** @jsxImportSource @emotion/react */

import { memo, useState } from "react";
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
  const [selectedDepositAsset, setSelectedDepositAsset] = useState<string>(
    market && market.assets.includes("BUSD") ? "BUSD" : "BNB"
  );
  const [depositMultipleSimultaneous, setDepositMultipleSimultaneous] = useState<boolean>(false);
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
