/** @jsxImportSource @emotion/react */

import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Markets from "./Markets";
import MyPortfolio from "./MyPortfolio/MyPortfolio";

type TProps = WrappedComponentProps;

const Portfolio = memo<TProps>(({ intl }) => {
  const TabTypes = [
    { key: "MARKETS", text: intl.formatMessage({ defaultMessage: "Markets" }), component: <Markets /> },
    { key: "MYPORTFOLIO", text: intl.formatMessage({ defaultMessage: "My Portfolio" }), component: <MyPortfolio /> }
  ];
  return (
    <div css={{ position: "relative", zIndex: 1 }}>
      <Tabs defaultActiveKey="MARKETS">
        {TabTypes.map(({ key, text, component }) => (
          <TabPane tab={text} key={key}>
            {component}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
});

export default injectIntl(Portfolio);
