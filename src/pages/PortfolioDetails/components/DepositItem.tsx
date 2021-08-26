/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Row, Col } from "antd";
import TranchesCard from "./TranchesCard";
import ApproveCard from "./ApproveCard";
import { useTheme } from "@emotion/react";
import { Market } from "types";
import { useEffect } from "react";
import { useState } from "react";

type TProps = WrappedComponentProps & {
  data: Market;
  isRe?: boolean;
};

type Tranches = "Senior" | "Mezzanine" | "Junior";

const Box2 = styled.div`
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
`;

const DepositItem = memo<TProps>(({ intl, isRe, data }) => {
  const { primary } = useTheme();
  const tranchesDisplayText: Array<Tranches> = ["Senior", "Mezzanine", "Junior"];
  const [marketData, setMarketData] = useState(data);

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gridColumnGap: 24,
        "@media screen and (max-width: 675px)": {
          gridTemplateColumns: "none",
          gridRowGap: 20
        }
      }}
    >
      <div css={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr", gridRowGap: 20 }}>
        {marketData?.tranches.map((_d, _i) => {
          return (
            <TranchesCard
              key={_i}
              type={tranchesDisplayText[_i]}
              pool={data.pools[_i]}
              tranche={data.tranches[_i]}
              totalAllocPoint={data?.totalAllocPoints}
              trancheIndex={_i}
              assets={data.assets}
            />
          );
        })}
      </div>
      <ApproveCard isRe={isRe} />
    </div>
  );
});

export default injectIntl(DepositItem);
