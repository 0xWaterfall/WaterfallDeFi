/** @jsxImportSource @emotion/react */

import { Table, TableColumn, TableHeaderColumn, TableRow } from "components/Table/Table";
import styled from "@emotion/styled";
import { injectIntl, WrappedComponentProps } from "react-intl";
import React, { memo, useState, useEffect } from "react";
import { Star, WTFToken } from "assets/images";
import { Market, PORTFOLIO_STATUS } from "types";
import {
  formatAllocPoint,
  formatAPY,
  formatDisplayTVL,
  formatTVL,
  getJuniorAPY,
  getLockupPeriod,
  getPortfolioTvl
} from "utils/formatNumbers";
import { useTheme } from "@emotion/react";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { useMarket } from "hooks";
import Coin from "components/Coin";
import Countdown from "react-countdown";
import _ from "lodash";
import { useSelectedMarket } from "hooks/useSelectors";
import { setMarketKey } from "store/selectedKeys";
import { useDispatch } from "react-redux";

type TProps = WrappedComponentProps & {
  data: Market;
  selectId: number;
};
const APYStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
// const APYStyled2 = styled.div`
//   display: flex;
//   & > span:nth-of-type(1) {
//     width: 90px;
//   }
// `;
const APYStyled2 = styled.div`
  display: flex;
  font-size: 12px;
  padding-top: 5px;
  padding-bottom: 5px;
  & > span:nth-of-type(1) {
    width: 70px;
    text-align: left;
  }
  & > span:nth-of-type(2) {
    text-align: left;
  }
  & > span {
    min-width: 40px;
    margin-left: 5px;
  }
  & > span:nth-of-type(3) {
    background-color: ${({ theme }) => theme.white.normal};
    border-radius: 4px;
    text-align: center;
    color: ${({ theme }) => theme.primary.light};
    width: 60px;
    margin-left: 0px;
    display: flex;
    justify-content: center;
    & > div {
      display: flex;
      align-items: center;
    }
  }
  & svg {
    margin-left: 0;
  }
`;

const TableRowMarket = styled(TableRow)`
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  border-radius: 12px;
  height: 127px;
  background-color: ${({ theme }) => theme.primary.lightBrown};
`;

const MarketItemTableRow = memo<TProps>(({ intl, selectId, data }) => {
  const [marketData, setMarketData] = useState(data);
  const { warn, green, primary, gray } = useTheme();
  const { push } = useHistory();
  const dispatch = useDispatch();

  const navigateMarketDetail = () => {
    dispatch(setMarketKey(selectId.toString()));
    push({ pathname: "/portfolioDetails" });
  };
  const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];
  const tranchesDisplayColor = [warn.normal, green.normal, primary.deep];
  return (
    <TableRowMarket height={100} css={{ color: gray.normal85, fontSize: 16 }} onClick={navigateMarketDetail}>
      <TableColumn>{marketData.portfolio}</TableColumn>
      <TableColumn minWidth={120}>
        <Coin assetName={marketData.assets} /> {marketData.assets}
      </TableColumn>
      <TableColumn minWidth={140}>{marketData.duration ? getLockupPeriod(marketData.duration) : "-"}</TableColumn>
      <TableColumn minWidth={240} css={{ display: "flex" }}>
        <div css={{ display: "flex", flexDirection: "column" }}>
          {marketData?.tranches.map((_t, _i) => {
            return (
              // <div css={{ display: "flex" }} key={_i}>
              <APYStyled2 key={_i}>
                <span>{tranchesDisplayText[_i]}</span>
                <span css={{ color: tranchesDisplayColor[_i] }}>
                  {_i !== marketData.tranches.length - 1 ? formatAPY(_t.apy) : getJuniorAPY(marketData.tranches)}
                </span>
                <span>
                  <div>
                    <WTFToken />
                  </div>
                  {formatAllocPoint(marketData?.pools[_i], marketData?.totalAllocPoints)}%
                </span>
              </APYStyled2>
              /* {_i !== marketData?.tranches.length - 1 ? <div>&nbsp;→&nbsp;</div> : null} */
              // </div>
            );
          })}
        </div>
      </TableColumn>
      <TableColumn minWidth={160}>
        {formatDisplayTVL(marketData.tvl)} {marketData.assets}
      </TableColumn>
      <TableColumn minWidth={80}>
        {marketData.status === PORTFOLIO_STATUS.PENDING ? <Tag color="yellow" value={"Pending"}></Tag> : null}
        {marketData.status === PORTFOLIO_STATUS.ACTIVE ? <Tag color="green" value={"Active"}></Tag> : null}

        {/* <Tag color="red" value={"Expired"}></Tag> */}
        {/* {i === 2 ? <Tag color="yellow" value={"Pending"}></Tag> : null} */}
        {/* {i === 3 ? <Tag color="green" value={"Active"}></Tag> : null} */}
      </TableColumn>
      <TableColumn minWidth={240}>
        <APYStyled>
          <Button type="primary" onClick={navigateMarketDetail}>
            {marketData.status !== PORTFOLIO_STATUS.PENDING
              ? intl.formatMessage({ defaultMessage: "More" })
              : intl.formatMessage({ defaultMessage: "Deposit" })}
          </Button>
          <span css={{ fontSize: 10, marginTop: 10 }}>
            {marketData.status === PORTFOLIO_STATUS.ACTIVE && marketData.duration && marketData.actualStartAt && (
              <Countdown
                date={(Number(marketData.duration) + Number(marketData.actualStartAt)) * 1000}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  return (
                    <span>
                      {!completed && (
                        <>
                          {days}D {hours}H {minutes}M {seconds}S
                        </>
                      )}
                    </span>
                  );
                }}
              />
            )}
          </span>
        </APYStyled>
      </TableColumn>
    </TableRowMarket>
  );
});
export default injectIntl(MarketItemTableRow);
