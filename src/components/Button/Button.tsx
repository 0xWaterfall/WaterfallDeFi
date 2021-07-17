/** @jsxImportSource @emotion/react */

import React from "react";
import { Button as ANTDButton, ButtonProps } from "antd";
import { ClassNames, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

type TProps = Overwrite<ButtonProps, { type?: "primary" | "warn" }>;

const ANTDButtonStyled = styled(ANTDButton)`
  border-radius: 8px;
  height: 40px;
  border: 0;
  width: 100%;
  padding: 0 24px;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.gray.normal7};
  &[ant-click-animating-without-extra-node="true"]::after {
    --antd-wave-shadow-color: none;
  }

  &[dataType="primary"] {
    background: ${({ theme }) => theme.linearGradient.primary};
    color: ${({ theme }) => theme.white.normal};
    box-shadow: ${({ theme }) => theme.shadow.primary};
    &[ant-click-animating-without-extra-node="true"]::after {
      --antd-wave-shadow-color: ${({ theme }) => theme.primary.normal};
    }
  }

  &[dataType="warn"] {
    background: ${({ theme }) => theme.warn.deep};
    color: ${({ theme }) => theme.white.normal};
    box-shadow: ${({ theme }) => theme.shadow.primary};
    &[ant-click-animating-without-extra-node="true"]::after {
      --antd-wave-shadow-color: ${({ theme }) => theme.warn.deep};
    }
  }
`;
const Button: React.FC<TProps> = ({ type, ...props }) => {
  return (
    <ANTDButtonStyled {...props} datatype={type} />
    // <ClassNames>
    //   {({ css, cx }) => (
    //     <ANTDButton
    //       className={cx([
    //         {
    //           [css({
    //             "&.ant-btn": {
    //               borderRadius: 8,
    //               height: 40,
    //               width: "100%",
    //               border: 0,
    //               padding: "0 24px",
    //               fontWeight: 600,
    //               fontSize: 16,
    //               color: gray.normal7,
    //               "&[ant-click-animating-without-extra-node='true']::after": {
    //                 "--antd-wave-shadow-color": "none"
    //               }
    //             }
    //           })]: true
    //         },
    //         {
    //           [css({
    //             "&.ant-btn": {
    //               background: linearGradient.primary,
    //               color: white.normal,
    //               boxShadow: shadow.primary,
    //               "&[ant-click-animating-without-extra-node='true']::after": {
    //                 "--antd-wave-shadow-color": primary.normal
    //               }
    //             }
    //           })]: type === "primary"
    //         },
    //         {
    //           [css({
    //             "&.ant-btn": {
    //               background: warn.deep,
    //               color: white.normal,
    //               boxShadow: shadow.primary,
    //               "&[ant-click-animating-without-extra-node='true']::after": {
    //                 "--antd-wave-shadow-color": warn.deep
    //               }
    //             }
    //           })]: type === "warn"
    //         }
    //       ])}
    //       {...props}
    //     />
    //   )}
    // </ClassNames>
  );
};
export default Button;
