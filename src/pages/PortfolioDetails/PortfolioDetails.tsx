/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Header from "./components/Header";

type TProps = WrappedComponentProps;

const PortfolioDetails = memo<TProps>(() => {
  return (
    <main css={{ minHeight: "100vh" }}>
      <div
        css={{
          padding: "64px 24px",
          maxWidth: 1248,
          margin: "0 auto",
          minHeight: "100vh"
        }}
      >
        <Header />
      </div>
    </main>
  );
});

export default injectIntl(PortfolioDetails);
