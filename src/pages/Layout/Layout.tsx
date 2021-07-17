/** @jsxImportSource @emotion/react */

import Header from "pages/Header/Header";
import ConnectedRouteProvder from "providers/ConnectedRouteProvider/ConnectedRouteProvder";
import React, { FC } from "react";

const Layout: FC = () => {
  return (
    <React.Fragment>
      <header css={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 999 }}>
        <Header />
      </header>
      <ConnectedRouteProvder />
    </React.Fragment>
  );
};

export default Layout;
