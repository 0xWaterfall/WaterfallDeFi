/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => theme.white.normal};
  filter: drop-shadow(0px 4px 20px rgba(0, 108, 253, 0.04));
`;

type TProps = WrappedComponentProps;

const ContactCard = memo<TProps>(() => {
  return <Wrapper></Wrapper>;
});

export default injectIntl(ContactCard);
