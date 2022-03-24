import { FC } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";

const RedirectPathToDashboard: FC<RouteComponentProps> = ({ location }) => {
  return <Redirect to={{ ...location, pathname: "/" }} />;
};

export default RedirectPathToDashboard;
