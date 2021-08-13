/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";

type TProps = WrappedComponentProps;

const Dashboard = memo<TProps>(() => {
  return <main css={{ position: "relative", minHeight: "100vh" }}></main>;
});

export default injectIntl(Dashboard);
