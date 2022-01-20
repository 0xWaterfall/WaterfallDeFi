/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import TranchesCard from "./TranchesCard";
import ApproveCard from "./ApproveCard";
import { useTheme } from "@emotion/react";
import { Market, PORTFOLIO_STATUS, Tranche } from "types";
import { compareNum, getRemaining, getRemaining2 } from "utils/formatNumbers";
import { useBalance, useMulticurrencyTrancheBalance, useTrancheBalance } from "hooks";

type TProps = WrappedComponentProps & {
  data: Market;
  selectedDepositAsset: string;
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

const DepositItem = memo<TProps>(({ selectedDepositAsset, intl, isRe, data, redepositBalance }) => {
  const { primary } = useTheme();
  const tranchesDisplayText: Array<Tranches> = ["Senior", "Mezzanine", "Junior"];
  const [marketData] = useState(data);

  const [selectTrancheIdx, setSelectTrancheIdx] = useState<number | undefined>(undefined);
  const [selectTranche, setSelectTranche] = useState<Tranche | undefined>(undefined);
  const { balance } = useBalance(
    !data.isMulticurrency
      ? data.depositAssetAddress
      : data.depositAssetAddresses[data.assets.indexOf(selectedDepositAsset)]
  );
  const { balance: balanceRe } = !data.isMulticurrency
    ? useTrancheBalance(data.address)
    : useMulticurrencyTrancheBalance(data.address, data.assets.indexOf(selectedDepositAsset), data.assets.length);
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
                selectedDepositAsset={selectedDepositAsset}
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
        selectedDepositAsset={selectedDepositAsset}
        isRe={isRe}
        assets={data.assets}
        remaining={
          selectTrancheIdx !== undefined
            ? getRemaining(data.tranches[selectTrancheIdx]?.target, data.tranches[selectTrancheIdx]?.principal)
            : "0"
        }
        remainingExact={
          selectTrancheIdx !== undefined
            ? getRemaining2(data.tranches[selectTrancheIdx]?.target, data.tranches[selectTrancheIdx]?.principal)
            : "0"
        }
        enabled={selectTranche !== undefined}
        selectTrancheIdx={selectTrancheIdx}
        myBalance={!isRe ? balance : balanceRe.toString() || ""}
        data={marketData}
        selectTranche={selectTranche}
        isSoldOut={compareNum(selectTranche?.principal, selectTranche?.target) ? true : false}
      />
    </div>
  );
});

export default injectIntl(DepositItem);
