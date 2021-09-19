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
      {marketData && <DepositItem data={marketData} />}
    </div>
  );
});

export default injectIntl(Deposit);
