/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { ArrowLeft, ChevronLeft, FarmCardImage, Union } from "assets/images";
import Button from "components/Button/Button";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 24px;
  grid-auto-flow: row;
`;

const FarmCard = styled.div`
  background: ${({ theme }) => theme.white.normal5};
  border-radius: 24px;
  padding: 19px 24px;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  position: relative;
  overflow: hidden;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  span {
    margin-right: 10px;
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
    color: ${({ theme }) => theme.background.iconfont};
  }
`;

const IconGroup = styled.div`
  display: flex;
  img {
    width: 44px;
    height: 44px;
    background: ${({ theme }) => theme.white.normal};
    border-radius: 50%;
    padding: 11px;
  }
`;

const LabelLP = styled.div`
  font-size: 20px;
  line-height: 125%;
  color: ${({ theme }) => theme.gray.normal85};
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.gray.normal04};
`;

const DataWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  div {
    display: grid;
    gap: 8px;
    grid-auto-flow: row;
    p {
      font-size: 12px;
      line-height: 125%;
      color: ${({ theme }) => theme.gray.normal7};
    }
    span {
      font-size: 16px;
      line-height: 125%;
      color: ${({ theme }) => theme.gray.normal85};
      font-weight: bold;
    }
  }
`;

const FarmCardImageWrapper = styled(FarmCardImage)`
  position: absolute;
  bottom: 46px;
  right: -26px;
`;

const StakedCard = styled.div`
  background: ${({ theme }) => theme.white.normal5};
  border-radius: 24px;
  /* padding: 19px 24px; */
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  position: relative;
  display: grid;
  grid-template-columns: 1fr 240px;
  overflow: hidden;
`;

const MyStaked = styled.div`
  padding: 32px 37px 18px;
  span,
  div {
    display: block;
    line-height: 125%;
    color: ${({ theme }) => theme.gray.normal7};
    margin-bottom: 8px;
    line-height: 125%;
  }
  p,
  h1 {
    font-weight: bold;
    font-size: 20px;
    line-height: 125%;
    color: ${({ theme }) => theme.gray.normal85};
  }
  h1 {
    margin-bottom: 8px;
  }
  div {
    margin-top: 24px;
  }
`;

const Reward = styled.div`
  padding: 32px 45px;
  background: linear-gradient(90deg, #4ac9ff 0%, #167bff 98.68%);
  color: ${({ theme }) => theme.white.normal};
  div {
    display: flex;
    align-items: center;
    span {
      margin-right: 5px;
    }
  }
  p {
    margin: 9px 0;
    font-weight: bold;
    font-size: 20px;
    line-height: 125%;
  }
`;

const ButtonWrapper = styled(Button)`
  display: flex;
  align-items: center;
  background: linear-gradient(93.83deg, #e8f7ff 26.54%, #bffeff 70.96%);
  margin-top: 20px;
  color: ${({ theme }) => theme.primary.deep};
  font-weight: 600;
  font-size: 16px;
  line-height: 125%;
  justify-content: center;
  height: 48px;
  width: 150px;
  :hover,
  :focus {
    color: ${({ theme }) => theme.primary.deep};
    border: none;
    background: linear-gradient(93.83deg, #e8f7ff 26.54%, #bffeff 70.96%);
  }
`;

type TProps = WrappedComponentProps;

const InfoCard = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <FarmCard>
        <FarmCardImageWrapper />
        <IconWrapper>
          <IconGroup>
            <img src="https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png?v=013" />
            <img
              src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=013"
              css={{ transform: "translateX(-11px)" }}
            />
          </IconGroup>
        </IconWrapper>
        <LabelLP>WTF-BUSD LP</LabelLP>
        <DataWrapper>
          <div>
            <p>{intl.formatMessage({ defaultMessage: "Total Stake" })}</p>
            <span>1,000,000</span>
          </div>
          <div>
            <p>{intl.formatMessage({ defaultMessage: "APR" })}</p>
            <span>736%</span>
          </div>
        </DataWrapper>
      </FarmCard>
      <StakedCard>
        <MyStaked>
          <span>{intl.formatMessage({ defaultMessage: "Staked" })}</span>
          <h1>1,000,000</h1>
          <span>$ 2517.12</span>
          <div>{intl.formatMessage({ defaultMessage: "Your Share" })}</div>
          <p>0.1%</p>
        </MyStaked>
        <Reward>
          <div>
            <span>{intl.formatMessage({ defaultMessage: "Pending Rewards" })}</span>
            <Union />
          </div>
          <p>0 WTF</p>
          <span>$0</span>
          <ButtonWrapper>{intl.formatMessage({ defaultMessage: "Harvest" })}</ButtonWrapper>
        </Reward>
      </StakedCard>
    </Wrapper>
  );
});

export default injectIntl(InfoCard);
