/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Stake from "./Stake";
import Unstake from "./Unstake";

const Wrapper = styled.div`
  display: grid;
  gap: 25px;
  grid-auto-flow: column;
  padding: 4px;
  @media screen and (max-width: 680px) {
    grid-auto-flow: row;
  }
`;

type TProps = WrappedComponentProps;

const StakingVeWTF = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <Stake />
      <Unstake />
    </Wrapper>
  );
});

export default injectIntl(StakingVeWTF);
