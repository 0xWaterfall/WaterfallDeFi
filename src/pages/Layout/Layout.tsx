/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Header from "pages/Header/Header";
import ConnectedRouteProvder from "providers/ConnectedRouteProvider/ConnectedRouteProvder";
import React, { FC } from "react";

const HeaderStyled = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

const Layout: FC = () => {
  return (
    <React.Fragment>
      <HeaderStyled>
        <Header />
      </HeaderStyled>
      <ConnectedRouteProvder />
    </React.Fragment>
  );
};

export default Layout;
