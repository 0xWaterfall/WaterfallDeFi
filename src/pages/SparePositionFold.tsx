/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useMemo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "components/Button/Button";
import { useState } from "react";
import Tooltip from "components/Tooltip/Tooltip";
import { IType } from "./Portfolio/components/MyPortfolio/type";
import { Union } from "assets/images";
import styled from "@emotion/styled";
import numeral from "numeral";
import { formatNumberDisplay } from "utils/formatNumbers";
import useRedeemDirect from "./PortfolioDetails/hooks/useRedeemDirect";
import { successNotification } from "utils/notification";

const Wrapper = styled.div`
  padding: 24px 32px;
  position: relative;
`;

const LinearGradientWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.linearGradient.primary};
  opacity: 0.02;
  position: absolute;
  top: 0;
  left: 0;
`;

const ContainerWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 27px;
  grid-auto-flow: column;
  grid-template-columns: 235px 235px 1fr;
  align-items: end;
  @media screen and (max-width: 768px) {
    grid-auto-flow: row;
    grid-template-columns: auto;
  }
`;

const Card = styled.div`
  padding: 16px 19px;
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  background: ${({ theme }) => theme.useColorModeValue("transparent", theme.dark.block)};
  border-radius: 8px;
  position: relative;
`;

const CardTitle = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
`;

const CardValue = styled.div`
  color: ${({ theme }) => theme.primary.deep};
  margin: 8px 0 6px 0;
`;

const CardAction = styled.div`
  display: grid;
  gap: 10px;
  grid-auto-flow: column;
  width: fit-content;
`;

const ButtonWrapper = styled(Button)`
  font-size: 12px;
  height: 30px;
  padding: 0 12px;
  border-radius: 4px;
  width: fit-content;
`;

const Prompt = styled.div`
  padding: 18px;
  width: 100%;
  height: fit-content;
  position: relative;
  border-radius: 8px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.block)};
  display: grid;
  gap: 5px;
  grid-auto-flow: column;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

type TProps = WrappedComponentProps & {
  totalAmount: string;
  assets: string;
  // redeemLoading?: boolean;
  // redeemDirect: (i: number) => Promise<void>;
  isCurrentCycle: boolean;
  isPending: boolean;
  isActive: boolean;
  currentTranche: number;
  tranchesPendingReward: any;
  fee: string;
  trancheMasterAddress: string;
};

const SparePositionFold = memo<TProps>(
  ({
    intl,
    totalAmount,
    assets,
    // redeemLoading,
    // redeemDirect,
    isCurrentCycle,
    currentTranche,
    isPending,
    isActive,
    tranchesPendingReward,
    fee,
    trancheMasterAddress
  }) => {
    const { gray, primary, shadow, linearGradient, white, useColorModeValue } = useTheme();

    const [redeemLoading, setRedeemLoading] = useState(false);
    const { onRedeemDirect } = useRedeemDirect(trancheMasterAddress);
    const redeemDirect = async (i: number) => {
      setRedeemLoading(true);
      try {
        await onRedeemDirect(i);
        successNotification("Redeem Success", "");
      } catch (e) {
        console.error(e);
      } finally {
        setRedeemLoading(false);
      }
    };
    useEffect(() => {
      return () => {
        console.log("clean");
      };
    }, []);
    return (
      <Wrapper>
        <LinearGradientWrapper />
        <ContainerWrapper>
          <Card>
            <CardTitle>
              <div>
                {intl.formatMessage({ defaultMessage: "Principal+" })}
                <Tooltip
                  overlay={intl.formatMessage({
                    defaultMessage: "Before the cycle starts, the principal can be redeemed in the Pending state."
                  })}
                >
                  <u
                    css={{
                      borderBottom: "1px dashed",
                      borderColor: useColorModeValue(gray.normal7, white.normal7),
                      color: useColorModeValue(gray.normal7, white.normal7),
                      textDecoration: "none"
                    }}
                  >
                    {intl.formatMessage({ defaultMessage: "Est. Yield" })}
                  </u>
                </Tooltip>
              </div>
              <Tooltip
                overlay={intl.formatMessage({
                  defaultMessage:
                    "In the active state, the yield is the theoretical yield calculated based on the theoretical APR.The actual yield is subject to the system display after expiration."
                })}
                css={{ position: "absolute", top: 16, right: 17 }}
              >
                <Union css={{ color: useColorModeValue(gray.normal3, white.normal7) }} />
              </Tooltip>
            </CardTitle>
            <CardValue>
              {numeral(totalAmount).format("0,0.[0000]")} {assets}
            </CardValue>
            <CardAction>
              {isCurrentCycle && isPending && (
                <ButtonWrapper type="primary" onClick={() => redeemDirect(currentTranche)} loading={redeemLoading}>
                  {intl.formatMessage({ defaultMessage: "Redeem" })}
                </ButtonWrapper>
              )}
              <ButtonWrapper type="primary" onClick={() => redeemDirect(currentTranche)} loading={redeemLoading}>
                {intl.formatMessage({ defaultMessage: "Redeem" })}
              </ButtonWrapper>
              <ButtonWrapper type="primary" style={{ visibility: "hidden" }}>
                {intl.formatMessage({ defaultMessage: "Re-deposit" })}
              </ButtonWrapper>
            </CardAction>
          </Card>
          <Card>
            <CardTitle>{intl.formatMessage({ defaultMessage: "WTF Reward" })}</CardTitle>
            <CardValue>
              {isCurrentCycle && isActive
                ? numeral(formatNumberDisplay(tranchesPendingReward)).format("0,0.[0000]")
                : "-"}{" "}
              WTF
            </CardValue>
            <CardAction>
              <ButtonWrapper style={{ visibility: "hidden" }} type="primary">
                {intl.formatMessage({ defaultMessage: "Claim" })}
              </ButtonWrapper>
            </CardAction>
          </Card>
          <Prompt>
            <Union css={{ color: primary.deep }} />
            <div>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "After maturity, you can choose to withdraw all the principal + yield. The platform will charge a fee of (principal + all yield in the current period) x {number}."
                  },
                  {
                    number: <span css={{ color: primary.deep }}>{fee}%</span>
                  }
                )}
              </p>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage: `
                  You can also select {deposit} to the next cycle, and you can change the Tranche and amount during Roll-deposit.`
                  },
                  {
                    deposit: (
                      <span css={{ color: primary.deep }}>
                        {intl.formatMessage({ defaultMessage: "Roll-deposit" })}
                      </span>
                    )
                  }
                )}
              </p>
            </div>
          </Prompt>
        </ContainerWrapper>
      </Wrapper>
    );
  }
);

export default injectIntl(SparePositionFold);
