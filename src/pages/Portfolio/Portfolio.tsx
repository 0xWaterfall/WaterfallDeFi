/** @jsxImportSource @emotion/react */

import { Forest, Intersect, Star, Unicorn, wave } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Content from "./components/Content";
import { useSize } from "ahooks";

type TProps = WrappedComponentProps;

const Portfolio = memo<TProps>(({ intl }) => {
  const { width } = useSize(document.body);
  return (
    <main css={{ position: "relative", minHeight: "100vh" }}>
      <Intersect css={{ position: "absolute", top: 0, left: 0 }} />
      <div css={{ padding: "64px 24px", maxWidth: 1248, margin: "0 auto" }}>
        <Header />
        <Content />
      </div>
      {width && width > 1024 && <Footer />}
    </main>
  );
});

export default injectIntl(Portfolio);
