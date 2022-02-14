/** @jsxImportSource @emotion/react */

// import styled from "@emotion/styled";
import { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import TranchesCard from "./TranchesCard";
import ApproveCard from "./ApproveCard";
// import { useTheme } from "@emotion/react";
import { Market, PORTFOLIO_STATUS, Tranche } from "types";
import {
  compareNum,
  getRemaining,
  getRemainingExact,
  getRemainingExactMulticurrency,
  getRemainingMulticurrency
} from "utils/formatNumbers";
import BigNumber from "bignumber.js";

type TProps = WrappedComponentProps & {
  data: Market;
  selectedDepositAsset: string;
  isRe?: boolean;
  redepositBalance?: string;
  remainingDepositable: BigNumber;
  depositMultipleSimultaneous: boolean;
  remainingDepositableSimul: BigNumber[];
};

type Tranches = "Senior" | "Mezzanine" | "Junior";

// const Box2 = styled.div`
//   border: ${({ theme }) => theme.table.border};
//   box-sizing: border-box;
//   border-radius: 8px;
//   background: ${({ theme }) => theme.white.normal};
// `;

const DepositItem = memo<TProps>(
  ({
    selectedDepositAsset,
    intl,
    isRe,
    data,
    redepositBalance,
    remainingDepositable,
    depositMultipleSimultaneous,
    remainingDepositableSimul
  }) => {
    // const { primary } = useTheme();
    const tranchesDisplayText: Array<Tranches> = ["Senior", "Mezzanine", "Junior"];
    const [marketData] = useState(data);

    const [selectTrancheIdx, setSelectTrancheIdx] = useState<number | undefined>(undefined);
    const [selectTranche, setSelectTranche] = useState<Tranche | undefined>(undefined);

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
                  remaining={
                    !data.isMulticurrency
                      ? getRemaining(data.tranches[_i]?.target, data.tranches[_i]?.principal)
                      : getRemainingMulticurrency(
                          data.tranches[_i]?.target,
                          data.tranches[_i]?.principal,
                          remainingDepositable
                        )
                  }
                />
              </div>
            );
          })}
        </div>
        <ApproveCard
          selectedDepositAsset={selectedDepositAsset}
          isRe={isRe}
          remaining={
            selectTrancheIdx !== undefined
              ? !data.isMulticurrency
                ? getRemaining(data.tranches[selectTrancheIdx]?.target, data.tranches[selectTrancheIdx]?.principal)
                : getRemainingMulticurrency(
                    data.tranches[selectTrancheIdx]?.target,
                    data.tranches[selectTrancheIdx]?.principal,
                    remainingDepositable
                  )
              : "0"
          }
          remainingExact={
            selectTrancheIdx !== undefined
              ? !data.isMulticurrency
                ? getRemainingExact(data.tranches[selectTrancheIdx]?.target, data.tranches[selectTrancheIdx]?.principal)
                : getRemainingExactMulticurrency(
                    data.tranches[selectTrancheIdx]?.target,
                    data.tranches[selectTrancheIdx]?.principal,
                    remainingDepositable
                  )
              : "0"
          }
          remainingSimul={
            selectTrancheIdx !== undefined && data.isMulticurrency
              ? remainingDepositableSimul.map((remainingDepositable) => {
                  return {
                    remaining: getRemainingMulticurrency(
                      data.tranches[selectTrancheIdx]?.target,
                      data.tranches[selectTrancheIdx]?.principal,
                      remainingDepositable
                    ),
                    remainingExact: getRemainingExactMulticurrency(
                      data.tranches[selectTrancheIdx]?.target,
                      data.tranches[selectTrancheIdx]?.principal,
                      remainingDepositable
                    )
                  };
                })
              : data.assets.map(() => {
                  return { remaining: "", remainingExact: "" };
                })
          }
          enabled={selectTranche !== undefined}
          selectTrancheIdx={selectTrancheIdx}
          data={marketData}
          selectTranche={selectTranche}
          isSoldOut={
            (
              !marketData.autorollImplemented
                ? compareNum(selectTranche?.principal, selectTranche?.target)
                : compareNum(
                    Number(selectTranche?.autoPrincipal) + Number(selectTranche?.principal),
                    selectTranche?.target
                  )
            )
              ? true
              : false
          }
          depositMultipleSimultaneous={depositMultipleSimultaneous}
        />
      </div>
    );
  }
);

export default injectIntl(DepositItem);
