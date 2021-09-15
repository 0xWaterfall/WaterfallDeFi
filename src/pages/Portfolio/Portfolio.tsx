/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Header from "./components/Header";
import Content from "./components/Content";
import WorkFlow from "./components/WorkFlow";
import Loading from "components/Loading/Loading";
import useScrollTop from "hooks/useScrollTop";

type TProps = WrappedComponentProps;

const Portfolio = memo<TProps>(() => {
  useScrollTop();
  return (
    <React.Fragment>
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
        <Header />
        <WorkFlow />
        <Content />
      </div>
    </React.Fragment>
  );
});

export default injectIntl(Portfolio);
