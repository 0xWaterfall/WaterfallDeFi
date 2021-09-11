/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useLocation } from "react-router-dom";
import { Market } from "types";
import PortfolioChart from "./PortfolioChart";
import TrancheChart from "./TrancheChart";
import { useTheme } from "@emotion/react";
import Button from "components/Button/Button";
import { usePendingWTFReward, useTrancheBalance } from "hooks";
import { formatBigNumber2HexString, formatNumberDisplay } from "utils/formatNumbers";
import { successNotification } from "utils/notification";

import { AbiItem } from "web3-utils";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Web3 from "web3";
import useClaimAll from "../hooks/useClaimAll";
import useWithdraw from "../hooks/useWithdraw";
const Block2 = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  & > div {
    padding-top: 12px;
    padding-left: 36px;
    padding-right: 20px;
    margin-bottom: 20px;
    background: #ffffff;
    border-radius: 12px;
    color: ${({ theme }) => theme.gray.normal7};
    filter: drop-shadow(0px 10px 20px rgba(2, 103, 255, 0.05));
  }
  & > div:after {
    content: "";
    position: absolute;
    background-color: ${({ theme }) => theme.primary.deep};
    top: 12px;
    left: 0;
    height: calc(100% - 24px);
    width: 5px;
  }
`;
const Block = styled.div`
  // padding-left: 130px;
  flex: 1;
  display: flex;
  color: ${({ theme }) => theme.gray.normal7};

  @media screen and (max-width: 1024px) {
    background-color: ${({ theme }) => theme.primary.lightBrown};
    padding-left: 0;
    margin: auto;
    margin-bottom: 10px;
    width: 100%;
    padding: 20px;
    border-radius: 12px;

    display: flex;
    justfify-content: space-between;
    & > * {
    }
  }
`;

type TProps = WrappedComponentProps & {
  data: Market;
};

const Charts = memo<TProps>(({ intl, data }) => {
  const { gray, primary, fonts } = useTheme();
  const [claimRewardLoading, setClaimRewardLoading] = useState(false);
  const [withdrawAllLoading, setWithdrawAllLoading] = useState(false);

  const { onWithdraw } = useWithdraw();

  const { onClaimAll } = useClaimAll();

  const { balance, invested } = useTrancheBalance();

  const pendingReward = usePendingWTFReward();
  const claimReward = async () => {
    setClaimRewardLoading(true);
    try {
      await onClaimAll();
      successNotification("Claim Success", "");
    } catch (e) {
      console.log(e);
    } finally {
      setClaimRewardLoading(false);
    }
  };
  const withdrawAll = async () => {
    setWithdrawAllLoading(true);
    try {
      if (!balance) return;
      await onWithdraw(formatBigNumber2HexString(balance));
      successNotification("Withdraw All Success", "");
    } catch (e) {
      console.log(e);
    } finally {
      setWithdrawAllLoading(false);
    }
  };
  return (
    <div
      css={{
        display: "flex",
        paddingTop: 62,
        "@media screen and (max-width: 1024px)": {
          paddingTop: 10,
          flexDirection: "column"
        }
      }}
    >
      <Block2>
        <div>
          <div>
            <div>{intl.formatMessage({ defaultMessage: "Return principal+Interest" })}</div>
            <div css={{ padding: "16px 0", fontFamily: fonts.CarterOne, color: primary.deep, fontSize: 24 }}>
              {balance ? formatNumberDisplay(balance.toString()) : "-"} {data.assets}
            </div>
          </div>
          <div css={{ padding: "16px 0", borderTop: `1px solid ${primary.deep2}` }}>
            <Button type="primary" onClick={() => withdrawAll()} loading={withdrawAllLoading}>
              {intl.formatMessage({ defaultMessage: "Withdraw All" })}
            </Button>
          </div>
        </div>
        <div>
          <div>
            <div css={{ paddingBlock: 24, color: gray.normal7 }}>
              {intl.formatMessage({ defaultMessage: "WTF Reward" })}
            </div>
            <div css={{ fontFamily: fonts.CarterOne, color: primary.deep, fontSize: 24 }}>
              {pendingReward ? formatNumberDisplay(pendingReward.toString()) : "-"} WTF
            </div>
          </div>
          <div css={{ padding: "16px 0", borderTop: `1px solid ${primary.deep2}` }}>
            <Button type="default" onClick={() => claimReward()} loading={claimRewardLoading}>
              {intl.formatMessage({ defaultMessage: "Claim" })}
            </Button>
          </div>
        </div>
      </Block2>
      <Block>
        <PortfolioChart />
      </Block>
      <Block css={{ paddingTop: 8 }}>
        <TrancheChart tranches={data.tranches} totalTranchesTarget={data.totalTranchesTarget} />
      </Block>
    </div>
  );
});

export default injectIntl(Charts);
