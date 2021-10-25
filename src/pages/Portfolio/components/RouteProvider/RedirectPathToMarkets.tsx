import React, { FC } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";

const RedirectPathToMarkets: FC<RouteComponentProps> = ({ location }) => {
  return <Redirect to={{ ...location, pathname: "/portfolio/markets" }} />;
};

export default RedirectPathToMarkets;
