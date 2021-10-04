/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import LockUp from "./LockUp";
import Unlock from "./Unlock";

const Wrapper = styled.div`
  display: grid;
  gap: 25px;
  grid-auto-flow: column;
  grid-template-columns: 5fr 3fr;
  @media screen and (max-width: 768px) {
    grid-template-columns: auto;
    grid-auto-flow: row;
  }
`;

type TProps = WrappedComponentProps;

const LockWTF = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <LockUp />
      <Unlock />
    </Wrapper>
  );
});

export default injectIntl(LockWTF);
