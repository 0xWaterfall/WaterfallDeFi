import React, { FC } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { loadableComponents, RouteComponents } from "pages";

const { Dashboard } = loadableComponents;

type TStateProps = ReturnType<typeof mapStateToProps>;
type TDispatchProps = ReturnType<typeof mapDispatchToProps>;
type TProps = TStateProps & TDispatchProps;

const ConnectedRouteProvider: FC<TProps> = ({ children }) => {
  return (
    <Switch>
      {RouteComponents.map((item) => {
        return <Route key={item.key} path={item.path} exact={item.exact} component={item.component} />;
      })}
      <Route path="*" component={Dashboard} />
    </Switch>
  );
};

const mapStateToProps = (state: IState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ConnectedRouteProvider);
