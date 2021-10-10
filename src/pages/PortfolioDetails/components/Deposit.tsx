/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Mountain } from "assets/images";
import DepositItem from "./DepositItem";
import { useHistory, useLocation } from "react-router-dom";
import { Market, PORTFOLIO_STATUS } from "types";
import { useMarket } from "hooks";
import { useSelectedMarket } from "hooks/useSelectors";
import { formatTimestamp } from "utils/formatNumbers";
import Countdown from "react-countdown";

type TProps = WrappedComponentProps & {
  data: Market;
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
  color: ${({ theme }) => theme.gray.normal5};
  margin-top: 13px;
`;

const StepBar = styled.div`
  padding-left: 150px;
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
  background: ${({ theme }) => theme.gray.normal3};
  @media screen and (max-width: 1024px) {
    width: auto;
  }
`;

const Deposit = memo<TProps>(({ intl, data }) => {
  const marketData = data;
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
        </NextCycleWrapper>
      ) : null}
      <StepBar>
        <Step>1</Step>
        <StepName>{intl.formatMessage({ defaultMessage: "Choose Tranche" })}</StepName>
        <Line />
        <Step>2</Step>
        <StepName>{intl.formatMessage({ defaultMessage: "Deposit" })}</StepName>
      </StepBar>
      {marketData && <DepositItem data={marketData} />}
    </div>
  );
});

export default injectIntl(Deposit);
