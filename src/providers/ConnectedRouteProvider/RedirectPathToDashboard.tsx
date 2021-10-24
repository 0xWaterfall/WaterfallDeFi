import React, { FC } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";

const RedirectPathToDashboard: FC<RouteComponentProps> = ({ location }) => {
  console.log(location);
  return <Redirect to={{ ...location, pathname: "/" }} />;
};

export default RedirectPathToDashboard;
