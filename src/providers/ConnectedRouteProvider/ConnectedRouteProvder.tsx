import { FC } from "react";
import { Route, Switch } from "react-router-dom";
import { RouteComponents } from "./data";
import RedirectPathToDashboard from "./RedirectPathToDashboard";

const ConnectedRouteProvider: FC = () => {
  return (
    <Switch>
      {RouteComponents.map((item) => {
        return <Route key={item.key} strict path={item.path} exact={item.exact} component={item.component} />;
      })}
      <Route component={RedirectPathToDashboard} />
    </Switch>
  );
};

export default ConnectedRouteProvider;
