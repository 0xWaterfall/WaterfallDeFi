import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import RedirectPathToDashboard from "providers/ConnectedRouteProvider/RedirectPathToDashboard";
import Markets from "../Markets";
import MyPortfolio from "../MyPortfolio/MyPortfolio";

export const Routes = [
  {
    path: "/portfolio/markets",
    name: <FormattedMessage defaultMessage="Markets" />,
    component: Markets,
    exact: true
  },
  {
    path: "/portfolio/my-portfolio",
    name: <FormattedMessage defaultMessage="My Portfolio" />,
    component: MyPortfolio,
    exact: true
  }
];

const ConnectedRouteComponent: FC = () => {
  return (
    <Switch>
      {Routes.map((i) => {
        return <Route key={i.path} path={i.path} component={i.component} exact={i.exact} />;
      })}
      <Route component={RedirectPathToDashboard} />
    </Switch>
  );
};

export default ConnectedRouteComponent;
