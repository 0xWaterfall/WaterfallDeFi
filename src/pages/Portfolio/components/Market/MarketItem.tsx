/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { memo, useState, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";
import Tooltip from "components/Tooltip/Tooltip";
import { Union, WTFToken } from "assets/images";
import { Market, PORTFOLIO_STATUS } from "types";
import { formatAllocPoint, formatAPY, getLockupPeriod } from "utils/formatNumbers";
import { useMarket } from "hooks";
import Coin from "components/Coin";
import Column from "antd/lib/table/Column";

type TProps = WrappedComponentProps & {
  data: Market;
};

const Container = styled.div`
  background: ${({ theme }) => theme.white.normal};
  border: 1px solid ${({ theme }) => theme.primary.lightBrown};
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
  color: ${({ theme }) => theme.gray.normal7};
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  & > div:nth-of-type(2) {
    font-size: 14px;
    line-height: 19px;
    text-align: right;
    color: ${({ theme }) => theme.gray.normal85};
  }
  & svg {
    margin-left: 10px;
    width: 13px;
    height: 13px;
  }
  :nth-of-type(4) {
    background-color: ${({ theme }) => theme.primary.lightBrown};
  }
`;
const APYStyled = styled.div`
  display: flex;
  flex-direction: column;
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

const MarketItem = memo<TProps>(({ intl, data }) => {
  const { warn, green, primary } = useTheme();
  const { push } = useHistory();
  const [marketData, setMarketData] = useState<Market>(data);

  useEffect(() => {
    const fetchData = async () => {
      const _md = await useMarket({ ...data });
      if (_md) setMarketData(_md);
    };
    fetchData();
  }, []);

  const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];
  const tranchesDisplayColor = [warn.normal, green.normal, primary.deep];
  return (
    <Container>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Portfolio" })}</div>
        <div>{marketData.portfolio}</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Asset" })}</div>
        <div style={{ display: "flex" }}>
          <Coin size={18} assetName={marketData.assets} /> {marketData.assets}
        </div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Lock-up period" })}</div>
        <div>{marketData.duration ? getLockupPeriod(marketData.duration) : "-"}</div>
      </RowDiv>
      <RowDiv>
        <div>
          {intl.formatMessage({ defaultMessage: "Deposit APY" })}
          <Tooltip
            overlay={
              <React.Fragment>
                <p>
                  All position holders can get different proportions of rewards according to different tranche. Senior:{" "}
                  {formatAllocPoint(marketData?.pools[0]?.allocPoint, marketData?.totalAllocPoints)}% of total WTF
                  Mezzanine: {formatAllocPoint(marketData?.pools[1]?.allocPoint, marketData?.totalAllocPoints)}% of
                  total WTF Junior: {formatAllocPoint(marketData?.pools[2]?.allocPoint, marketData?.totalAllocPoints)}%
                  of total WTF Typography
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
              <APYStyled2 key={_i}>
                <span>{tranchesDisplayText[_i]}</span>
                <span css={{ color: tranchesDisplayColor[_i] }}>{formatAPY(_t.apy)}</span>
                <span>
                  <div>
                    <WTFToken />
                  </div>
                  +{formatAllocPoint(marketData?.pools[_i]?.allocPoint, marketData?.totalAllocPoints)}%
                </span>
              </APYStyled2>
              //{/* {_i !== marketData?.tranches.length - 1 ? <div>&nbsp;→&nbsp;</div> : null} */}
              // </div>
            );
          })}
        </div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "TVL" })}</div>
        <div>{marketData.tvl}</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Status" })}</div>
        <div>
          {marketData.status === PORTFOLIO_STATUS.PENDING ? <Tag color="yellow" value={"Pending"}></Tag> : null}
          {marketData.status === PORTFOLIO_STATUS.ACTIVE ? <Tag color="green" value={"Active"}></Tag> : null}
        </div>
      </RowDiv>

      <ButtonDiv>
        <Button type="primary" onClick={() => push({ pathname: "/portfolio/details", state: marketData })}>
          {intl.formatMessage({ defaultMessage: "Deposit" })}
        </Button>
      </ButtonDiv>
      <NextTime>{marketData.status === PORTFOLIO_STATUS.ACTIVE ? `Next Time: 0D 12H 24M 56S` : ``}</NextTime>
    </Container>
  );
});

export default injectIntl(MarketItem);
