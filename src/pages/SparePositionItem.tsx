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
import { formatNumberDisplay, formatNumberWithDecimalsDisplay, formatTimestamp } from "utils/formatNumbers";
import BigNumber from "bignumber.js";
import { TrancheCycle } from "types";
import Tag from "components/Tag/Tag";
import { useHistoryQuery } from "pages/PortfolioDetails/hooks/useSubgraph";
import NoData from "components/NoData/NoData";
import { IType } from "./Portfolio/components/MyPortfolio/type";
import SparePositionFold from "./SparePositionFold";

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
  & > div {
    display: grid;
    gap: 7px;
    grid-auto-flow: row;
    font-size: 12px;
    section {
      width: 120px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      title {
        color: ${({ theme }) => theme.gray.normal5};
      }
      span {
        color: ${({ theme }) => theme.gray.normal85};
      }
      p {
        font-weight: 500;
      }
    }
  }
`;

const TableRowWrapper = styled(TableRow)`
  color: ${({ theme }) => theme.gray.normal85};
  font-size: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.primary.lightBrown};
  @media screen and (max-width: 768px) {
    padding: 26px 20px;
    border: 1px solid ${({ theme }) => theme.primary.lightBrown};
    border-radius: 12px;
  }
`;

const TableColumnWrapper = styled(TableColumn)`
  @media screen and (max-width: 768px) {
    ::before {
      width: 100%;
      color: ${({ theme }) => theme.gray.normal7};
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
      content: "Net APY";
    }
    &:nth-of-type(5)::before {
      content: "Principal";
    }
    &:nth-of-type(6)::before {
      content: "Status";
    }
    &:nth-of-type(7)::before {
      content: "Interest";
    }
    &:nth-of-type(8)::before {
      content: "More";
    }
  }
`;

type TProps = WrappedComponentProps;

const SparePositionItem = memo<TProps>(({ intl }) => {
  const { gray, primary, shadow, linearGradient, white } = useTheme();
  const [isfold, setFold] = useState(false);
  const COLORS: { [key: string]: string } = { Senior: "#FCB500", Mezzanine: "#00A14A", Junior: "#0066FF" };

  return (
    <Wrapper>
      <TableRowWrapper>
        <TableColumnWrapper content={intl.formatMessage({ defaultMessage: "Portfolio Name" })}>
          BUSD Falls
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={60} content={intl.formatMessage({ defaultMessage: "Asset" })}>
          BUSD
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={200} content={intl.formatMessage({ defaultMessage: "Cycle" })}>
          <CycleWrapper>
            <span>2021/09/23 10:00:05</span>
            <span>↓</span>
            <span>2021/09/23 10:54:17</span>
          </CycleWrapper>
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={240} content={intl.formatMessage({ defaultMessage: "Net APY" })}>
          <APRWrapper css={{ color: COLORS.Senior }}>
            <p>Senior</p>
            <div>
              <section>
                <title>Total APR:</title>
                <p>120%</p>
              </section>
              <section>
                <title>Senior APR:</title>
                <span>15%</span>
              </section>
              <section>
                <title>WTF APR:</title>
                <span>105%</span>
              </section>
            </div>
          </APRWrapper>
        </TableColumnWrapper>
        <TableColumnWrapper minWidth={150} content={intl.formatMessage({ defaultMessage: "Principal" })}>
          100,000,000 BUSD
        </TableColumnWrapper>
        <TableColumnWrapper content={intl.formatMessage({ defaultMessage: "Status" })}>
          <Tag color="yellow" value={"Pending"}></Tag>
        </TableColumnWrapper>
        <TableColumnWrapper content={intl.formatMessage({ defaultMessage: "Interest" })}>
          326,999 BUSD
        </TableColumnWrapper>
        <TableColumnWrapper>
          <CaretDownWrapper
            onClick={() => {
              setFold((fold) => !fold);
            }}
          >
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
      {isfold && <SparePositionFold />}
    </Wrapper>
  );
});

export default injectIntl(SparePositionItem);
