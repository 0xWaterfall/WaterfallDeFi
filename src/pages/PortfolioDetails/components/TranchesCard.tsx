/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import { Mountain } from "assets/images";
import { Row, Col } from "antd";

type TProps = WrappedComponentProps;
interface Props {
  color?: string;
}
const Text1 = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.gray.normal7};
  display: flex;
`;
const Text2 = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ color }) => color};
`;
const Text3 = styled.div`
  font-size: 12px;
  line-height: 125%;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.gray.normal5};
`;
const Text4 = styled.div`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.gray.normal7};
`;
const StatusDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Dot = styled.div`
  background-color: ${({ color }) => color};
  width: 8px;
  height: 8px;
  border-radius: 100%;
  margin-top: 5px;
  margin-right: 5px;
`;
const TranchesCard = memo<TProps & Props>(({ intl, color }) => {
  const { gray, white, primary, table } = useTheme();
  const { push } = useHistory();

  return (
    <div css={{ padding: "10px" }}>
      <Text1>
        <Dot color={color} />
        Senior
      </Text1>
      <Text2 color={color}>APY 3% + 25% WTF</Text2>
      <Text3>Low Risk ; Fixed</Text3>
      <StatusDiv>
        <Text3>TVL: 200,000 BUSD</Text3>
        <Text4>Remaining: 100,000 USDC</Text4>
      </StatusDiv>
    </div>
  );
});

export default injectIntl(TranchesCard);
