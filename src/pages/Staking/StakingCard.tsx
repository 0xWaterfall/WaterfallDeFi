/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import ComingSoon from "./ComingSoon";

const Wrapper = styled.div`
  max-width: 1048px;
  padding: 0 15px;
`;

type TProps = WrappedComponentProps;

const StakingCard = memo<TProps>(({ intl }) => {
  return <Wrapper></Wrapper>;
});

export default injectIntl(StakingCard);
