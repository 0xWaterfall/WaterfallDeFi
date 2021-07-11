/** @jsxImportSource @emotion/react */

import React from "react";
import { Button as ANTDButton, ButtonProps } from "antd";
import { useTheme } from "hooks/useTheme";
import { ClassNames } from "@emotion/react";

type TProps = Overwrite<ButtonProps, { type?: "primary" | "warn" }>;
const Button: React.FC<TProps> = ({ className, type, ...props }) => {
  const { primary, linearGradient, shadow, white, warn, gray } = useTheme();
  return (
    <ClassNames>
      {({ css, cx }) => (
        <ANTDButton
          className={cx([
            {
              [css({
                "&.ant-btn": {
                  borderRadius: 8,
                  height: 40,
                  width: "100%",
                  border: 0,
                  padding: "0 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  color: gray.normal7,
                  "&[ant-click-animating-without-extra-node='true']::after": {
                    "--antd-wave-shadow-color": "none"
                  }
                },
                className
              })]: true,
              [css({
                "&.ant-btn": {
                  background: linearGradient.primary,
                  color: white.normal,
                  boxShadow: shadow.primary,
                  "&[ant-click-animating-without-extra-node='true']::after": {
                    "--antd-wave-shadow-color": primary.normal
                  }
                }
              })]: type === "primary",
              [css({
                "&.ant-btn": {
                  background: warn.deep,
                  color: white.normal,
                  boxShadow: shadow.primary,
                  "&[ant-click-animating-without-extra-node='true']::after": {
                    "--antd-wave-shadow-color": warn.deep
                  }
                }
              })]: type === "warn"
            }
          ])}
          {...props}
        />
      )}
    </ClassNames>
  );
};
export default Button;
