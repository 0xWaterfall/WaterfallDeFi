/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { ArrowLeft, ChevronLeft, WTF as WTFIcon } from "assets/images";
import { useBalance, useTotalSupply } from "hooks";
import useScrollTop from "hooks/useScrollTop";
import { useStakingPool } from "hooks/useStaking";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Chart from "./Chart";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Stakings from "config/staking";
import { useParams } from "react-router-dom";
import { StakingConfig } from "types";
const Wrapper = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.header3)};
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
`;

const Line = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal08)};
  margin: 24px 0 20px;
`;

const LinearGradientWTF = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: solid 2px transparent;
  background-image: linear-gradient(180deg, #fff, #fff),
    linear-gradient(180deg, #5946f8 0%, #2494dc 44.79%, #00cccb 100%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WTFWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WTF = styled.div`
  width: fit-content;
  display: grid;
  gap: 5px;
  grid-auto-flow: column;
  align-items: center;
  font-size: 20px;
`;

const ChartWrapepr = styled.div``;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 40px;
  p {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    font-size: 14px;
    line-height: 125%;
  }
  span {
    font-weight: bold;
    font-size: 16px;
  }
`;
type UrlParams = {
  id: string;
};

type TProps = WrappedComponentProps & {
  stakingConfig: StakingConfig;
};

const TotalCard = memo<TProps>(({ intl, stakingConfig }) => {
  const { account } = useWeb3React<Web3Provider>();

  const { id } = useParams<UrlParams>();
  const { balance: VeWTFBalance } = useBalance(stakingConfig.earningTokenAddress);
  const VeWTFTotalSupply = useTotalSupply(stakingConfig.earningTokenAddress);
  const { totalLocked } = useStakingPool(stakingConfig.rewardTokenAddress, stakingConfig.earningTokenAddress, account);
  const earningTokenTotalSupply = useTotalSupply(stakingConfig.earningTokenAddress);

  return (
    <Wrapper>
      <WTFWrapper>
        <WTF>
          <LinearGradientWTF>
            <WTFIcon />
          </LinearGradientWTF>
          <span>WTF</span>
        </WTF>
        <ChartWrapepr>
          <Chart />
        </ChartWrapepr>
      </WTFWrapper>

      <Line />
      <Container>
        <div>
          <p>{intl.formatMessage({ defaultMessage: "Total Stake" })}</p>
          <span>{totalLocked}</span>
        </div>
        <div>
          <p>{intl.formatMessage({ defaultMessage: "Total supply (veWTF)" })}</p>
          <span>{earningTokenTotalSupply}</span>
        </div>
        <div>
          <p>{intl.formatMessage({ defaultMessage: "APR" })}</p>
          <span>736%</span>
        </div>
      </Container>
    </Wrapper>
  );
});

export default injectIntl(TotalCard);
