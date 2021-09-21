/** @jsxImportSource @emotion/react */

import React, { memo, useCallback } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { Coingecko, DashboardImage, MetaMask } from "assets/images";
import { useSize } from "ahooks";
import { useMarketCap, useWTFPrice } from "hooks/useSelectors";
import numeral from "numeral";
import { BASE_BSC_SCAN_URL } from "config";
import { nodes } from "utils/getRpcUrl";

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

  const addToken = useCallback(async () => {
    const provider = window.ethereum;
    if (provider?.request) {
      try {
        await provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0xa9f302953082fb8412f55d5bca3714a51e5b9a97",
              symbol: "WTF",
              decimals: 18,
              image: "https://waterfalldefi.org/wp-content/uploads/2021/04/cropped-favocon_wtf-192x192.png"
            }
          }
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    } else {
      console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
      return false;
    }
  }, []);

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
            <a href="https://www.coingecko.com/en/coins/waterfall" target="_blank" rel="noopener noreferrer">
              <Coingecko />
            </a>
            <MetaMask css={{ width: 30, height: 30, marginLeft: 15 }} onClick={addToken} />
          </IconGroup>
        </Block>
      </Content>
    </Wrapper>
  );
});

export default injectIntl(DashboardCard);
