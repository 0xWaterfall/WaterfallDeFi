/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Farming from "./Farming";
import Reward from "./Reward";
import StakingCard from "./StakingCard";

const Wrapper = styled.div`
  max-width: 1048px;
  padding: 180px 15px 0;
  margin: 0 auto;
`;

type TProps = WrappedComponentProps;

const Staking = memo<TProps>(() => {
  return (
    <Wrapper>
      <StakingCard />
      <Farming />
      <Reward />
    </Wrapper>
  );
});

export default injectIntl(Staking);
