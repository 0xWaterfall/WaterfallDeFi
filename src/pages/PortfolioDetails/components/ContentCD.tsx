/** @jsxImportSource @emotion/react */

import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
// import MyPositions from "./MyPositions";
import Deposit from "./Deposit";
import { Market } from "types";
import SparePositions from "pages/SparePositions";

type TProps = WrappedComponentProps & {
  data: Market;
};

const ContentCD = memo<TProps>(({ intl, data }) => {
  const [activeKey, setActiveKey] = useState<"DEPOSIT" | "POSITIONS">("DEPOSIT");
  const TabTypes = [
    { key: "DEPOSIT", text: intl.formatMessage({ defaultMessage: "Deposit" }), component: <Deposit data={data} /> },
    {
      key: "POSITIONS",
      text: intl.formatMessage({ defaultMessage: "My Positions" }),

      component: <SparePositions />
    }
  ];
  return (
    <Tabs
      activeKey={activeKey}
      onChange={(e) => {
        setActiveKey(e as typeof activeKey);
      }}
    >
      {TabTypes.map(({ key, text, component }) => (
        <TabPane tab={text} key={key}>
          {key === activeKey && component}
        </TabPane>
      ))}
    </Tabs>
  );
});

export default injectIntl(ContentCD);
