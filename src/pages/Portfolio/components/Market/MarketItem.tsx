/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { memo, useState, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";
import Tooltip from "components/Tooltip/Tooltip";
import { Union } from "assets/images";
import { Market } from "types";
import { formatAPY } from "utils/formatNumbers";
import { useMarket } from "hooks";

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
        <div>{marketData.assets}</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Lock-up period" })}</div>
        <div>{marketData.lockupPeriod}</div>
      </RowDiv>
      <RowDiv>
        <div>
          {intl.formatMessage({ defaultMessage: "Deposit APY" })}
          <Tooltip
            overlay={
              <React.Fragment>
                <p></p>
              </React.Fragment>
            }
          >
            <Union />
          </Tooltip>
        </div>
        <div css={{ display: "flex" }}>
          {marketData?.tranches.map((_t, _i) => {
            return (
              <div css={{ display: "flex" }} key={_i}>
                <APYStyled>
                  <span>{tranchesDisplayText[_i]}</span>
                  <span css={{ marginTop: 15, color: tranchesDisplayColor[_i] }}>{formatAPY(_t.apy)}</span>
                </APYStyled>
                {_i !== marketData?.tranches.length - 1 ? <div>&nbsp;→&nbsp;</div> : null}
              </div>
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
          <Tag color="yellow" value="Pending" />
        </div>
      </RowDiv>

      <ButtonDiv>
        <Button type="primary" onClick={() => push({ pathname: "/portfolio/details", state: marketData })}>
          {intl.formatMessage({ defaultMessage: "Deposit" })}
        </Button>
      </ButtonDiv>
      <NextTime>Next time: 2D 12:56:56</NextTime>
    </Container>
  );
});

export default injectIntl(MarketItem);
