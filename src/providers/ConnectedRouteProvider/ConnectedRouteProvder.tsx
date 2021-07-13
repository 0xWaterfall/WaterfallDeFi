import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";
import { loadableComponents, RouteComponents } from "pages";

const { Dashboard } = loadableComponents;

const ConnectedRouteProvider: FC = () => {
  return (
    <Switch>
      {RouteComponents.map((item) => {
        return <Route key={item.key} path={item.path} exact={item.exact} component={item.component} />;
      })}
      <Route path="*" component={Dashboard} />
    </Switch>
  );
};

export default ConnectedRouteProvider;
