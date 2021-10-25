/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { ChevronLeft } from "assets/images";
import useScrollTop from "hooks/useScrollTop";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router";
import { LinearGradientSubtract } from "styles";
import Action from "./Action/Action";
import MyStakingCard from "./MyStakingCard";
import RewardCard from "./RewardCard";
import TotalCard from "./TotalCard";
import { useParams } from "react-router-dom";
import Stakings from "config/staking";
import { StakingConfig } from "types";
const Wrapper = styled.div`
  max-width: 1048px;
  padding: 104px 15px 0;
  margin: 0 auto;
`;

const StakingCard = styled.div`
  background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.block)};
  border-radius: 24px;
  padding: 45px 53px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  font-weight: 500;
  font-size: 24px;
  line-height: 125%;
  display: flex;
  align-items: center;
  margin-bottom: 48px;
  position: relative;
  cursor: pointer;
  span {
    margin-left: 24px;
  }
`;

const CardGroup = styled.div`
  display: grid;
  gap: 24px;
  grid-auto-flow: column;
  grid-template-columns: 4fr 3fr;
  position: relative;
  margin-bottom: 24px;
  @media screen and (max-width: 876px) {
    grid-auto-flow: row;
    grid-template-columns: auto;
  }
`;

const LinearGradientSubtractWrapper = styled(LinearGradientSubtract)`
  position: absolute;
  left: -141px;
  top: -84px;
`;

type TProps = WrappedComponentProps;
type UrlParams = {
  id: string;
};
const Staking = memo<TProps>(({ intl }) => {
  useScrollTop();

  const { id } = useParams<UrlParams>();
  const [stakingConfig, setStakingConfig] = useState<StakingConfig>();
  const { goBack } = useHistory();
  const history = useHistory();

  useEffect(() => {
    if (Stakings[Number(id)]) {
      setStakingConfig(Stakings[Number(id)]);
    } else {
      history.push("/");
    }
  }, [id]);
  if (!stakingConfig) return <Wrapper />;
  return (
    <Wrapper>
      <StakingCard onClick={goBack}>
        <ChevronLeft />
        <span>{intl.formatMessage({ defaultMessage: "Staking WTF get double reward" })}</span>
      </StakingCard>
      <CardGroup>
        <LinearGradientSubtractWrapper />
        <TotalCard stakingConfig={stakingConfig} />
        <RewardCard stakingConfig={stakingConfig} />
      </CardGroup>
      <Action stakingConfig={stakingConfig} />
      <MyStakingCard stakingConfig={stakingConfig} />
    </Wrapper>
  );
});

export default injectIntl(Staking);
