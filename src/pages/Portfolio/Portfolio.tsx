/** @jsxImportSource @emotion/react */

import { Intersect } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

type TProps = WrappedComponentProps;

const Portfolio = memo<TProps>(() => {
  return (
    <main css={{ position: "relative" }}>
      <Intersect css={{ position: "absolute", top: 0, left: 0, zIndex: -1 }} />
    </main>
  );
});

export default injectIntl(Portfolio);
