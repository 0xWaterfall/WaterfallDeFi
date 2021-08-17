/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";
import Tooltip from "components/Tooltip/Tooltip";
import { Union } from "assets/images";

type TProps = WrappedComponentProps;

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
const MarketItem = memo<TProps>(({ intl }) => {
  const { warn, green, primary } = useTheme();
  const { push } = useHistory();
  return (
    <Container>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Portfolio" })}</div>
        <div>Cake Vaults 1</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Asset" })}</div>
        <div>BUSD</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Lock-up period" })}</div>
        <div>7 Days</div>
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
          <APYStyled>
            <span>{intl.formatMessage({ defaultMessage: "Senior" })}</span>
            <span css={{ marginTop: 15, color: warn.normal }}>5%</span>
          </APYStyled>
          <div>&nbsp;→&nbsp;</div>
          <APYStyled>
            <span>{intl.formatMessage({ defaultMessage: "Mezzanine" })}</span>
            <span css={{ marginTop: 15, color: green.normal }}>7.5%</span>
          </APYStyled>
          <div>&nbsp;→&nbsp;</div>
          <APYStyled>
            <span>{intl.formatMessage({ defaultMessage: "Junior" })}</span>
            <span css={{ marginTop: 15, color: primary.deep }}>30%</span>
          </APYStyled>
        </div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "TVL" })}</div>
        <div>501,120</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Status" })}</div>
        <div>
          <Tag color="yellow" value="Pending" />
        </div>
      </RowDiv>

      <ButtonDiv>
        <Button type="primary" onClick={() => push({ pathname: "/portfolio/details" })}>
          {intl.formatMessage({ defaultMessage: "Deposit" })}
        </Button>
      </ButtonDiv>
      <NextTime>Next time: 2D 12:56:56</NextTime>
    </Container>
  );
});

export default injectIntl(MarketItem);
