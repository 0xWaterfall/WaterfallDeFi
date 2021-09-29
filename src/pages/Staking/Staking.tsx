/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import ComingSoon from "./ComingSoon";

type TProps = WrappedComponentProps;

const Staking = memo<TProps>(({ intl }) => {
  return <ComingSoon />;
});

export default injectIntl(Staking);
