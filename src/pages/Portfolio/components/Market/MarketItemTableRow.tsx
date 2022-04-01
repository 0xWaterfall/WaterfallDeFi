/** @jsxImportSource @emotion/react */

import { TableColumn, TableRow } from "components/Table/Table";
import styled from "@emotion/styled";
import { injectIntl, WrappedComponentProps } from "react-intl";
import React, { memo, useState, useEffect } from "react";
import { Star, Union, WTFToken } from "assets/images";
import { Market, PORTFOLIO_STATUS } from "types";
import { formatAllocPoint, formatNumberSeparator, getLockupPeriod, getWTFApr } from "utils/formatNumbers";
import { useTheme } from "@emotion/react";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";
import { useHistory } from "react-router-dom";
import { useCoingeckoPrices, useWTF } from "hooks";
import Coin from "components/Coin";
import Countdown from "react-countdown";
// import _ from "lodash";
import { setMarketKey } from "store/selectedKeys";
import { useDispatch } from "react-redux";
import { useWTFPriceLP } from "hooks/useWTFfromLP";
import numeral from "numeral";
import { Tooltip } from "antd";

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
  display: flex;
  align-items: center;
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
    display: grid;
    gap: 5px;
    grid-auto-flow: column;
    background-color: ${({ theme }) => theme.white.normal};
    border-radius: 4px;
    padding: 5px;
    text-align: center;
    color: ${({ theme }) => theme.primary.light};
    min-width: 60px;
    margin-left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      display: flex;
      align-items: center;
    }
  }
  & > div > div {
    display: flex;
    align-items: center;
  }
  & svg {
    margin-left: 5px;
  }
`;

const TableRowMarket = styled(TableRow)`
  /* border: 1px solid ${({ theme }) => theme.primary.deep2}; */
  border-radius: 12px;
  height: 127px;
  background-color: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.block)};
`;

const CoinRow = styled.div`
  display: flex;
  justify-content: flex-start;
  transform: translateX(-2.5px);
  margin-bottom: 4px;
  & div:not(:last-child) {
    transform: translateX(2.5px);
  }
`;

const MarketItemTableRow = memo<TProps>(({ intl, selectId, data }) => {
  const [marketData, setMarketData] = useState(data);
  const { warn, green, primary, gray, useColorModeValue, white } = useTheme();
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { weekDistribution } = useWTF();
  const coingeckoPrices = useCoingeckoPrices();
  // const isHide = weekDistribution.toString() !== "0" ? "visible" : "hidden";
  const isHide = data.rewardPerBlock !== "0" ? "visible" : "hidden";

  // const wtfPrice = useWTFPrice();
  const { price: wtfPrice } = useWTFPriceLP();
  const navigateMarketDetail = () => {
    dispatch(setMarketKey(selectId.toString()));
    push({ pathname: "/portfolio-details", state: { id: selectId } });
  };
  const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];
  const tranchesDisplayColor = [warn.normal, green.normal, primary.deep];
  const getMarketStatusTag = () => {
    if (marketData?.isRetired) return <Tag color="red" value={"Expired"} />;
    if (marketData.status === PORTFOLIO_STATUS.PENDING) return <Tag color="yellow" value={"Pending"} />;
    if (marketData.status === PORTFOLIO_STATUS.ACTIVE) return <Tag color="green" value={"Active"} />;
  };
  return (
    <TableRowMarket
      height={100}
      css={{ color: useColorModeValue(gray.normal85, white.normal7), fontSize: 14 }}
      onClick={navigateMarketDetail}
    >
      <TableColumn>{marketData.portfolio}</TableColumn>
      <TableColumn
        minWidth={120}
        css={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "baseline" }}
      >
        <CoinRow css={{ paddingLeft: "45px" }}>
          {marketData.assets.map((coin, i) => (
            <Coin key={i} size={18} assetName={coin} />
          ))}
        </CoinRow>
        <div css={{ paddingLeft: "45px" }}>
          {marketData.assets.map((coin, i) => (
            <span key={i}>{coin + (i === marketData.assets.length - 1 ? "" : " / ")}</span>
          ))}
        </div>
      </TableColumn>
      <TableColumn minWidth={140}>{marketData.duration ? getLockupPeriod(marketData.duration) : "-"}</TableColumn>
      <TableColumn minWidth={240} css={{ display: "flex" }}>
        <div css={{ display: "flex", flexDirection: "column" }}>
          {marketData?.tranches.map((_t, _i) => {
            const wtfAPR = getWTFApr(
              formatAllocPoint(marketData?.pools[_i], marketData?.totalAllocPoints),
              marketData?.tranches[_i],
              marketData.duration,
              marketData.rewardPerBlock,
              wtfPrice,
              marketData?.assets,
              coingeckoPrices
            );
            const trancheAPR = _t.apy;
            const totalAPR =
              wtfAPR !== "0.00" && wtfAPR !== undefined
                ? Number(trancheAPR) + Number(numeral(wtfAPR).value())
                : trancheAPR;
            return (
              // <div css={{ display: "flex" }} key={_i}>
              <APYStyled2 key={_i}>
                <span>{tranchesDisplayText[_i]}</span>
                <div css={{ color: tranchesDisplayColor[_i] }}>
                  <Tooltip
                    overlay={
                      <React.Fragment>
                        <span style={{ display: "flex" }}>
                          <div style={{ width: 100 }}>Total APR:</div>
                          <div css={{ color: tranchesDisplayColor[_i] }}>{numeral(totalAPR).format("0,0.[00]")} %</div>
                        </span>
                        <span style={{ display: "flex" }}>
                          <div style={{ width: 100 }}>{tranchesDisplayText[_i]} APR:</div>
                          {_t.apy} %
                        </span>
                        <span style={{ display: "flex", visibility: isHide }}>
                          <div style={{ width: 100 }}>
                            {/* <WTFToken /> */}
                            WTF APR:
                          </div>
                          {getWTFApr(
                            formatAllocPoint(marketData?.pools[_i], marketData?.totalAllocPoints),
                            marketData?.tranches[_i],
                            marketData.duration,
                            marketData.rewardPerBlock,
                            wtfPrice,
                            marketData?.assets,
                            coingeckoPrices
                          )}
                          {" %"}
                        </span>
                      </React.Fragment>
                    }
                  >
                    <div>
                      {numeral(totalAPR).format("0,0.[00]")} %
                      <Union />
                    </div>
                  </Tooltip>
                </div>
              </APYStyled2>
              /* {_i !== marketData?.tranches.length - 1 ? <div>&nbsp;→&nbsp;</div> : null} */
              // </div>
            );
          })}
        </div>
      </TableColumn>
      <TableColumn minWidth={160}>
        {marketData.assets[0] !== "WBNB" && marketData.assets[0] !== "WAVAX" ? "$" : ""}
        {formatNumberSeparator(marketData.tvl.includes("e-") ? "0" : marketData.tvl)}
        {marketData.assets[0] === "WBNB" || marketData.assets[0] === "WAVAX" ? " " + marketData.assets[0] : ""}
      </TableColumn>
      <TableColumn minWidth={80}>
        {getMarketStatusTag()}

        {/* <Tag color="red" value={"Matured"}></Tag> */}
        {/* {i === 2 ? <Tag color="yellow" value={"Pending"}></Tag> : null} */}
        {/* {i === 3 ? <Tag color="green" value={"Active"}></Tag> : null} */}
      </TableColumn>
      <TableColumn>
        <APYStyled>
          <Button type="primary" onClick={navigateMarketDetail}>
            {marketData.status !== PORTFOLIO_STATUS.PENDING || marketData?.isRetired
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
