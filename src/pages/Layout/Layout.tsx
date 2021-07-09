/** @jsxImportSource @emotion/react */

import { loadableComponents } from "pages";
import ConnectedRouteProvder from "providers/ConnectedRouteProvider/ConnectedRouteProvder";
import React, { memo } from "react";
import { connect } from "react-redux";

type TStateProps = ReturnType<typeof mapStateToProps>;
type TDispatchProps = ReturnType<typeof mapDispatchToProps>;
type TProps = TStateProps & TDispatchProps;

const { Header } = loadableComponents;

const Layout = memo<TProps>(() => {
  return (
    <React.Fragment>
      <header css={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 99 }}>
        <Header />
      </header>
      <ConnectedRouteProvder />
    </React.Fragment>
  );
});

const mapStateToProps = (state: IState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
