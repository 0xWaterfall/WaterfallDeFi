/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { Forest, Intersect, Star, Unicorn, wave } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

type TProps = WrappedComponentProps;

const Footer = memo<TProps>(({ intl }) => {
  const { primary } = useTheme();

  return (
    <div>
      <Unicorn css={{ position: "absolute", right: 0, bottom: 0 }} />
      <img src={wave} css={{ width: "100%", position: "absolute", bottom: 0, left: 0, zIndex: -1 }} />
    </div>
  );
});

export default injectIntl(Footer);
