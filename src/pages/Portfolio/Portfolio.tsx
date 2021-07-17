/** @jsxImportSource @emotion/react */

import { Forest, Intersect, Star, Unicorn, wave } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Content from "./components/Content";

type TProps = WrappedComponentProps;

const Portfolio = memo<TProps>(({ intl }) => {
  return (
    <main css={{ position: "relative", minHeight: "100vh" }}>
      <Intersect css={{ position: "absolute", top: 0, left: 0, zIndex: -1 }} />
      <div css={{ padding: "64px 200px", margin: "0 auto" }}>
        <Header />
        <Content />
      </div>
      <Footer />
    </main>
  );
});

export default injectIntl(Portfolio);
