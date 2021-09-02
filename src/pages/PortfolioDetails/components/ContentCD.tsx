/** @jsxImportSource @emotion/react */

import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import MyPositions from "./MyPositions";
import Deposit from "./Deposit";
import { Market } from "types";

type TProps = WrappedComponentProps & {
  data: Market;
};

const ContentCD = memo<TProps>(({ intl, data }) => {
  const TabTypes = [
    { key: "DEPOSIT", text: intl.formatMessage({ defaultMessage: "Deposit" }), component: <Deposit data={data} /> },
    { key: "POSITIONS", text: intl.formatMessage({ defaultMessage: "My Positions" }), component: <MyPositions /> }
  ];
  return (
    <Tabs defaultActiveKey="DEPOSIT">
      {TabTypes.map(({ key, text, component }) => (
        <TabPane tab={text} key={key}>
          {component}
        </TabPane>
      ))}
    </Tabs>
  );
});

export default injectIntl(ContentCD);
