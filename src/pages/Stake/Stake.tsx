/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Bulb, WTFToken } from "assets/images";
import Button from "components/Button/Button";
import Stakings from "config/staking";
import useScrollTop from "hooks/useScrollTop";
import React, { memo, useEffect, useMemo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import Action from "./Action/Action";
import LiquidfillChart from "./LiquidfillChart";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useStakingPool } from "hooks/useStaking";
import { useGetLockingWTF } from "pages/Stake/hooks/useGetLockingWTF";
import { useBalance, useBalanceOfOtherAddress, useTotalSupply } from "hooks";
import numeral from "numeral";
import dayjs from "dayjs";
import Countdown from "react-countdown";
import { usePendingReward } from "./hooks/usePendingReward";
import { useWTFPriceLP } from "hooks/useWTFfromLP";
import useClaimRewards from "./hooks/useClaimRewards";
import { successNotification } from "utils/notification";
import useClaimFeeRewards from "./hooks/useClaimFeeRewards";
import { Line } from "react-chartjs-2";
import BigNumber from "bignumber.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import {
  AVAXMultiSigAddress,
  AVAXPendingRewardLiquidFillChartAddress,
  BUSDAddress,
  MultiSigAddress
} from "config/address";
import { BLOCK_TIME, NETWORK } from "config";
import { BIG_TEN } from "utils/bigNumber";
import { useNetwork } from "hooks/useSelectors";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const actualMultiplier = [
  0.00416666666666667, 0.01, 0.01625, 0.0250000000000001, 0.0354166666666666, 0.05, 0.0670833333333334,
  0.0899999999999999, 0.11625, 0.145833333333333, 0.183333333333333, 0.235, 0.2925, 0.361666666666666, 0.44375, 0.54,
  0.665833333333333, 0.81, 0.981666666666667, 1.18333333333333, 1.435, 1.72333333333333, 2.07, 2.49
];
const Wrapper = styled.div`
  max-width: 1072px;
  padding: 86px 24px 160px;
  margin: 0 auto;
`;

// const Unclaim = styled.div`
//   padding: 0 30px;
//   display: flex;
//   align-items: flex-start;
//   margin-bottom: 40px;
//   @media screen and (max-width: 768px) {
//     width: fit-content;
//     display: grid;
//     grid-auto-flow: row;
//     gap: 20px;
//   }
//   & > section {
//     margin-right: 44px;
//     p {
//       font-weight: 500;
//       font-size: 16px;
//       line-height: 21px;
//       color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
//       margin-bottom: 6px;
//     }

//     span {
//       font-size: 12px;
//       line-height: 16px;
//       color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
//     }
//   }
//   button {
//     width: fit-content;
//     background: ${({ theme }) => theme.primary.lightBrown};
//     color: ${({ theme }) => theme.primary.normal};
//     font-weight: 500;
//     font-size: 14px;
//     line-height: 125%;
//     margin-right: 10px;
//     height: 32px;
//     box-shadow: none;
//     :hover,
//     :focus {
//       background: ${({ theme }) => theme.primary.lightBrown};
//       color: ${({ theme }) => theme.primary.normal};
//     }
//   }
//   & > div {
//     padding: 0 12px;
//     height: 32px;
//     background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.block)};
//     border-radius: 8px;
//     display: grid;
//     gap: 6.5px;
//     grid-auto-flow: column;
//     align-items: center;

//     span {
//       font-size: 12px;
//       line-height: 16px;
//       color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
//     }
//   }
// `;

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
    span,
    div {
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
  // display: gr id;
  // gap: 16px;
  // grid-auto-flow: column;
`;

const Actions = styled.div`
  // display: grid;
  // gap: 48px;
  // grid-auto-flow: column;
  // grid-template-columns: auto 1fr;
  display: flex;

  & > div {
    padding: 24px 32px;
    width: 50%;
  }
  @media screen and (max-width: 900px) {
    width: 100% !important;
    & > div {
      padding: 24px 32px;
      width: 100%;
    }
    flex-direction: column;
    // display: grid;
    // grid-auto-flow: row;
    // grid-template-columns: auto;
  }
`;

const StakeInfo = styled.div`
  padding-top: 24px;
  max-width: 100%;

  p {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  }
  & > div {
    max-width: 100%;
    min-width: 100%;
  }
  & > div:nth-of-type(1) {
    display: flex;
    // flex-direction: column;
    @media screen and (max-width: 900px) {
      padding-left: 30px;
    }
    & > div:nth-of-type(1),
    & > div:nth-of-type(2) {
      flex-direction: column;
      display: flex;
      max-width: 50%;
      width: 50%;
    }
    div {
      width: fit-content;
      align-items: flex-start;
      display: grid;
      gap: 6px;
      grid-auto-flow: column;
      // margin-top: 15px;
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
  & > div:nth-of-type(2) {
    height: 1px;
    background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal04)};
    margin: 36px 0;
  }

  & > div:nth-of-type(3) {
    margin-bottom: 20px;
    div {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 10px;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
    }
  }

  & > div:nth-of-type(4) {
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
        :nth-of-type(1) {
          color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
        }
        :nth-of-type(2) {
          color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
        }
        :nth-of-type(3) {
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
    // :first-of-type > div:nth-of-type(2) {
    //   margin: 56px 0;
    //   height: 1px;
    //   background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal04)};
    // }
  }
  @media screen and (max-width: 1000px) {
    display: flex;
    flex-direction: column;
  }
`;
const WTFReward = styled.div``;

const VeWTF = styled.div`
  p {
    font-weight: 500;
    font-size: 20px;
    line-height: 26px;
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
    background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.block)};
    display: grid;
    gap: 10px;
    // grid-auto-flow: column;
    div {
      display: flex;
      flex-direction: column;
      span {
        font-size: 12px;
      }
    }
  }
`;

// const WeeklyWrapper = styled.div`
//   padding-left: 30px;
//   display: grid;
//   gap: 76px;
//   grid-auto-flow: column;
//   width: fit-content;
//   @media screen and (max-width: 560px) {
//     grid-auto-flow: row;
//   }
//   & > div {
//     p {
//       font-size: 14px;
//       line-height: 18px;
//       color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
//       margin-bottom: 18px;
//     }
//     div {
//       margin-bottom: 11px;
//       font-weight: 500;
//       font-size: 24px;
//       line-height: 31px;
//       color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};

//       span {
//         font-weight: normal;
//         font-size: 16px;
//         line-height: 12px;
//         color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
//       }
//     }
//     & > span {
//       font-size: 12px;
//       line-height: 16px;
//       color: ${({ theme }) => theme.warn.normal};
//     }
//     button {
//       &[dataType="primaryLine"] {
//         height: 32px;
//         font-weight: 500;
//         font-size: 14px;
//         line-height: 125%;
//         padding: 7px 12px;
//         width: fit-content;
//         background: ${({ theme }) => theme.primary.lightBrown};
//       }
//     }
//   }
// `;

type TProps = WrappedComponentProps;

const Stake = memo<TProps>(({ intl }) => {
  useScrollTop();

  // const { goBack } = useHistory();
  const history = useHistory();
  const { account } = useWeb3React<Web3Provider>();

  const network = useNetwork();

  const stakingConfig = network === "bnb" ? Stakings[0] : Stakings[1];
  if (!stakingConfig) {
    history.push("/");
  }
  const { totalStaked, isPoolActive, totalLocked, userStaked, maxAPR, rewardPerBlock } = useStakingPool(
    stakingConfig?.rewardTokenAddress || "",
    stakingConfig?.earningTokenAddress || "",
    account
  );
  const { actualBalance: pendingReward } = useBalanceOfOtherAddress(
    network === "bnb" ? BUSDAddress[NETWORK] : AVAXPendingRewardLiquidFillChartAddress[NETWORK],
    network === "bnb" ? MultiSigAddress[NETWORK] : AVAXMultiSigAddress[NETWORK]
  );
  const _pendingReward = numeral(new BigNumber(pendingReward).times(0.8).toString()).format("0,0.[00]");

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
  // const onFeeRewardsHarvest = async () => {
  //   setFeeRewardsHarvestLoading(true);
  //   try {
  //     const result = await claimFeeRewards();
  //     successNotification("Claim Reward Success", "");
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     setFeeRewardsHarvestLoading(false);
  //   }
  // };
  const _VeWTFBalance = numeral(VeWTFBalance).value() || 0;
  const _VeWTFTotalSupply = numeral(VeWTFTotalSupply).value() || 0;
  const VeWTFRatio =
    VeWTFTotalSupply && VeWTFBalance ? numeral((_VeWTFBalance / _VeWTFTotalSupply) * 100).format("0,0.[0000]") : "-";
  const VeWTFRatioPercentage = VeWTFTotalSupply && VeWTFBalance ? _VeWTFBalance / _VeWTFTotalSupply : 0;
  console.log("VeWTFRatioPercentage", VeWTFRatioPercentage);

  const currentAPR = useMemo(() => {
    if (!rewardPerBlock) return "";
    const blockTime = BLOCK_TIME(process.env.REACT_APP_CHAIN_ID || "");
    return (
      numeral(
        new BigNumber(VeWTFRatioPercentage)
          .times(rewardPerBlock)
          .times((60 / blockTime) * 60 * 24 * 365 * 100)
          .dividedBy(lockingWTF)
          .toString()
      ).format("0,0.[00]") + "%"
    );
  }, [VeWTFRatioPercentage, rewardPerBlock]);

  const data = useMemo(() => {
    return {
      labels: [
        "1 Month",
        "2 Months",
        "3 Months",
        "4 Months",
        "5 Months",
        "6 Months",
        "7 Months",
        "8 Months",
        "9 Months",
        "10 Months",
        "11 Months",
        "12 Months",
        "13 Months",
        "14 Months",
        "15 Months",
        "16 Months",
        "17 Months",
        "18 Months",
        "19 Months",
        "20 Months",
        "21 Months",
        "22 Months",
        "23 Months",
        "24 Months"
      ],
      datasets: [
        {
          label: "veWTF Predicted APR",
          fill: false,
          backgroundColor: "#0066FF",
          borderColor: "#0066FF",
          pointBorderColor: "#0066FF",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#0066FF",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: actualMultiplier.map((e) => {
            return numeral((e * (numeral(maxAPR).value() || 0)) / 2.49).value();
          })
        }
      ]
    };
  }, [maxAPR]);

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
            <p>{intl.formatMessage({ defaultMessage: '"Lock WTF"-to-earn' })}</p>
            <div>
              {intl.formatMessage({
                defaultMessage: "Receive Vote Escrowed WTF (veWTF) that gets you daily WTF rewards,"
              })}
            </div>
            <div>
              {intl.formatMessage({
                defaultMessage: "platform fees shares and more!"
              })}
            </div>
          </div>
          <span>APR up to {maxAPR}%</span>
        </APYCard>

        <Total>
          <div>
            {intl.formatMessage({ defaultMessage: "Total WTF locked" })}: {numeral(totalLocked).format("0,0.[0000]")}
          </div>
          <div>
            {intl.formatMessage({ defaultMessage: "Total veWTF minted" })}:{" "}
            {numeral(_VeWTFTotalSupply).format("0,0.[0000]")}
          </div>
          {/* <span>{intl.formatMessage({ defaultMessage: "Average lock duration" })}: 4.0 months</span> */}
        </Total>

        <Actions>
          <Action
            stakingConfig={stakingConfig}
            totalVeWTF={_VeWTFTotalSupply.toString()}
            rewardPerBlock={rewardPerBlock}
          />
          <StakeInfo>
            <div>
              <VeWTF>
                <p>{intl.formatMessage({ defaultMessage: "Your veWTF" })}</p>
                <p>{VeWTFBalance ? numeral(_VeWTFBalance).format("0,0.[0000]") : "-"}</p>
                <span>
                  {VeWTFBalance !== "0" &&
                    `(1 veWTF= ${numeral(Number(lockingWTF) / Number(_VeWTFBalance)).format("0,0.[0000]")} WTF)`}
                </span>

                <span>{VeWTFRatio && `${VeWTFRatio}% of veWTF ownership`}</span>
                <div>
                  <Bulb />
                  <div>
                    <span>{intl.formatMessage({ defaultMessage: "Stake WTF get veWTF" })}</span>
                    {/* <span>
                      {intl.formatMessage({
                        defaultMessage:
                          "veWTF holders can get dividends from the transaction fee income in each cycle. Rewards will be available for withdrawal after the end of each period."
                      })}
                    </span> */}
                  </div>
                </div>
              </VeWTF>
              <WTFReward>
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
              </WTFReward>
            </div>
            <div />
            <div>
              <div>veWTF - Locking Period vs Predicted APR</div>
              <Line data={data} />
            </div>
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
                <span>{intl.formatMessage({ defaultMessage: "Current APR" })}:</span>
                <span>{currentAPR && currentAPR}</span>
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
          <LiquidfillChart share={VeWTFRatio} pendingReward={_pendingReward} />

          {/* <VeWTF>
              <p>{intl.formatMessage({ defaultMessage: "Your veWTF" })}</p>
              <p>{VeWTFBalance ? numeral(_VeWTFBalance).format("0,0.[0000]") : "-"}</p>
              <span>
                {VeWTFBalance !== "0" &&
                  `(1 veWTF= ${numeral(Number(lockingWTF) / Number(_VeWTFBalance)).format("0,0.[0000]")} WTF)`}
              </span>
              <div>
                <Bulb />
                <div>
                  <span>{intl.formatMessage({ defaultMessage: "Stake WTF get veWTF" })}</span>
                  <span>
                    {intl.formatMessage({
                      defaultMessage:
                        "veWTF holders can get dividends from the transaction fee income in each cycle. Rewards will be available for withdrawal after the end of each period."
                    })}
                  </span>
                </div>
              </div>
            </VeWTF>
            <div /> */}
          {/* <WeeklyWrapper>
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
            </WeeklyWrapper> */}
        </Footer>
      </BodyWrapper>
    </Wrapper>
  );
});

export default injectIntl(Stake);
