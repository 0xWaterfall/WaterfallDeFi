/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Market } from "types";
import PortfolioChart from "./PortfolioChart";
import TrancheChart from "./TrancheChart";
import Button from "components/Button/Button";
// import { usePendingWTFReward, useTrancheBalance } from "hooks";
import { formatBalance, formatBigNumber2HexString } from "utils/formatNumbers";
import { successNotification } from "utils/notification";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useClaimAll from "../hooks/useClaimAll";
import useWithdraw from "../hooks/useWithdraw";
import ReDeposit from "pages/Portfolio/components/ReDeposit/ReDeposit";
// import { usePendingWTFReward } from "hooks/useSelectors";
import { useAppDispatch } from "store";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import { BIG_TEN } from "utils/bigNumber";
import { setConfirmModal } from "store/showStatus";
import { useMulticurrencyTrancheBalance, usePendingWTFReward, useTrancheBalance } from "hooks";
import ClaimPopup from "./ClaimPopup";
import useAutoRoll from "../hooks/useAutoRoll";
import { Switch } from "antd";
import { ArrowRight2 } from "assets/images";

const Wrapper = styled.div`
  display: grid;
  padding: 62px 0 20px;
  gap: 20px;
  grid-auto-flow: column;
  grid-template-columns: 30% repeat(2, 1fr);
  @media screen and (max-width: 768px) {
    grid-auto-flow: row;
    grid-template-columns: auto;
  }
`;

const RecordCard = styled.div`
  display: grid;
  gap: 20px;
  grid-auto-flow: row;
  position: relative;
  section {
    padding: 12px 20px 12px 32px;
    min-height: 140px;
    background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.block)};
    border-radius: 12px;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal5)};
    filter: ${({ theme }) => theme.filter.card};
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 12px;
    :after {
      content: "";
      position: absolute;
      background-color: ${({ theme }) => theme.primary.deep};
      top: 12px;
      left: 0;
      height: calc(100% - 24px);
      width: 5px;
    }
    button {
      width: fit-content;
      padding: 0 12px;
      font-size: 12px;
    }
    div {
      :nth-of-type(1) {
        color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
      }
      :nth-of-type(2) {
        color: ${({ theme }) => theme.primary.deep};
        font-size: 20px;
      }

      :nth-of-type(3) {
        color: ${({ theme }) => theme.primary.deep};
        font-size: 12px;
      }
    }
  }
`;

const Block = styled.div`
  flex: 1;
  display: flex;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  filter: ${({ theme }) => theme.filter.card};
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.block)};
  border-radius: 12px;
`;

const ButtonWrapper = styled(Button)`
  border-radius: 4px;
  height: 28px;
  font-size: 12px;

  & > svg {
    margin-left: 5px;
  }
`;

const AutoRollLabel = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  margin-right: 12px;
  padding-top: 4px;
`;

type TProps = WrappedComponentProps & {
  data: Market;
  selectedDepositAsset: string;
  depositMultipleSimultaneous: boolean;
  setSelectedDepositAsset: React.Dispatch<React.SetStateAction<string>>;
  setDepositMultipleSimultaneous: React.Dispatch<React.SetStateAction<boolean>>;
  APYData: any[];
};

const Charts = memo<TProps>(
  ({
    intl,
    data,
    selectedDepositAsset,
    depositMultipleSimultaneous,
    setSelectedDepositAsset,
    setDepositMultipleSimultaneous,
    APYData
  }) => {
    const [claimRewardLoading, setClaimRewardLoading] = useState(false);
    const [withdrawAllLoading, setWithdrawAllLoading] = useState(false);
    const [showRedeposit, setShowRedeposit] = useState(false);
    const [showClaim, setShowClaim] = useState(false);

    const [autoRoll, setAutoRoll] = useState(false);
    const [autoRollPending, setAutoRollPending] = useState<boolean>(true);
    const { getAutoRoll, changeAutoRoll } = useAutoRoll(data.address);

    const { onWithdraw } = useWithdraw(data.address, data.isAvax, data.isMulticurrency);

    const { onClaimAll } = useClaimAll(data.masterChefAddress);

    const { balance, MCbalance, invested } = !data.isMulticurrency
      ? useTrancheBalance(data.address, data.isAvax)
      : useMulticurrencyTrancheBalance(data.address, data.assets.indexOf(selectedDepositAsset), data.assets.length);

    const { account } = useWeb3React<Web3Provider>();

    const { totalPendingReward, tranchesPendingReward } = usePendingWTFReward(
      data.masterChefAddress,
      data.trancheCount
    );
    const dispatch = useAppDispatch();
    // useEffect(() => {
    //   account && dispatch(getPendingWTFReward({ account }));
    //   // account && dispatch(getTrancheBalance({ account }));
    // }, [account]);

    useEffect(() => {
      if (data.autorollImplemented) {
        getAutoRoll().then((res) => {
          setAutoRoll(res);
          setAutoRollPending(false);
        });
      }
    }, []);

    const claimReward = async (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => {
      setClaimRewardLoading(true);

      dispatch(
        setConfirmModal({
          isOpen: true,
          txn: undefined,
          status: "PENDING",
          pendingMessage: intl.formatMessage({ defaultMessage: "Claiming " })
        })
      );
      try {
        await onClaimAll(_lockDurationIfLockNotExists, _lockDurationIfLockExists);
        successNotification("Claim Success", "");
      } catch (e) {
        console.error(e);
        dispatch(
          setConfirmModal({
            isOpen: true,
            txn: undefined,
            status: "REJECTED",
            pendingMessage: intl.formatMessage({ defaultMessage: "Claim Fail " })
          })
        );
      } finally {
        setShowClaim(false);

        setClaimRewardLoading(false);
      }
    };
    const withdrawAll = async () => {
      setWithdrawAllLoading(true);

      dispatch(
        setConfirmModal({
          isOpen: true,
          txn: undefined,
          status: "PENDING",
          pendingMessage: intl.formatMessage({ defaultMessage: "Withdrawing" })
        })
      );
      try {
        if (!balance) return;
        await onWithdraw(
          formatBigNumber2HexString(new BigNumber(balance).times(BIG_TEN.pow(18))),
          MCbalance ? MCbalance : []
        );
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
    const rollDepositPopup = () => {
      setShowRedeposit(!showRedeposit);
    };
    const claimPopup = () => {
      if (totalPendingReward !== "0") setShowClaim(!showClaim);
      // setShowClaim(!showClaim);
    };

    return (
      <Wrapper>
        <RecordCard>
          <section>
            <div>{intl.formatMessage({ defaultMessage: "Return Principal + Yield" })}</div>
            <div css={{ padding: "10px 0" }}>
              {!data.isMulticurrency
                ? balance
                  ? numeral(balance).format("0,0.[0000]")
                  : "--"
                : MCbalance
                ? numeral(
                    new BigNumber(MCbalance[data.assets.indexOf(selectedDepositAsset)]).dividedBy(BIG_TEN.pow(18))
                  ).format("0,0.[00000]")
                : "--"}{" "}
              {selectedDepositAsset}
            </div>
            <div>
              <ButtonWrapper
                type="default"
                onClick={() => {
                  withdrawAll();
                }}
                loading={withdrawAllLoading}
                disabled={!account || !+balance}
                css={{ marginRight: 17 }}
              >
                {intl.formatMessage({ defaultMessage: "Withdraw All" })}
              </ButtonWrapper>
              <ButtonWrapper
                type="default"
                onClick={rollDepositPopup}
                disabled={!account || !+balance || data?.isRetired || autoRoll}
              >
                {intl.formatMessage({ defaultMessage: "Roll Deposit" })}
              </ButtonWrapper>
            </div>
            {account && data.autorollImplemented ? (
              <div css={{ display: "flex", marginTop: 20 }}>
                <AutoRollLabel>Auto Rolling</AutoRollLabel>
                <div css={{ padding: 1.5, backgroundColor: "#FFFFFF", borderRadius: 10 }}>
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
                    <div css={{ fontSize: 12, padding: 3 }}>
                      <span css={{ color: "#0066FF" }}>Transaction Pending...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </section>
          <section>
            <div>{intl.formatMessage({ defaultMessage: "WTF Reward" })}</div>
            <div>
              {totalPendingReward
                ? numeral(new BigNumber(totalPendingReward.toString()).dividedBy(BIG_TEN.pow(18))).format("0,0.[0000]")
                : "--"}{" "}
              WTF
            </div>
            {/* <div>{intl.formatMessage({ defaultMessage: "Claim Coming Soon" })}</div> */}
            <div>
              <ButtonWrapper type="default" onClick={() => claimPopup()}>
                {intl.formatMessage({ defaultMessage: "Claim" })} <ArrowRight2 />
              </ButtonWrapper>
              {/* <ButtonWrapper
                type="default"
                onClick={() => claimReward()}
                loading={claimRewardLoading}
                disabled={!account || !+totalPendingReward}
              >
                {intl.formatMessage({ defaultMessage: "Claim" })}
              </ButtonWrapper> */}
              {/* <ButtonWrapper
              type="default"
              css={{ marginLeft: 17, position: "relative" }}
              style={{ width: 90 }}
              onClick={() => {
                push("/stake");
              }}
            >
              {intl.formatMessage({ defaultMessage: "To Stake" })}
              <ToStakeImg css={{ position: "absolute", top: -5, left: -5 }} />
            </ButtonWrapper> */}
            </div>
          </section>
        </RecordCard>
        <Block>
          <PortfolioChart strategyFarms={data.strategyFarms} APYData={APYData} />
        </Block>
        <Block>
          <TrancheChart tranches={data.tranches} totalTranchesTarget={data.totalTranchesTarget} />
        </Block>

        <ReDeposit
          visible={showRedeposit}
          data={data}
          selectedDepositAsset={selectedDepositAsset}
          onCancel={rollDepositPopup}
          balance={formatBalance(balance.toString())}
          depositMultipleSimultaneous={depositMultipleSimultaneous}
          setSelectedDepositAsset={setSelectedDepositAsset}
          setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
        />
        <ClaimPopup
          visible={showClaim}
          data={data}
          onCancel={claimPopup}
          balance={totalPendingReward}
          claimReward={claimReward}
        />
      </Wrapper>
    );
  }
);

export default injectIntl(Charts);
