/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useLocation } from "react-router-dom";
import { Market } from "types";
import PortfolioChart from "./PortfolioChart";
import TrancheChart from "./TrancheChart";
import { useTheme } from "@emotion/react";
import Button from "components/Button/Button";
// import { usePendingWTFReward, useTrancheBalance } from "hooks";
import {
  formatBalance,
  formatBigNumber2HexString,
  formatNumberDisplay,
  formatNumberSeparator
} from "utils/formatNumbers";
import { successNotification } from "utils/notification";

import { AbiItem } from "web3-utils";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Web3 from "web3";
import useClaimAll from "../hooks/useClaimAll";
import useWithdraw from "../hooks/useWithdraw";
import ReDeposit from "pages/Portfolio/components/ReDeposit/ReDeposit";
import { usePendingWTFReward, useTrancheBalance } from "hooks/useSelectors";
import { useAppDispatch } from "store";
import { getPendingWTFReward, getTrancheBalance, setPendingWTFReward } from "store/position";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import { BIG_TEN } from "utils/bigNumber";

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
`;

type TProps = WrappedComponentProps & {
  data: Market;
};

const Charts = memo<TProps>(({ intl, data }) => {
  const [claimRewardLoading, setClaimRewardLoading] = useState(false);
  const [withdrawAllLoading, setWithdrawAllLoading] = useState(false);
  const [showRedeposit, setShowRedeposit] = useState(false);

  const { onWithdraw } = useWithdraw();

  const { onClaimAll } = useClaimAll();

  const { balance, invested } = useTrancheBalance();
  const { account } = useWeb3React<Web3Provider>();

  const { totalPendingReward } = usePendingWTFReward();
  const dispatch = useAppDispatch();
  useEffect(() => {
    account && dispatch(getPendingWTFReward({ account }));
    account && dispatch(getTrancheBalance({ account }));
  }, [account]);
  const claimReward = async () => {
    setClaimRewardLoading(true);
    try {
      await onClaimAll();
      successNotification("Claim Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setClaimRewardLoading(false);
    }
  };
  const withdrawAll = async () => {
    setWithdrawAllLoading(true);
    try {
      if (!balance) return;
      await onWithdraw(formatBigNumber2HexString(new BigNumber(balance).times(BIG_TEN.pow(18))));
      successNotification("Withdraw All Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setWithdrawAllLoading(false);
    }
  };
  const rollDepositPopup = () => {
    setShowRedeposit(!showRedeposit);
  };
  return (
    <Wrapper>
      <RecordCard>
        <section>
          <div>{intl.formatMessage({ defaultMessage: "Return principal + yield" })}</div>
          <div>
            {balance ? numeral(balance.toString()).format("0,0") : "--"} {data.assets}
          </div>
          <div>
            <ButtonWrapper
              type="default"
              onClick={withdrawAll}
              loading={withdrawAllLoading}
              disabled={!account || !+balance}
              css={{ marginRight: 17 }}
            >
              {intl.formatMessage({ defaultMessage: "Withdraw All" })}
            </ButtonWrapper>
            <ButtonWrapper type="default" onClick={rollDepositPopup} disabled={!account || !+balance}>
              {intl.formatMessage({ defaultMessage: "Roll Deposit" })}
            </ButtonWrapper>
          </div>
        </section>
        <section>
          <div>{intl.formatMessage({ defaultMessage: "WTF Reward" })}</div>
          <div>{totalPendingReward ? formatNumberDisplay(totalPendingReward.toString()) : "--"} WTF</div>
          <ButtonWrapper
            type="default"
            onClick={() => claimReward()}
            loading={claimRewardLoading}
            disabled={!account || !+totalPendingReward}
          >
            {intl.formatMessage({ defaultMessage: "Claim" })}
          </ButtonWrapper>
        </section>
      </RecordCard>
      <Block>
        <PortfolioChart />
      </Block>
      <Block>
        <TrancheChart tranches={data.tranches} totalTranchesTarget={data.totalTranchesTarget} />
      </Block>

      <ReDeposit
        visible={showRedeposit}
        data={data}
        onCancel={rollDepositPopup}
        balance={formatBalance(balance.toString())}
      />
    </Wrapper>
  );
});

export default injectIntl(Charts);
