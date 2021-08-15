/** @jsxImportSource @emotion/react */

import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import CreateDeposit from "./CreateDeposit";
import ActiveSeries from "./ActiveSeries";
import MyPositions from "./MyPositions";
import Deposit from "./Deposit";

type TProps = WrappedComponentProps;

const ContentCD = memo<TProps>(({ intl }) => {
  const TabTypes = [
    { key: "DEPOSIT", text: intl.formatMessage({ defaultMessage: "Deposit" }), component: <Deposit /> },
    { key: "CREATE", text: intl.formatMessage({ defaultMessage: "Create Deposit" }), component: <CreateDeposit /> },
    { key: "ACTIVE", text: intl.formatMessage({ defaultMessage: "Active Series" }), component: <ActiveSeries /> },
    { key: "POSITIONS", text: intl.formatMessage({ defaultMessage: "My Positions" }), component: <MyPositions /> }
  ];
  return (
    <div css={{ position: "relative", zIndex: 1 }}>
      <Tabs defaultActiveKey="CREATE">
        {TabTypes.map(({ key, text, component }) => (
          <TabPane tab={text} key={key}>
            {component}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
});

export default injectIntl(ContentCD);
