/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { Coingecko, DashboardImage, MetaMask } from "assets/images";
import { useSize } from "ahooks";
import { useMarketCap, useWTFPrice } from "hooks/useSelectors";
import numeral from "numeral";

type TProps = WrappedComponentProps;

const Wrapper = styled.div`
  border-radius: 24px;
  padding: 32px 44px 102px;
  background: ${({ theme }) => theme.primary.lightBrown};
  position: relative;
  color: ${({ theme }) => theme.gray.normal85};
`;

const DashboardImageWrapper = styled(DashboardImage)`
  position: absolute;
  right: 0;
  bottom: 56px;
  @media screen and (max-width: 876px) {
    display: none;
  }
`;

const LinearGradientWrapper = styled.div`
  width: 95%;
  height: 280px;
  background: linear-gradient(
    90deg,
    rgba(252, 182, 4, 0.1) 14.14%,
    rgba(3, 161, 75, 0.1) 45.76%,
    rgba(12, 108, 254, 0.1) 84.73%
  );
  filter: blur(200px);
  position: absolute;
  left: 50%;
  bottom: 100px;
  transform: matrix(-1, 0, 0, 1, 0, 0) translate(50%, 100%);
`;

const H1 = styled.div`
  font-size: 36px;
  font-weight: 500;
  line-height: 45px;
  margin-bottom: 40px;
`;

const Content = styled.div`
  display: grid;
  gap: 80px;
  grid-auto-flow: column;
  width: fit-content;
  @media screen and (max-width: 876px) {
    grid-auto-flow: row;
    gap: 40px;
  }
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.span`
  font-size: 16px;
  line-height: 20.8px;
  margin-bottom: 12px;
`;

const Value = styled.span`
  color: ${({ theme }) => theme.gray.normal};
  font-size: 24px;
  line-height: 31.2px;
  font-weight: 600;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: flex-end;
  svg {
    cursor: pointer;
  }
`;

const DashboardCard = memo<TProps>(({ intl }) => {
  const price = useWTFPrice();
  const marketPrice = useMarketCap();

  return (
    <Wrapper>
      <DashboardImageWrapper />
      <LinearGradientWrapper />
      <H1>{intl.formatMessage({ defaultMessage: "Dashboard" })}</H1>
      <Content>
        <Block>
          <Title>{intl.formatMessage({ defaultMessage: "WTF Price" })}</Title>
          <Value>$ {numeral(price).format("0,0.00")}</Value>
        </Block>
        <Block>
          <Title>{intl.formatMessage({ defaultMessage: "Market Cap" })}</Title>
          <Value>$ {numeral(marketPrice).format("0,0.00")}</Value>
        </Block>
        <Block>
          <Title />
          <IconGroup>
            <Coingecko />
            <MetaMask css={{ width: 30, height: 30, marginLeft: 15 }} />
          </IconGroup>
        </Block>
      </Content>
    </Wrapper>
  );
});

export default injectIntl(DashboardCard);
