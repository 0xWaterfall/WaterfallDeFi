/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { FarmCardImage, Union } from "assets/images";
import Button from "components/Button/Button";
import numeral from "numeral";
import { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { FarmInterface } from "../hooks/useFarms";
import useLPStaked from "../hooks/useLPStaked";
import BigNumber from "bignumber.js";
import { usePendingReward } from "../hooks/usePendingReward";
import { useWTFPriceLP } from "hooks/useWTFfromLP";
import useClaimRewards from "../hooks/useClaimRewards";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Coin from "components/Coin";
const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 24px;
  grid-auto-flow: row;
`;

const FarmCard = styled.div`
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.block)};
  border-radius: 24px;
  padding: 19px 24px;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  position: relative;
  z-index: 1;
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
  & > div {
    width: 44px;
    height: 44px;
    background: ${({ theme }) => theme.white.normal};
    background-size: contain;
    border-radius: 50%;
    padding: 11px;
  }
  & > div:nth-of-type(2) {
    transform: translateX(-11px);
  }
`;
const LabelLP = styled.div`
  font-size: 20px;
  line-height: 125%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal1)};
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
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    }
    span {
      font-size: 16px;
      line-height: 125%;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
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
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.block)};
  border-radius: 24px;
  /* padding: 19px 24px; */
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 240px;
  overflow: hidden;
  margin-bottom: 40px;
`;

const MyStaked = styled.div`
  padding: 32px 37px 18px;
  span,
  div {
    display: block;
    line-height: 125%;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    margin-bottom: 8px;
    line-height: 125%;
  }
  p,
  h1 {
    font-weight: bold;
    font-size: 20px;
    line-height: 125%;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
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

type TProps = WrappedComponentProps & {
  farm: FarmInterface;
};

const InfoCard = memo<TProps>(({ intl, farm }) => {
  const { account } = useWeb3React<Web3Provider>();
  const stakedBalance = useLPStaked(farm?.lpRewardAddress);
  const pendingReward = usePendingReward(farm?.lpRewardAddress);
  const { price: wtfPrice } = useWTFPriceLP();
  const [claimRewardsLoading, setClaimRewardsLoading] = useState(false);
  const { onClaimRewards } = useClaimRewards(farm?.lpRewardAddress);
  return (
    <Wrapper>
      <FarmCard>
        <FarmCardImageWrapper />
        <IconWrapper>
          <IconGroup>
            <Coin assetName={farm.logo1} size={44} />
            <Coin assetName={farm.logo2} size={44} />
          </IconGroup>
        </IconWrapper>
        <LabelLP>{farm.name}</LabelLP>
        <DataWrapper>
          <div>
            <p>{intl.formatMessage({ defaultMessage: "Total Stake" })}</p>
            <span>{numeral(farm?.totalStaked).format("0,0.[0000]")}</span>
          </div>
          <div>
            <p>{intl.formatMessage({ defaultMessage: "APR" })}</p>
            <span>{farm.maxAPR}%</span>
          </div>
        </DataWrapper>
      </FarmCard>
      <StakedCard>
        <MyStaked>
          <span>{intl.formatMessage({ defaultMessage: "Staked" })}</span>
          <h1>{numeral(stakedBalance).format("0,0.[0000]")}</h1>
          <span>$ -</span>
          <div>{intl.formatMessage({ defaultMessage: "Your Share" })}</div>
          <p>
            {farm?.totalStaked && stakedBalance
              ? numeral(new BigNumber(stakedBalance).dividedBy(new BigNumber(farm?.totalStaked)).times(100)).format(
                  "0,0.[00]"
                )
              : "-"}
            %
          </p>
        </MyStaked>
        <Reward>
          <div>
            <span>{intl.formatMessage({ defaultMessage: "Pending Rewards" })}</span>
            <Union />
          </div>
          <p>{numeral(pendingReward).format("0,0.[0000]")} WTF</p>
          <span>
            ${" "}
            {pendingReward && wtfPrice
              ? numeral(
                  parseFloat(pendingReward.replace(/,/g, "")) * parseFloat(wtfPrice.replace(/,/g, "").toString())
                ).format("0,0.[00]")
              : ""}{" "}
          </span>
          {account && (
            <ButtonWrapper onClick={onClaimRewards} loading={claimRewardsLoading}>
              {intl.formatMessage({ defaultMessage: "Harvest" })}
            </ButtonWrapper>
          )}
        </Reward>
      </StakedCard>
    </Wrapper>
  );
});

export default injectIntl(InfoCard);
