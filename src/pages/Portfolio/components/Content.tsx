/** @jsxImportSource @emotion/react */

import { Intersect } from "assets/images";
import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

type TProps = WrappedComponentProps;

const Portfolio = memo<TProps>(({ intl }) => {
  const TabTypes = [
    { key: "MARKETS", text: intl.formatMessage({ defaultMessage: "Markets" }) },
    { key: "MYPORTFOLIO", text: intl.formatMessage({ defaultMessage: "My Portfolio" }) }
  ];
  return (
    <div>
      <Tabs defaultActiveKey="MARKETS">
        {TabTypes.map(({ key, text }) => (
          <TabPane tab={text} key={key}></TabPane>
        ))}
      </Tabs>
    </div>
  );
});

export default injectIntl(Portfolio);
