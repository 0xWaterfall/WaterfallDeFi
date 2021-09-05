/** @jsxImportSource @emotion/react */

import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo, useEffect, useState } from "react";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import ConnectedRouteComponent, { Routes } from "../ConnectRouteComponent";

type TProps = WrappedComponentProps;

const Content = memo<TProps>(({ intl }) => {
  const history = useHistory();

  const [activeKey, setActiveKey] = useState<string>(history.location.pathname);

  useEffect(() => {
    if (history.location.pathname === "/portfolio") {
      history.replace("/portfolio/markets");
      setActiveKey("/portfolio/markets");
    }
    history.listen((p) => {
      setActiveKey(p.pathname);
      if (p.pathname === "/portfolio") {
        history.replace("/portfolio/markets");
      }
    });
  }, []);

  return (
    <div css={{ position: "relative", zIndex: 1 }}>
      <Tabs activeKey={activeKey} onChange={history.push}>
        {Routes.map((p) => (
          <TabPane tab={p.name} key={p.path} />
        ))}
      </Tabs>
      <ConnectedRouteComponent />
    </div>
  );
});

export default injectIntl(Content);
