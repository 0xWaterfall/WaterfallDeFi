/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Header from "pages/Header/Header";
import Footer from "pages/Footer/Footer";
import ConnectedRouteProvder from "providers/ConnectedRouteProvider/ConnectedRouteProvder";
import React, { FC } from "react";
import Cookie from "pages/Cookie/Cookie";
import TransactionModal from "components/TransactionModal/TransactionModal";
import { useCookieModal } from "hooks/useSelectors";

const HeaderStyled = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

const MainStyled = styled.main`
  min-height: 100vh;
  position: relative;
`;

const Page: FC = () => {
  const isShow = useCookieModal();
  return (
    <React.Fragment>
      {isShow && <Cookie />}
      <TransactionModal />
      <HeaderStyled>
        <Header />
      </HeaderStyled>
      <MainStyled>
        <ConnectedRouteProvder />
      </MainStyled>
      <Footer />
    </React.Fragment>
  );
};

export default Page;
