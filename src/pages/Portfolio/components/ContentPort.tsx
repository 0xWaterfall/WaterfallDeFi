/** @jsxImportSource @emotion/react */

import { Intersect } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import MyPortfolio from "./MyPortfolio";

type TProps = WrappedComponentProps;

const Portfolio = memo<TProps>(() => {
  return (
    <main css={{ position: "relative", minHeight: "100vh" }}>
      <Intersect css={{ position: "absolute", top: 0, left: 0 }} />
      <div
        css={{
          padding: "64px 24px",
          maxWidth: 1248,
          margin: "0 auto",
          minHeight: "100vh",
          "@media screen and (max-width: 1024px)": {
            paddingBottom: 100
          }
        }}
      >
        <MyPortfolio />
      </div>
    </main>
  );
});

export default injectIntl(Portfolio);
