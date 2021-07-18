/** @jsxImportSource @emotion/react */

import Table from "components/Table/Table";
import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

type TProps = WrappedComponentProps;

const Markets = memo<TProps>(({ intl }) => {
  return <Table></Table>;
});

export default injectIntl(Markets);
