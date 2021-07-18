/** @jsxImportSource @emotion/react */

import React from "react";
import { Tooltip as ANTDTooltip, TooltipProps } from "antd";
import { ClassNames, useTheme } from "@emotion/react";

type TProps = TooltipProps;

const Tooltip: React.FC<TProps> = ({ overlayInnerStyle, ...props }) => {
  const { white, gray } = useTheme();
  return (
    <ClassNames>
      {({ css }) => (
        <ANTDTooltip
          overlayInnerStyle={{
            backgroundColor: white.normal,
            borderRadius: 4,
            padding: "8px 12px",
            color: gray.normal7,
            lineHeight: 1.25,
            fontSize: 12,
            wordBreak: "break-all",
            ...overlayInnerStyle
          }}
          overlayClassName={css({ ".ant-tooltip-arrow-content": { backgroundColor: white.normal } })}
          {...props}
        />
      )}
    </ClassNames>
  );
};
export default Tooltip;
