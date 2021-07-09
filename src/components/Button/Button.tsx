/** @jsxImportSource @emotion/react */

import React from "react";
import { Button as ANTDButton, ButtonProps } from "antd";
import { useTheme } from "hooks/useTheme";

type TProps = ButtonProps;
const Button: React.FC<TProps> = ({ className, children, ...props }) => {
  const { primary, linearGradient, shadow, white } = useTheme();
  return (
    <ANTDButton
      css={{
        "&.ant-btn": {
          borderRadius: 8,
          height: 40,
          width: "100%",
          border: 0,
          padding: "0 24px",
          fontWeight: 600,
          fontSize: 16
        },
        "&.ant-btn-primary": {
          background: linearGradient.primary,
          color: white.normal,
          boxShadow: shadow.primary,
          "&[ant-click-animating-without-extra-node='true']::after": {
            "--antd-wave-shadow-color": primary.normal
          }
        },
        className
      }}
      {...props}
    >
      {children}
    </ANTDButton>
  );
};
export default Button;
