/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import CreateDeposit from "./components/CreateDeposit";
import ContentCD from "./components/ContentCD";
import Charts from "./components/Charts";
import Information from "./components/Information";

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
        <Information />
        <Charts />
        <ContentCD />
      </div>
    </main>
  );
});

export default injectIntl(PortfolioDetails);
