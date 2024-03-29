/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";
import Tooltip from "components/Tooltip/Tooltip";
import { Union, WTFToken } from "assets/images";
import { Market, PORTFOLIO_STATUS } from "types";
import { formatAllocPoint, formatNumberSeparator, getLockupPeriod, getWTFApr } from "utils/formatNumbers";
import { useWTF } from "hooks";
import Coin from "components/Coin";
import Countdown from "react-countdown";
import { useWTFPriceLP } from "hooks/useWTFfromLP";
import { useDispatch } from "react-redux";
import { setMarketKey } from "store/selectedKeys";

type TProps = WrappedComponentProps & {
  data: Market;
  selectId: number;
};

const Container = styled.div`
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.header)};
  border: 3px solid ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, "#13132C")};
  box-sizing: border-box;
  box-shadow: 0px 0px 10px ${({ theme }) => theme.shadow.marketItem};
  border-radius: 12px;
  padding: 20px 0px 40px 0px;
  margin-bottom: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 0 20px;
  margin-bottom: 20px;
  & button {
    width: 100%;
  }
  @media screen and (min-width: 1024px) {
    & button {
      max-width: 300px;
    }
  }
`;
const RowDiv = styled.div`
  padding: 5px 20px;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  & > div:nth-of-type(2) {
    font-size: 14px;
    line-height: 19px;
    text-align: right;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  }
  & svg {
    margin-left: 10px;
    width: 13px;
    height: 13px;
  }
  :nth-of-type(4) {
    background-color: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, "#13132C")};
  }
`;
const APYStyled2 = styled.div`
  display: flex;
  font-size: 12px;
  margin-bottom: 10px;
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
const NextTime = styled.div`
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary.deep};
  justify-content: center;
`;

const MarketItem = memo<TProps>(({ intl, data, selectId }) => {
  const { warn, green, primary } = useTheme();
  const { push } = useHistory();
  const [marketData, setMarketData] = useState<Market>(data);
  // const wtfPrice = useWTFPrice();
  const { price: wtfPrice } = useWTFPriceLP();

  const { weekDistribution } = useWTF();
  // const isHide = weekDistribution.toString() !== "0" ? false : true;
  const isHide = data.rewardPerBlock !== "0" ? false : true;
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const _md = await useMarket({ ...data });
  //     if (_md) setMarketData(_md);
  //   };
  //   fetchData();
  // }, []);

  const tranchesDisplayText = data.trancheCount === 3 ? ["Senior", "Mezzanine", "Junior"] : ["Fixed", "Variable"];
  const tranchesDisplayColor = [warn.normal, data.trancheCount === 3 ? green.normal : primary.deep, primary.deep];
  const dispatch = useDispatch();

  const navigateMarketDetail = () => {
    dispatch(setMarketKey(selectId.toString()));
    push({ pathname: "/portfolio-details" });
  };

  const getMarketStatusTag = () => {
    if (marketData?.isRetired) return <Tag color="red" value={"Expired"} />;
    if (marketData.status === PORTFOLIO_STATUS.PENDING) return <Tag color="yellow" value={"Pending"} />;
    if (marketData.status === PORTFOLIO_STATUS.ACTIVE) return <Tag color="green" value={"Active"} />;
  };
  return (
    <Container>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Portfolio" })}</div>
        <div>{marketData.portfolio}</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Asset" })}</div>
        <div style={{ display: "flex" }}>
          {marketData.assets.map((coin, i) => (
            <div key={i} style={{ paddingRight: "5px" }}>
              <Coin size={18} assetName={coin} />
            </div>
          ))}
          {marketData.assets.map((coin, i) => (i === marketData.assets.length - 1 ? coin + "" : coin + " / "))}
        </div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Lock-up period" })}</div>
        <div>{marketData.duration ? getLockupPeriod(marketData.duration) : "-"}</div>
      </RowDiv>
      <RowDiv>
        <div>
          {intl.formatMessage({ defaultMessage: "Deposit APR" })}
          <Tooltip
            overlay={
              <React.Fragment>
                <p>
                  All position holders can get different proportions of rewards according to different tranche. Senior:{" "}
                  {formatAllocPoint(marketData?.pools[0], marketData?.totalAllocPoints)}% of total WTF Mezzanine:{" "}
                  {formatAllocPoint(marketData?.pools[1], marketData?.totalAllocPoints)}% of total WTF Junior:{" "}
                  {formatAllocPoint(marketData?.pools[2], marketData?.totalAllocPoints)}% of total WTF Typography
                </p>
              </React.Fragment>
            }
          >
            <Union />
          </Tooltip>
        </div>
        <div css={{ display: "flex", flexDirection: "column" }}>
          {marketData?.tranches.map((_t, _i) => {
            return (
              // <div css={{ display: "flex" }} key={_i}>
              <APYStyled2 key={_i} style={marketData?.tranches[_i]?.target === "0" ? { visibility: "hidden" } : {}}>
                <span>{tranchesDisplayText[_i]}</span>
                <span css={{ color: tranchesDisplayColor[_i] }}>{_t.apy} %</span>
                {!isHide && (
                  <span>
                    <div>
                      <WTFToken />
                    </div>
                    {getWTFApr(
                      formatAllocPoint(marketData?.pools[_i], marketData?.totalAllocPoints),
                      marketData?.tranches[_i],
                      marketData.duration,
                      marketData.rewardPerBlock,
                      wtfPrice,
                      marketData?.assets
                    )}
                    {" %"}
                  </span>
                )}
              </APYStyled2>
              //{/* {_i !== marketData?.tranches.length - 1 ? <div>&nbsp;→&nbsp;</div> : null} */}
              // </div>
            );
          })}
        </div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "TVL" })}</div>
        <div>
          {marketData.assets[0] !== "WBNB" && marketData.assets[0] !== "WAVAX" ? "$" : ""}
          {formatNumberSeparator(marketData.tvl.includes("e-") ? "0" : marketData.tvl)}
          {marketData.assets[0] === "WBNB" || marketData.assets[0] === "WAVAX" ? " " + marketData.assets[0] : ""}
        </div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Status" })}</div>
        <div>
          {getMarketStatusTag()}
          {/* {marketData.status === PORTFOLIO_STATUS.PENDING ? <Tag color="yellow" value={"Pending"}></Tag> : null}
          {marketData.status === PORTFOLIO_STATUS.ACTIVE ? <Tag color="green" value={"Active"}></Tag> : null} */}
        </div>
      </RowDiv>

      <ButtonDiv>
        <Button type="primary" onClick={navigateMarketDetail}>
          {marketData.status !== PORTFOLIO_STATUS.PENDING || marketData?.isRetired
            ? intl.formatMessage({ defaultMessage: "More" })
            : intl.formatMessage({ defaultMessage: "Deposit" })}
        </Button>
      </ButtonDiv>
      <NextTime>
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
      </NextTime>
    </Container>
  );
});

export default injectIntl(MarketItem);
