/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Mountain, AlarmImg } from "assets/images";
import DepositItem from "./DepositItem";
import { Market, PORTFOLIO_STATUS } from "types";
import { formatTimestamp } from "utils/formatNumbers";
import Countdown from "react-countdown";
import Button from "components/Button/Button";
import moment from "moment";
import Coin from "components/Coin";
import Select, { Option } from "components/Select/Select";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";

type TProps = WrappedComponentProps & {
  data: Market;
  selectedDepositAsset: string;
  setSelectedDepositAsset: React.Dispatch<React.SetStateAction<string>>;
  depositMultipleSimultaneous: boolean;
  setDepositMultipleSimultaneous: React.Dispatch<React.SetStateAction<boolean>>;
};

const NextCycle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.primary.deep};
`;

const NextCycleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
`;

const ActiveCycle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
  margin-top: 13px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StepBar = styled.div`
  display: grid;
  gap: 10px;
  grid-auto-flow: column;
  width: fit-content;
  align-items: center;
  margin-bottom: 35px;
  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 0;
    grid-template-columns: auto auto 1fr auto auto;
  }
`;

const Step = styled.div`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.primary.deep};
  color: ${({ theme }) => theme.primary.deep};
  border-radius: 50%;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepName = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
`;

const Line = styled.div`
  height: 1px;
  width: 173px;
  background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal3, theme.white.normal3)};
  @media screen and (max-width: 1024px) {
    width: auto;
  }
`;
const ButtonWrapper = styled(Button)`
  margin-top: 10px !important;
  & > svg {
    margin-right: 10px;
  }
`;

const SelectDepositAsset = styled.div`
  display: flex;
  height: 35px;
`;

const RemainingDepositableOuter = styled.div`
  width: 160px;
  height: 6px;
  background-color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal2, theme.white.normal3)};
  border-radius: 4px;
  margin: 9px 20px 0 6px;
`;

const RemainingDepositableInner = styled.div`
  height: 6px;
  background-color: #0066ff;
  border-radius: 4px;
`;

const CoinRow = styled.div`
  display: flex;
  justify-content: flex-start;
  transform: translateX(-2.5px);
  & div:not(:last-child) {
    transform: translateX(2.5px);
  }
`;

const Deposit = memo<TProps>(
  ({
    intl,
    data,
    selectedDepositAsset,
    setSelectedDepositAsset,
    depositMultipleSimultaneous,
    setDepositMultipleSimultaneous
  }) => {
    const deposited: BigNumber[] = [];
    const tokens = data.tokens;
    const trancheInvest: { type: "BigNumber"; hex: string }[][] | undefined = data.trancheInvests;
    if (trancheInvest) {
      data.assets.forEach((a, i) =>
        deposited.push(
          trancheInvest
            .reduce((acc: BigNumber, next) => acc.plus(new BigNumber(next[i].hex.toString())), new BigNumber(0))
            .dividedBy(BIG_TEN.pow(18))
        )
      );
    }
    const maxDeposits = tokens.map((t) =>
      new BigNumber(data.totalTranchesTarget).multipliedBy(new BigNumber(t.percent.hex).dividedBy(BIG_TEN.pow(5)))
    );
    const remainingDepositable = new BigNumber(maxDeposits[data.assets.indexOf(selectedDepositAsset)]).minus(
      deposited[data.assets.indexOf(selectedDepositAsset)]
    );
    const remainingDepositableSimul = maxDeposits.map((md, i) => new BigNumber(md).minus(deposited[i]));
    const returnWidth = (assetIndex: number) =>
      deposited[assetIndex]
        ? deposited[assetIndex]
            .dividedBy(tokens.length > 0 ? maxDeposits[assetIndex].toString() : new BigNumber(1))
            .multipliedBy(100)
            .toString()
        : 0;
    const width = data.isMulticurrency ? returnWidth(data.assets.indexOf(selectedDepositAsset)) : 1;
    const widths = data.isMulticurrency ? data.assets.map((a, i) => returnWidth(i)) : [];
    const marketData = data;
    const handleReminder = (startTime: Number, endTime: Number) => {
      if (!window || !startTime || !endTime) return;
      const start = moment.unix(Number(startTime)).format("YYYYMMDDTHHmm");
      const end = moment.unix(Number(endTime)).format("YYYYMMDDTHHmm");
      window?.open(
        `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${start}/${end}&text=Waterfall`,
        "_blank"
      );
    };

    return (
      <div css={{ padding: "0 20px" }}>
        {data.status === PORTFOLIO_STATUS.ACTIVE && data.actualStartAt && data.duration ? (
          <NextCycleWrapper>
            <Mountain />
            <NextCycle>
              {intl.formatMessage({ defaultMessage: "Next Cycle" })}:{" "}
              <Countdown
                date={(Number(data.duration) + Number(data.actualStartAt)) * 1000}
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
            </NextCycle>
            <ActiveCycle>
              {intl.formatMessage({ defaultMessage: "Active Cycle" })}: {formatTimestamp(data.actualStartAt)} -
              {formatTimestamp(Number(data.actualStartAt) + Number(data.duration))}
            </ActiveCycle>
            <ButtonWrapper
              type="primary"
              onClick={() =>
                handleReminder(Number(data.actualStartAt), Number(data.actualStartAt) + Number(data.duration))
              }
            >
              <AlarmImg />
              {intl.formatMessage({ defaultMessage: "Remind me" })}
            </ButtonWrapper>
          </NextCycleWrapper>
        ) : null}

        <TopBar>
          <StepBar>
            <Step>1</Step>
            <StepName>{intl.formatMessage({ defaultMessage: "Choose Tranche" })}</StepName>
            <Line />
            <Step>2</Step>
            <StepName>{intl.formatMessage({ defaultMessage: "Deposit" })}</StepName>
          </StepBar>
          {data.isMulticurrency ? (
            <SelectDepositAsset>
              {!depositMultipleSimultaneous ? (
                <div css={{ display: "flex", paddingTop: "3.5px" }}>
                  {selectedDepositAsset !== "" ? <Coin assetName={selectedDepositAsset} size={24} /> : null}
                  <StepName css={{ padding: "1px 6px 0 6px" }}>
                    <span css={{ fontWeight: 900, marginRight: 10 }}>
                      {deposited[data.assets.indexOf(selectedDepositAsset)]
                        ? deposited[data.assets.indexOf(selectedDepositAsset)].toString()
                        : ""}{" "}
                      /{" "}
                      {deposited[data.assets.indexOf(selectedDepositAsset)]
                        ? maxDeposits[data.assets.indexOf(selectedDepositAsset)].toString()
                        : ""}
                    </span>
                    {selectedDepositAsset} Remaining
                  </StepName>
                  {deposited && maxDeposits && selectedDepositAsset && data.assets ? (
                    <RemainingDepositableOuter>
                      <RemainingDepositableInner css={{ width: width + "%" }} />
                    </RemainingDepositableOuter>
                  ) : null}
                </div>
              ) : (
                <div css={{ display: "flex", flexDirection: "column" }}>
                  {data.assets.map((asset, index) => (
                    <div key={asset} css={{ display: "flex", padding: "3.5px 0" }}>
                      <Coin assetName={asset} size={24} />
                      <StepName css={{ padding: "1px 6px 0 6px" }}>
                        <span css={{ fontWeight: 900, marginRight: 10 }}>
                          {deposited[index].toString()} / {maxDeposits[index].toString()}
                        </span>
                        {asset} Remaining
                      </StepName>
                      <RemainingDepositableOuter>
                        <RemainingDepositableInner css={{ width: widths[index] + "%" }} />
                      </RemainingDepositableOuter>
                    </div>
                  ))}
                </div>
              )}
              <Select
                value={depositMultipleSimultaneous ? "multi" : selectedDepositAsset}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  if (e.toString() !== "multi") {
                    setDepositMultipleSimultaneous(false);
                    setSelectedDepositAsset(e.toString());
                  } else {
                    setDepositMultipleSimultaneous(true);
                  }
                }}
              >
                {marketData.assets.map((a, i) => (
                  <Option key={i} value={a}>
                    <div css={{ display: "flex", alignItems: "center" }}>
                      <Coin assetName={a} size={24} />
                      <div css={{ paddingLeft: "5px" }}>{a}</div>
                    </div>
                  </Option>
                ))}
                <Option key="multi" value="multi">
                  <div css={{ display: "flex", alignItems: "center" }}>
                    <CoinRow>
                      {marketData.assets.map((a, i) => (
                        <Coin key={i} assetName={a} size={24} />
                      ))}
                    </CoinRow>
                    <div css={{ paddingLeft: "5px" }}>Multiple</div>
                  </div>
                </Option>
              </Select>
            </SelectDepositAsset>
          ) : null}
        </TopBar>
        {marketData && (
          <DepositItem
            data={marketData}
            selectedDepositAsset={selectedDepositAsset}
            remainingDepositable={remainingDepositable}
            depositMultipleSimultaneous={depositMultipleSimultaneous}
            remainingDepositableSimul={remainingDepositableSimul}
            setSelectedDepositAsset={setSelectedDepositAsset}
            setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
          />
        )}
      </div>
    );
  }
);

export default injectIntl(Deposit);
