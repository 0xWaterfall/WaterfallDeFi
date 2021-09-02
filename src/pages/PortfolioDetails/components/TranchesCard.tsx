/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Separator from "components/Separator/Separator";
import { useTheme } from "@emotion/react";
import { Market, Pool, Tranche } from "types";
import {
  formatAPY,
  formatAllocPoint,
  formatTVL,
  formatNumberSeparator,
  getJuniorAPY,
  getRemaining,
  compareNum,
  getPercentage
} from "utils/formatNumbers";
import { CheckCircleTwoTone, CheckCircleOutlined } from "@ant-design/icons";

type TProps = WrappedComponentProps & {
  color?: string;
  type: "Senior" | "Mezzanine" | "Junior";
  tranche: Tranche;
  pool: Pool;
  totalAllocPoint: number | undefined;
  trancheIndex: number;
  assets: string;
  selected: boolean;
  data: Market;
};

type ProgressBarProps = {
  percentage: string;
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
  cursor: pointer;
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
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
  position: relative;
  background-color: ${({ theme }) => theme.primary.lightBrown};
  &:after {
    content: "";
    background-color: ${({ color }) => color};
    width: ${({ percentage }) => percentage}%;
    height: 6px;
    position: absolute;
  }
`;

const CheckDiv = styled.div`
  position: absolute;
  right: 20px;
  width: 20px;
  height: 20px;
  & svg {
    width: 20px;
    height: 20px;
  }
`;

const TranchesCard = memo<TProps>(({ intl, type, pool, tranche, totalAllocPoint, assets, selected, data }) => {
  const { tags, primary, gray } = useTheme();
  const Types = {
    Senior: {
      color: tags.yellowText,
      text: intl.formatMessage({ defaultMessage: "Senior" }),
      riskText: "Low Risk ; Fixed"
    },
    Mezzanine: {
      color: tags.greenText,
      text: intl.formatMessage({ defaultMessage: "Mezzanine" }),
      riskText: "Medium Risk ; Fixed"
    },
    Junior: {
      color: primary.deep,
      text: intl.formatMessage({ defaultMessage: "Junior" }),
      riskText: "Multiple Leverage ; Variable"
    }
  };
  return (
    <Container style={selected ? { borderColor: primary.deep } : undefined}>
      {compareNum(tranche.principal, tranche.target) ? (
        <SoldOut>{intl.formatMessage({ defaultMessage: "Sold out" })}</SoldOut>
      ) : null}
      <CheckDiv>
        {selected ? (
          <CheckCircleTwoTone twoToneColor={primary.deep} />
        ) : (
          <CheckCircleOutlined style={{ color: gray.normal3 }} />
        )}
      </CheckDiv>

      <div>
        <Text1>
          <Dot color={Types[type].color} />
          {Types[type].text}
        </Text1>
        <Text2 color={Types[type].color}>
          APY {type !== "Junior" ? formatAPY(tranche.apy) : getJuniorAPY(data.tranches, data.duration)} +{" "}
          {formatAllocPoint(pool.allocPoint, totalAllocPoint)}% WTF
        </Text2>
        <Text3>{Types[type].riskText}</Text3>
        <Separator margin={15} />
        <StatusDiv>
          <Text3>
            TVL: {formatNumberSeparator(formatTVL(tranche.principal))} {assets}
          </Text3>
          <Text4>
            Remaining:{getRemaining(tranche?.target, tranche?.principal)} {assets}
          </Text4>
        </StatusDiv>
        <ProgressBar color={Types[type].color} percentage={getPercentage(tranche.principal, tranche.target)} />
      </div>
    </Container>
  );
});

export default injectIntl(TranchesCard);
