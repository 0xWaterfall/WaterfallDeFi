/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import useScrollTop from "hooks/useScrollTop";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import FarmContainer from "./FarmContainer";
import StakeContainer from "./StakeContainer";
import TVLCard from "./TVLCard";

const Wrapper = styled.div`
  max-width: 1048px;
  padding: 180px 15px 0;
  margin: 0 auto;
`;

type TProps = WrappedComponentProps;

const Stake = memo<TProps>(() => {
  useScrollTop();
  return (
    <Wrapper>
      <TVLCard />
      <FarmContainer />
      <StakeContainer />
    </Wrapper>
  );
});

export default injectIntl(Stake);
