/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Bulb, WaterFall, WTF, WTFToken } from "assets/images";
import Button from "components/Button/Button";
import Stakings from "config/staking";
import useScrollTop from "hooks/useScrollTop";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import { StakingConfig } from "types";
import Action from "./Action/Action";
import LiquidfillChart from "./LiquidfillChart";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useStakingPool } from "hooks/useStaking";
import { useGetLockingWTF } from "pages/OldStake/hooks/useGetLockingWTF";
import { useBalance, useTotalSupply } from "hooks";
import numeral from "numeral";
import dayjs from "dayjs";
import Countdown from "react-countdown";
import { usePendingReward } from "./hooks/usePendingReward";
import { useWTFPriceLP } from "hooks/useWTFfromLP";
import useClaimRewards from "./hooks/useClaimRewards";
import { successNotification } from "utils/notification";
import useClaimFeeRewards from "./hooks/useClaimFeeRewards";
const Wrapper = styled.div`
  max-width: 1072px;
  padding: 86px 24px 160px;
  margin: 0 auto;
`;

const Unclaim = styled.div`
  padding: 0 30px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 40px;
  @media screen and (max-width: 768px) {
    width: fit-content;
    display: grid;
    grid-auto-flow: row;
    gap: 20px;
  }
  & > section {
    margin-right: 44px;
    p {
      font-weight: 500;
      font-size: 16px;
      line-height: 21px;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
      margin-bottom: 6px;
    }

    span {
      font-size: 12px;
      line-height: 16px;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
    }
  }
  button {
    width: fit-content;
    background: ${({ theme }) => theme.primary.lightBrown};
    color: ${({ theme }) => theme.primary.normal};
    font-weight: 500;
    font-size: 14px;
    line-height: 125%;
    margin-right: 10px;
    height: 32px;
    box-shadow: none;
    :hover,
    :focus {
      background: ${({ theme }) => theme.primary.lightBrown};
      color: ${({ theme }) => theme.primary.normal};
    }
  }
  & > div {
    padding: 0 12px;
    height: 32px;
    background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.block)};
    border-radius: 8px;
    display: grid;
    gap: 6.5px;
    grid-auto-flow: column;
    align-items: center;

    span {
      font-size: 12px;
      line-height: 16px;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    }
  }
`;

const BodyWrapper = styled.div``;

const APYCard = styled.div`
  background: linear-gradient(360deg, rgba(21, 121, 255, 0.1) 0%, rgba(21, 123, 255, 0.1) 100%);
  padding: 24px 43px 24px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  border-radius: 12px;
  & > div {
    p {
      font-weight: 500;
      font-size: 20px;
      line-height: 26px;
      margin-bottom: 8px;
    }
    span {
      font-size: 14px;
      line-height: 18px;
    }
  }
  & > span {
    font-style: italic;
    font-weight: 300;
    font-size: 40px;
    line-height: 52px;
    color: ${({ theme }) => theme.primary.deep};
  }
`;

const Total = styled.div`
  width: fit-content;
  padding: 0 30px;
  margin: 20px 0 32px;
  font-size: 16px;
  line-height: 21px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  display: grid;
  gap: 16px;
  grid-auto-flow: column;
`;

const Actions = styled.div`
  display: grid;
  gap: 48px;
  grid-auto-flow: column;
  grid-template-columns: auto 1fr;
  @media screen and (max-width: 900px) {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: auto;
  }
`;

const StakeInfo = styled.div`
  padding-top: 24px;

  p {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  }

  & > div:nth-child(1) {
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 900px) {
      padding-left: 30px;
    }
    div {
      width: fit-content;
      align-items: flex-start;
      display: grid;
      gap: 6px;
      grid-auto-flow: column;
      margin-top: 15px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
    p {
      font-weight: 500;
      font-size: 16px;
      line-height: 21px;
    }
    & > span {
      display: inline-block;
      font-size: 14px;
      line-height: 18px;
      margin: 12px 0;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    }
    button {
      &[dataType="primaryLine"] {
        height: 32px;
        font-weight: 500;
        font-size: 14px;
        line-height: 125%;
        padding: 7px 12px;
        width: fit-content;
        background: ${({ theme }) => theme.primary.lightBrown};
      }
    }
  }
  & > div:nth-child(2) {
    height: 1px;
    background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal04)};
    margin: 36px 0;
  }

  & > div:nth-child(3) {
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 900px) {
      padding-left: 30px;
    }
    section {
      width: fit-content;
      align-items: center;
      display: grid;
      gap: 12px;
      grid-auto-flow: column;
      margin-bottom: 8px;
      span {
        display: inline-block;
        font-size: 14px;
        line-height: 18px;
        :nth-child(1) {
          color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
        }
        :nth-child(2) {
          color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
        }
        :nth-child(3) {
          color: ${({ theme }) => theme.warn.normal};
        }
      }
    }
    p {
      font-weight: 500;
      font-size: 16px;
      line-height: 21px;
      margin-bottom: 12px;
    }
  }
`;

const Footer = styled.div`
  margin-top: 50px;
  display: grid;
  gap: 75px;
  grid-template-columns: 500px 1fr;
  & > div {
    :first-of-type > div:nth-child(2) {
      margin: 56px 0;
      height: 1px;
      background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal04)};
    }
  }
  @media screen and (max-width: 1000px) {
    display: flex;
    flex-direction: column;
  }
`;

const VeWTF = styled.div`
  padding-left: 30px;
  p {
    font-weight: 500;
    font-size: 20px;
    line-height: 26px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  }
  span {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    font-size: 14px;
    line-height: 18px;
  }
  & > div {
    border-radius: 8px;
    padding: 16px;
    margin-top: 20px;
    background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.block)};
    display: grid;
    gap: 10px;
    grid-auto-flow: column;
    div {
      display: flex;
      flex-direction: column;
      span {
        font-size: 12px;
      }
    }
  }
`;

const WeeklyWrapper = styled.div`
  padding-left: 30px;
  display: grid;
  gap: 76px;
  grid-auto-flow: column;
  width: fit-content;
  @media screen and (max-width: 560px) {
    grid-auto-flow: row;
  }
  & > div {
    p {
      font-size: 14px;
      line-height: 18px;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
      margin-bottom: 18px;
    }
    div {
      margin-bottom: 11px;
      font-weight: 500;
      font-size: 24px;
      line-height: 31px;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};

      span {
        font-weight: normal;
        font-size: 16px;
        line-height: 12px;
        color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
      }
    }
    & > span {
      font-size: 12px;
      line-height: 16px;
      color: ${({ theme }) => theme.warn.normal};
    }
    button {
      &[dataType="primaryLine"] {
        height: 32px;
        font-weight: 500;
        font-size: 14px;
        line-height: 125%;
        padding: 7px 12px;
        width: fit-content;
        background: ${({ theme }) => theme.primary.lightBrown};
      }
    }
  }
`;

type TProps = WrappedComponentProps;

const Stake = memo<TProps>(({ intl }) => {
  useScrollTop();

  const { goBack } = useHistory();
  const history = useHistory();
  const { account } = useWeb3React<Web3Provider>();
  const stakingConfig = Stakings[0];
  if (!stakingConfig) {
    history.push("/");
  }
  const { totalStaked, isPoolActive, totalLocked, userStaked, maxAPR, pendingBUSDReward } = useStakingPool(
    stakingConfig?.rewardTokenAddress || "",
    stakingConfig?.earningTokenAddress || "",
    account
  );

  const { balance: VeWTFBalance } = useBalance(stakingConfig.earningTokenAddress);
  const VeWTFTotalSupply = useTotalSupply(stakingConfig.earningTokenAddress);
  const { total: lockingWTF, expiryTimestamp, startTimestamp, fetchLockingWTF } = useGetLockingWTF(account);
  const pendingWTFRewards = usePendingReward(stakingConfig.rewardTokenAddress, account);
  const { price: wtfPrice } = useWTFPriceLP();
  const { claimRewards } = useClaimRewards();
  const { claimFeeRewards } = useClaimFeeRewards();
  const [harvestLoading, setHarvestLoading] = useState(false);
  const [feeRewardsHarvestLoading, setFeeRewardsHarvestLoading] = useState(false);
  const onHarvest = async () => {
    setHarvestLoading(true);
    try {
      const result = await claimRewards();
      // fetchBalance();
      // setBalanceInput(0);
      // fetchLockingWTF();
      successNotification("Claim Reward Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setHarvestLoading(false);
    }
  };
  const onFeeRewardsHarvest = async () => {
    setFeeRewardsHarvestLoading(true);
    try {
      const result = await claimFeeRewards();
      successNotification("Claim Reward Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setFeeRewardsHarvestLoading(false);
    }
  };
  const _VeWTFBalance = numeral(VeWTFBalance).value() || 0;
  const _VeWTFTotalSupply = numeral(VeWTFTotalSupply).value() || 0;
  console.log(Number(lockingWTF));
  console.log(Number(_VeWTFBalance));
  const VeWTFRatio =
    VeWTFTotalSupply && VeWTFBalance ? numeral((_VeWTFBalance / _VeWTFTotalSupply) * 100).format("0,0.[0000]") : "-";
  // if (!stakingConfig) return <Wrapper />;
  return (
    <Wrapper>
      {/* <Unclaim>
        <section>
          <p>{intl.formatMessage({ defaultMessage: "Your unclaim WTF" })}: 123.321</p>
          <span>({intl.formatMessage({ defaultMessage: "From portfolio reward" })})</span>
        </section>
        <Button>{intl.formatMessage({ defaultMessage: "Claim" })}</Button>
        <div>
          <Bulb />
          <span>{intl.formatMessage({ defaultMessage: "Claim to the wallet first, then stake WTF." })}</span>
        </div>
      </Unclaim> */}

      <BodyWrapper>
        <APYCard>
          <div>
            <p>{intl.formatMessage({ defaultMessage: "Lock WTF to earn more" })}</p>
            <span>
              {intl.formatMessage({ defaultMessage: "Earn daily WTF rewards and weekly trade fee dividends. " })}
            </span>
          </div>
          <span>up to APY {maxAPR}%</span>
        </APYCard>

        <Total>
          <span>
            {intl.formatMessage({ defaultMessage: "Total locked WTF" })}: {numeral(totalLocked).format("0,0.[0000]")}
          </span>
          {/* <span>{intl.formatMessage({ defaultMessage: "Average lock duration" })}: 4.0 months</span> */}
        </Total>

        <Actions>
          <Action stakingConfig={stakingConfig} />
          <StakeInfo>
            <div>
              <p>{intl.formatMessage({ defaultMessage: "WTF Reward" })}</p>
              <div>
                <WTFToken /> <p>{pendingWTFRewards}</p>
              </div>
              <span>
                ${" "}
                {pendingWTFRewards && wtfPrice
                  ? numeral(
                      parseFloat(pendingWTFRewards.replace(/,/g, "")) *
                        parseFloat(wtfPrice.replace(/,/g, "").toString())
                    ).format("0,0.[00]")
                  : ""}{" "}
                (1 WTF= $ {wtfPrice})
              </span>
              <Button type="primaryLine" onClick={onHarvest} loading={harvestLoading}>
                {intl.formatMessage({ defaultMessage: "Harvest" })}&nbsp;&nbsp;🐳
              </Button>
            </div>
            <div />
            <div>
              <p>{intl.formatMessage({ defaultMessage: "Your info" })}</p>
              <section>
                <span>{intl.formatMessage({ defaultMessage: "Your stake" })}:</span>
                <span>{lockingWTF !== "0" ? numeral(lockingWTF).format("0,0.[0000]") : "-"} WTF</span>
              </section>
              <section>
                <span>{intl.formatMessage({ defaultMessage: "Your ratio" })}:</span>
                <span>
                  {lockingWTF !== "0"
                    ? numeral((Number(_VeWTFBalance) / Number(lockingWTF)) * 100).format("0,0.[00]")
                    : "-"}{" "}
                  %
                </span>
              </section>
              <section>
                <span>{intl.formatMessage({ defaultMessage: "Expire date" })}:</span>
                <span>
                  {expiryTimestamp &&
                    expiryTimestamp !== "0" &&
                    dayjs.unix(Number(expiryTimestamp)).format("YYYY-MM-DD HH:mm:ss")}
                </span>
                {expiryTimestamp && expiryTimestamp !== "0" && (
                  <Countdown
                    date={Number(expiryTimestamp) * 1000}
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
              </section>
            </div>
          </StakeInfo>
        </Actions>

        <Footer>
          <div>
            <VeWTF>
              <p>{intl.formatMessage({ defaultMessage: "Your Ve-WTF" })}</p>
              <p>{VeWTFBalance ? numeral(_VeWTFBalance).format("0,0.[0000]") : "-"}</p>
              <span>
                {VeWTFBalance !== "0" &&
                  `(1 ve-WTF= ${numeral(Number(lockingWTF) / Number(_VeWTFBalance)).format("0,0.[0000]")} WTF)`}
              </span>
              <div>
                <Bulb />
                <div>
                  <span>{intl.formatMessage({ defaultMessage: "Stake WTF get Ve-WTF" })}</span>
                  <span>
                    {intl.formatMessage({
                      defaultMessage:
                        "Ve-WTF holders can get dividends from the transaction fee income in each cycle. Rewards will be available for withdrawal after the end of each period."
                    })}
                  </span>
                </div>
              </div>
            </VeWTF>
            <div />
            <WeeklyWrapper>
              <div>
                <p>{intl.formatMessage({ defaultMessage: "Est. weekly dividends:" })}</p>
                <div>
                  10 <span>BUSD</span>
                </div>
                <span>Allocated time at 2D 12:56:56</span>
              </div>
              <div>
                <p>{intl.formatMessage({ defaultMessage: "Est. weekly dividends:" })}</p>
                <div>
                  {pendingBUSDReward} <span>BUSD</span>
                </div>
                <Button type="primaryLine" onClick={onFeeRewardsHarvest} loading={feeRewardsHarvestLoading}>
                  {intl.formatMessage({ defaultMessage: "Harvest" })}&nbsp;&nbsp;🐳
                </Button>
              </div>
            </WeeklyWrapper>
          </div>
          <LiquidfillChart share={VeWTFRatio} pendingBUSDReward={pendingBUSDReward} />
        </Footer>
      </BodyWrapper>
    </Wrapper>
  );
});

export default injectIntl(Stake);
