/** @jsxImportSource @emotion/react */

// import styled from "@emotion/styled";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import TranchesCard from "./TranchesCard";
import ApproveCard from "./ApproveCard";
// import { useTheme } from "@emotion/react";
import { Market, PORTFOLIO_STATUS, Tranche } from "types";
import { compareNum, getRemaining, getRemainingMulticurrency } from "utils/formatNumbers";
import BigNumber from "bignumber.js";

type TProps = WrappedComponentProps & {
  data: Market;
  selectedDepositAsset: string;
  isRe?: boolean;
  redepositBalance?: string;
  remainingDepositable: BigNumber;
  depositMultipleSimultaneous: boolean;
  remainingDepositableSimul: BigNumber[];
  setSelectedDepositAsset: React.Dispatch<React.SetStateAction<string>>;
  setDepositMultipleSimultaneous: React.Dispatch<React.SetStateAction<boolean>>;
};

type Tranches = "Senior" | "Mezzanine" | "Junior";

type Tranches2 = "Fixed" | "Variable";

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
    remainingDepositableSimul,
    setSelectedDepositAsset,
    setDepositMultipleSimultaneous
  }) => {
    // const { primary } = useTheme();
    const tranchesDisplayText: Array<Tranches> = ["Senior", "Mezzanine", "Junior"];
    const tranchesDisplayText2: Array<Tranches2> = ["Fixed", "Variable"];
    const [marketData] = useState(data);

    const [selectTrancheIdx, setSelectTrancheIdx] = useState<number | undefined>(undefined);
    const [selectTranche, setSelectTranche] = useState<Tranche | undefined>(undefined);

    const { remaining, remainingExact } =
      selectTrancheIdx !== undefined
        ? !data.isMulticurrency
          ? getRemaining(
              data.tranches[selectTrancheIdx]?.target,
              !data.autorollImplemented
                ? data.tranches[selectTrancheIdx]?.principal
                : (
                    Number(data.tranches[selectTrancheIdx]?.principal) +
                    Number(data.tranches[selectTrancheIdx]?.autoPrincipal)
                  ).toString(),
              data.assets[0] === "USDC" ? 6 : 18
            )
          : getRemainingMulticurrency(
              data.tranches[selectTrancheIdx]?.target,
              data.tranches[selectTrancheIdx]?.principal,
              remainingDepositable
            )
        : { remaining: "", remainingExact: "" };

    console.log(remainingDepositable.toString());
    console.log(getRemainingMulticurrency(data.tranches[1]?.target, data.tranches[1]?.principal, remainingDepositable));

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
                  type={data.trancheCount === 3 ? tranchesDisplayText[_i] : tranchesDisplayText2[_i]}
                  allocPoint={data.pools?.[_i]}
                  tranche={data.tranches?.[_i]}
                  totalAllocPoint={data?.totalAllocPoints}
                  trancheIndex={_i}
                  assets={data.assets}
                  selected={selectTrancheIdx === _i}
                  data={data}
                  remaining={
                    !data.isMulticurrency
                      ? getRemaining(
                          data.tranches[_i]?.target,
                          !data.autorollImplemented
                            ? data.tranches[_i]?.principal
                            : (
                                Number(data.tranches[_i]?.principal) + Number(data.tranches[_i]?.autoPrincipal)
                              ).toString(),
                          data.assets[0] === "USDC" ? 6 : 18
                        ).remaining
                      : getRemainingMulticurrency(
                          data.tranches[_i]?.target,
                          data.tranches[_i]?.principal,
                          remainingDepositable
                        ).remaining
                  }
                />
              </div>
            );
          })}
        </div>
        <ApproveCard
          selectedDepositAsset={selectedDepositAsset}
          isRe={isRe}
          remaining={remaining}
          remainingExact={remainingExact}
          remainingSimul={
            selectTrancheIdx !== undefined && data.isMulticurrency
              ? remainingDepositableSimul.map((remainingDepositable) =>
                  getRemainingMulticurrency(
                    data.tranches[selectTrancheIdx]?.target,
                    data.tranches[selectTrancheIdx]?.principal,
                    remainingDepositable
                  )
                )
              : data.assets.map(() => {
                  return { remaining: "", remainingExact: "", depositableOrInTranche: "" };
                })
          }
          enabled={selectTranche !== undefined}
          selectTrancheIdx={selectTrancheIdx}
          data={marketData}
          selectTranche={selectTranche}
          isSoldOut={
            //redundant ternary wrap is to eliminate undefined case
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
          setSelectedDepositAsset={setSelectedDepositAsset}
          setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
        />
      </div>
    );
  }
);

export default injectIntl(DepositItem);
