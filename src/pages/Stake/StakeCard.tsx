/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { useStakingPool, useEarningTokenTotalSupply } from "hooks/useStaking";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { StakingConfig } from "types";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
const Card = styled.div`
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.block5)};
  box-shadow: 0px 4px 10px 0px #0000000a;
  border-radius: 24px;
  padding: 19px 16px 22px;
  cursor: pointer;
  transition: transform 0.5s;
  :hover {
    transform: translateY(-10px);
  }
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
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal08)};
`;

const DataWrapper = styled.div`
  display: grid;
  row-gap: 28px;
  grid-template-areas: "a b";
  div {
    display: grid;
    gap: 8px;
    grid-auto-flow: row;
    p {
      font-size: 12px;
      line-height: 125%;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
    }
    span {
      font-size: 16px;
      line-height: 125%;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
      font-weight: bold;
    }
  }
`;

type TProps = WrappedComponentProps & {
  data: StakingConfig;
};

const StakeCard = memo<TProps>(({ intl, data }) => {
  const { account } = useWeb3React<Web3Provider>();

  const result = useStakingPool(data.stakingTokenAddress, account);
  const earningTokenTotalSupply = useEarningTokenTotalSupply(data.earningTokenAddress);
  return (
    <Card>
      <IconWrapper>
        <IconGroup>
          <img src="https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png?v=013" />
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=013" css={{ transform: "translateX(-11px)" }} />
        </IconGroup>
        <span>WTF+ Trade fee</span>
      </IconWrapper>
      <LabelLP>{data.name} LP</LabelLP>
      <DataWrapper>
        <div>
          <p>{intl.formatMessage({ defaultMessage: "Total Stake" })}</p>
          <span>{result.totalStaked}</span>
        </div>
        <div>
          <p>{intl.formatMessage({ defaultMessage: "APR" })}</p>
          <span>736%</span>
        </div>
        <div>
          <p>{intl.formatMessage({ defaultMessage: "Total supply (Ve-WTF)" })}</p>
          <span>{earningTokenTotalSupply}</span>
        </div>
        <div>
          <p>{intl.formatMessage({ defaultMessage: "Your stake" })}</p>
          <span>{result.userStaked}</span>
        </div>
      </DataWrapper>
    </Card>
  );
});

export default injectIntl(StakeCard);
