/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Row, Col } from "antd";
import TranchesCard from "./TranchesCard";
import ApproveCard from "./ApproveCard";
import { useTheme } from "@emotion/react";
import { Market, PORTFOLIO_STATUS, Tranche } from "types";
import { useEffect } from "react";
import { useState } from "react";
import { useSize } from "ahooks";
import { compareNum, formatTVL, getRemaining } from "utils/formatNumbers";
import { useBalance } from "hooks";

type TProps = WrappedComponentProps & {
  data: Market;
  isRe?: boolean;
  redepositBalance?: string;
};

type Tranches = "Senior" | "Mezzanine" | "Junior";

const Box2 = styled.div`
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
`;

const DepositItem = memo<TProps>(({ intl, isRe, data, redepositBalance }) => {
  const { primary } = useTheme();
  const tranchesDisplayText: Array<Tranches> = ["Senior", "Mezzanine", "Junior"];
  const [marketData, setMarketData] = useState(data);
  const [selectTrancheIdx, setSelectTrancheIdx] = useState<number | undefined>(undefined);
  const [selectTranche, setSelectTranche] = useState<Tranche | undefined>(undefined);
  const { balance } = useBalance(data.depositAssetAddress);
  // const myBalance = "0";
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
            <div
              key={_i}
              onClick={() => {
                if (data.status === PORTFOLIO_STATUS.PENDING) {
                  // if (selectTranche) {
                  //   setSelectTrancheIdx(undefined);
                  //   setSelectTranche(undefined);
                  // } else {

                  // }
                  //not sold out
                  if (!compareNum(_d.principal, _d.target)) {
                    setSelectTrancheIdx(_i);
                    setSelectTranche({ ..._d });
                  }
                }
              }}
            >
              <TranchesCard
                key={_i}
                type={tranchesDisplayText[_i]}
                allocPoint={data.pools?.[_i]}
                tranche={data.tranches?.[_i]}
                totalAllocPoint={data?.totalAllocPoints}
                trancheIndex={_i}
                assets={data.assets}
                selected={selectTrancheIdx === _i}
                data={data}
              />
            </div>
          );
        })}
      </div>
      <ApproveCard
        isRe={isRe}
        assets={data.assets}
        remaining={
          selectTrancheIdx !== undefined
            ? getRemaining(data.tranches[selectTrancheIdx]?.target, data.tranches[selectTrancheIdx]?.principal)
            : "0"
        }
        enabled={selectTranche !== undefined}
        selectTrancheIdx={selectTrancheIdx}
        myBalance={!isRe ? balance : redepositBalance || ""}
        data={marketData}
        selectTranche={selectTranche}
        isSoldOut={compareNum(selectTranche?.principal, selectTranche?.target) ? true : false}
      />
    </div>
  );
});

export default injectIntl(DepositItem);
