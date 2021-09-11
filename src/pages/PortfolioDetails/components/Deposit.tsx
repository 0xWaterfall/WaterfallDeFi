/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Mountain } from "assets/images";
import DepositItem from "./DepositItem";
import { useHistory, useLocation } from "react-router-dom";
import { Market } from "types";
import { useMarket } from "hooks";
import { useSelectedMarket } from "hooks/useSelectors";

type TProps = WrappedComponentProps & {
  data: Market;
};

const Text1 = styled.div`
  font-size: 20px;
  line-height: 27px;
  color: ${({ theme }) => theme.primary.deep};
`;

const NextTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
`;

const Text2 = styled.div`
  font-size: 20px;
  line-height: 27px;
  color: ${({ theme }) => theme.gray.normal85};
`;

const Deposit = memo<TProps>(({ intl, data }) => {
  const marketData = data;
  return (
    <div css={{ padding: "0 20px" }}>
      <NextTimeWrapper>
        <Mountain />
        <Text1>{intl.formatMessage({ defaultMessage: "Next Cycle" })}: 2021/08/07</Text1>
        <Text2>{intl.formatMessage({ defaultMessage: "Active Cycle" })}: 2021/07/01-2021/07/08</Text2>
      </NextTimeWrapper>
      {marketData && <DepositItem data={marketData} />}
    </div>
  );
});

export default injectIntl(Deposit);
