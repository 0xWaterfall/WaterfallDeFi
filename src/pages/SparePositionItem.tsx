/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useMemo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "components/Button/Button";
import { useState } from "react";
import Select, { Option } from "components/Select/Select";
import { Table, TableColumn, TableHeaderColumn, TableRow } from "components/Table/Table";
import { CaretDown, Union } from "assets/images";
import Tooltip from "components/Tooltip/Tooltip";
import styled from "@emotion/styled";
import { useSize } from "ahooks";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { MarketList } from "config/market";
import {
  formatAllocPoint,
  formatNumberDisplay,
  formatNumberWithDecimalsDisplay,
  formatTimestamp,
  getWTFApr
} from "utils/formatNumbers";
import BigNumber from "bignumber.js";
import { Market, PORTFOLIO_STATUS, TrancheCycle, UserInvest } from "types";
import Tag from "components/Tag/Tag";
import NoData from "components/NoData/NoData";
import { IType } from "./Portfolio/components/MyPortfolio/type";
import SparePositionFold from "./SparePositionFold";
import { usePendingWTFReward, useWTFPrice } from "hooks/useSelectors";
import numeral from "numeral";
import { dataTool } from "echarts/core";
import useInvest from "./PortfolioDetails/hooks/useInvest";
import { BIG_TEN } from "utils/bigNumber";
import { useWTFPriceLP } from "hooks/useWTFfromLP";
import { useEstimateYield } from "hooks/useEstimateYield";

const Wrapper = styled.div``;

const CaretDownWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.primary.deep2};
  color: ${({ theme }) => theme.primary.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const CycleWrapper = styled.div`
  display: grid;
  gap: 5px;
  grid-auto-flow: row;
  justify-items: center;
  span {
    white-space: nowrap;
  }
`;

const APRWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-auto-flow: column;
  h1 {
    font-weight: 500;
  }
  & > p {
    width: 70px;
  }
  & > div {
    display: grid;
    gap: 7px;
    grid-auto-flow: row;
    font-size: 12px;
    section {
      display: flex;
      align-items: center;
      title {
        color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
      }
      span {
        color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal7)};
      }
      p {
        font-weight: 500;
      }
    }
  }
`;

const TableRowWrapper = styled(TableRow)`
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.primary.deep2)};
  cursor: pointer;
  @media screen and (max-width: 768px) {
    padding: 26px 20px;
    border: 1px solid ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.primary.deep2)};
    border-radius: 12px;
  }
`;

const TableColumnWrapper = styled(TableColumn)`
  @media screen and (max-width: 768px) {
    ::before {
      width: 100%;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    }
    &:nth-of-type(1)::before {
      content: "Portfolio Name";
    }
    &:nth-of-type(2)::before {
      content: "Asset";
    }
    &:nth-of-type(3)::before {
      content: "Cycle";
    }
    &:nth-of-type(4)::before {
      content: "Tranche";
    }
    &:nth-of-type(5)::before {
      content: "Expected APR";
    }
    &:nth-of-type(6)::before {
      content: "Principal";
    }
    &:nth-of-type(7)::before {
      content: "Status";
    }
    &:nth-of-type(8)::before {
      content: "Yield";
    }
    &:nth-of-type(9)::before {
      content: "More";
    }
  }
`;

type TProps = WrappedComponentProps & {
  userInvest: UserInvest;
  market: Market;
  trancheCycle: TrancheCycle;
  redeemDirect: (i: number) => Promise<void>;
  redeemLoading: boolean;
};

const SparePositionItem = memo<TProps>(({ intl, market, userInvest, trancheCycle, redeemLoading, redeemDirect }) => {
  const { gray, primary, shadow, linearGradient, white } = useTheme();
  const [isfold, setFold] = useState(false);
  const COLORS: { [key: string]: string } = { Senior: "#FCB500", Mezzanine: "#00A14A", Junior: "#0066FF" };
  // const wtfPrice = useWTFPrice();
  const { price: wtfPrice } = useWTFPriceLP();
  const { tranchesPendingReward } = usePendingWTFReward();
  let totalAmount = userInvest.principal;
  if (userInvest.capital !== "0") totalAmount = new BigNumber(userInvest.capital).toFormat(4).toString();

  const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];
  const isCurrentCycle = market && market?.cycle !== undefined && market?.cycle === userInvest.cycle.toString();
  const trancheAPY = market && isCurrentCycle ? market?.tranches[userInvest.tranche].apy : userInvest.earningsAPY;
  const isActiveCycle = Number(market.cycle) === trancheCycle?.cycle && trancheCycle?.state === 1;
  const estimateYield = useEstimateYield(userInvest.principal, trancheAPY, trancheCycle?.startAt, isActiveCycle);

  const wtfAPY =
    market && isCurrentCycle
      ? getWTFApr(
          formatAllocPoint(market?.pools[userInvest.tranche], market?.totalAllocPoints),
          market?.tranches[userInvest.tranche],
          market?.duration,
          market?.rewardPerBlock,
          wtfPrice
        )
      : "-";

  const netAPY = wtfAPY !== "-" ? Number(trancheAPY) + Number(numeral(wtfAPY).value()) : trancheAPY;

  return (
    <Wrapper>
      <TableRowWrapper
        onClick={() => {
          setFold((fold) => !fold);
        }}
      >
        <TableColumnWrapper content={intl.formatMessage({ defaultMessage: "Portfolio Name" })}>
          {market?.portfolio}
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={60} content={intl.formatMessage({ defaultMessage: "Asset" })}>
          {market?.assets}
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={200} content={intl.formatMessage({ defaultMessage: "Cycle" })}>
          <CycleWrapper>
            {trancheCycle && trancheCycle?.state !== 0 ? (
              <>
                <span>{formatTimestamp(trancheCycle?.startAt)}</span>
                <span>↓</span>
                <span>{formatTimestamp(trancheCycle?.endAt)}</span>
              </>
            ) : (
              "--"
            )}
          </CycleWrapper>
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={80} content={intl.formatMessage({ defaultMessage: "Tranche" })}>
          <div css={{ color: COLORS[tranchesDisplayText[userInvest.tranche]] }}>
            {tranchesDisplayText[userInvest.tranche]}
          </div>
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={160} content={intl.formatMessage({ defaultMessage: "Expected APR" })}>
          <APRWrapper css={{ color: COLORS[tranchesDisplayText[userInvest.tranche]] }}>
            <div>
              <section>
                <title>Total APR:</title>&nbsp;
                <p>{netAPY} %</p>
              </section>
              <section>
                <title>{tranchesDisplayText[userInvest.tranche]} APR:</title>&nbsp;
                <span>{trancheAPY} %</span>
              </section>
              <section>
                <title>WTF APR:</title>&nbsp;
                <span>{wtfAPY !== "-" ? wtfAPY + " %" : intl.formatMessage({ defaultMessage: "Unavailable" })}</span>
              </section>
            </div>
          </APRWrapper>
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={150} content={intl.formatMessage({ defaultMessage: "Principal" })}>
          {userInvest.principal} {market?.assets}
        </TableColumnWrapper>
        <TableColumnWrapper content={intl.formatMessage({ defaultMessage: "Status" })}>
          {trancheCycle?.state === 0 && <Tag color="yellow" value="Pending"></Tag>}
          {!trancheCycle && market.status === PORTFOLIO_STATUS.PENDING && <Tag color="yellow" value="Pending"></Tag>}
          {Number(market.cycle) === trancheCycle?.cycle && trancheCycle?.state === 1 && (
            <Tag color="green" value="Active"></Tag>
          )}
          {/* subgraph delay */}
          {Number(market.cycle) !== trancheCycle?.cycle && trancheCycle?.state === 1 && (
            <Tag color="red" value="Matured"></Tag>
          )}
          {trancheCycle?.state === 2 && <Tag color="red" value="Matured"></Tag>}
        </TableColumnWrapper>
        <TableColumnWrapper content={intl.formatMessage({ defaultMessage: "Yield" })}>
          {trancheCycle?.state !== 2 && estimateYield}
          {trancheCycle?.state === 2 && userInvest.interest} {market?.assets}
          {/* {trancheCycle?.rate} */}
        </TableColumnWrapper>
        <TableColumnWrapper>
          <CaretDownWrapper>
            <CaretDown
              css={{
                transition: "transform 0.3s",
                transform: "rotate(0)",
                ...(isfold ? { transform: "rotate(180deg)" } : {})
              }}
            />
          </CaretDownWrapper>
        </TableColumnWrapper>
      </TableRowWrapper>
      {isfold && (
        <SparePositionFold
          totalAmount={totalAmount}
          assets={market?.assets}
          isCurrentCycle={isCurrentCycle}
          redeemDirect={redeemDirect}
          redeemLoading={redeemLoading}
          currentTranche={userInvest.tranche}
          isPending={trancheCycle?.state === 0}
          isActive={trancheCycle?.state === 1}
          tranchesPendingReward={tranchesPendingReward[userInvest.tranche]}
          fee={market.tranches[userInvest.tranche].fee}
        />
      )}
    </Wrapper>
  );
});

export default injectIntl(SparePositionItem);
