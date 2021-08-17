/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Separator from "components/Separator/Separator";

type TProps = WrappedComponentProps;
interface Props {
  color?: string;
}

type ProgressBarProps = {
  current: number;
  total: number;
};

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
  margin: 10px 0;
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
const SoldOut = styled.div`
  font-size: 14px;
  width: 75px;
  height: 30px;
  border: 2px solid ${({ theme }) => theme.tags.redText};
  color: ${({ theme }) => theme.tags.redText};
  box-sizing: border-box;
  border-radius: 4px;
  transform: rotate(-30deg);
  position: absolute;
  left: -20px;
  top: -9px;
  text-align: center;
  line-height: 30px;
  background-color: white;
`;
const Container = styled.div`
  padding: 20px;
  position: relative;
  @media screen and (max-width: 768px) {
    & {
      height: auto;
    }
  }
`;
const ProgressBar = styled.div<ProgressBarProps>`
  margin: 10px 0;
  border-radius: 2px;
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.primary.lightBrown};
  &:after {
    content: "";
    background-color: ${({ color }) => color};
    width: ${({ current, total }) => (current / total) * 100}%;
    height: 6px;
    position: absolute;
  }
`;
const TranchesCard = memo<TProps & Props>(({ intl, color }) => {
  return (
    <Container>
      <SoldOut>{intl.formatMessage({ defaultMessage: "Sold out" })}</SoldOut>
      <Text1>
        <Dot color={color} />
        Senior
      </Text1>
      <Text2 color={color}>APY 3% + 25% WTF</Text2>
      <Text3>Low Risk ; Fixed</Text3>
      <Separator margin={15} />
      <StatusDiv>
        <Text3>TVL: 200,000 BUSD</Text3>
        <Text4>Remaining: 100,000 USDC</Text4>
      </StatusDiv>
      <ProgressBar color={color} current={66} total={100} />
    </Container>
  );
});

export default injectIntl(TranchesCard);
