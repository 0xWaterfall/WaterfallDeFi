/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { memo, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "components/Button/Button";
import { useState } from "react";
import Tooltip from "components/Tooltip/Tooltip";
import { Union } from "assets/images";
import styled from "@emotion/styled";
import numeral from "numeral";
import { formatBigNumber2HexString, formatNumberDisplay } from "utils/formatNumbers";
import useRedeemDirect from "./PortfolioDetails/hooks/useRedeemDirect";
import { successNotification } from "utils/notification";
import useWithdraw from "./PortfolioDetails/hooks/useWithdraw";
import { useAppDispatch } from "store";
import { useTrancheBalance } from "hooks";
import { setConfirmModal } from "store/showStatus";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import useAutoRoll from "./PortfolioDetails/hooks/useAutoRoll";
import { Switch } from "antd";

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
  totalAmounts: string[];
  assets: string[];
  // redeemLoading?: boolean;
  // redeemDirect: (i: number) => Promise<void>;
  isCurrentCycle: boolean;
  isPending: boolean;
  isActive: boolean;
  currentTranche: number;
  tranchesPendingReward: any;
  fee: string;
  trancheMasterAddress: string;
  isMulticurrency: boolean;
  autorollImplemented: boolean;
};

const SparePositionFold = memo<TProps>(
  ({
    intl,
    totalAmount,
    totalAmounts,
    assets,
    // redeemLoading,
    // redeemDirect,
    isCurrentCycle,
    currentTranche,
    isPending,
    isActive,
    tranchesPendingReward,
    fee,
    trancheMasterAddress,
    isMulticurrency,
    autorollImplemented
  }) => {
    const { gray, primary, white, useColorModeValue } = useTheme();
    const [withdrawAllLoading, setWithdrawAllLoading] = useState(false);

    const [redeemLoading, setRedeemLoading] = useState(false);
    const { onRedeemDirect } = useRedeemDirect(trancheMasterAddress);
    const { onWithdraw } = useWithdraw(trancheMasterAddress, isMulticurrency);
    const { balance, invested } = useTrancheBalance(trancheMasterAddress);

    const [autoRoll, setAutoRoll] = useState(false);
    const [autoRollPending, setAutoRollPending] = useState<boolean>(true);
    const { getAutoRoll, changeAutoRoll } = useAutoRoll(trancheMasterAddress);
    //TODO: handle tracking ALL multicurrency deposits for a specific held MC falls position
    // !isMulticurrency ? useTrancheBalance(trancheMasterAddress) : useAllMulticurrencyTrancheBalance(trancheMasterAddress, assets.length);
    const dispatch = useAppDispatch();

    const withdrawAll = async () => {
      setWithdrawAllLoading(true);

      dispatch(
        setConfirmModal({
          isOpen: true,
          txn: undefined,
          status: "PENDING",
          pendingMessage:
            intl.formatMessage({ defaultMessage: `Withdrawing` }) +
            " " +
            balance +
            " " +
            intl.formatMessage({ defaultMessage: "from All Tranches" })
        })
      );
      try {
        if (!balance) return;
        await onWithdraw(formatBigNumber2HexString(new BigNumber(balance).times(BIG_TEN.pow(18))));
        successNotification("Withdraw All Success", "");
      } catch (e) {
        console.error(e);

        dispatch(
          setConfirmModal({
            isOpen: true,
            txn: undefined,
            status: "REJECTED",
            pendingMessage: intl.formatMessage({ defaultMessage: "Withdraw Fail " })
          })
        );
      } finally {
        setWithdrawAllLoading(false);
      }
    };
    const redeemDirect = async (i: number) => {
      setRedeemLoading(true);
      try {
        const result = await onRedeemDirect(i);
        successNotification("Redeem Success", "");
      } catch (e) {
        console.error(e);
      } finally {
        setRedeemLoading(false);
      }
    };

    useEffect(() => {
      if (autorollImplemented) {
        getAutoRoll().then((res) => {
          setAutoRoll(res);
          setAutoRollPending(false);
        });
      }
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
            {!isMulticurrency ? (
              <CardValue>
                {numeral(totalAmount).format("0,0.[0000]")} {assets}
              </CardValue>
            ) : (
              totalAmounts.map((a, i) => (
                <CardValue key={i}>
                  {numeral(a).format("0,0.[0000]")} {assets[i]}
                </CardValue>
              ))
            )}
            <CardAction>
              {isCurrentCycle && isPending && (
                <ButtonWrapper
                  type="primary"
                  onClick={() => redeemDirect(currentTranche)}
                  disabled={autoRoll}
                  loading={redeemLoading}
                >
                  {intl.formatMessage({ defaultMessage: "Redeem" })}
                </ButtonWrapper>
              )}
              {!isPending && !isActive && (
                <ButtonWrapper
                  type="primary"
                  onClick={withdrawAll}
                  loading={withdrawAllLoading}
                  disabled={!+balance || autoRoll}
                >
                  {intl.formatMessage({ defaultMessage: "Withdraw All Tranches" })}
                </ButtonWrapper>
              )}
              <ButtonWrapper type="primary" style={{ visibility: "hidden" }}>
                {intl.formatMessage({ defaultMessage: "Re-deposit" })}
              </ButtonWrapper>
            </CardAction>
            {autorollImplemented ? (
              <div css={{ display: "flex", marginTop: 20 }}>
                <span
                  css={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: "rgba(51,51,51,0.7)",
                    marginRight: 12,
                    paddingTop: "4px"
                  }}
                >
                  Auto Rolling
                </span>
                <div css={{ paddingTop: 2.5 }}>
                  {!autoRollPending ? (
                    <Switch
                      checked={autoRoll}
                      onChange={() => {
                        setAutoRollPending(true);
                        changeAutoRoll(!autoRoll).then((res) => {
                          getAutoRoll().then((res2) => {
                            setAutoRoll(res2);
                            setAutoRollPending(false);
                          });
                        });
                      }}
                    />
                  ) : (
                    <div>Transaction Pending...</div>
                  )}
                </div>
              </div>
            ) : null}
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
