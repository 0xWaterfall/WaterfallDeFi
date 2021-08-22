/** @jsxImportSource @emotion/react */

import React from "react";
import { Button as ANTDButton, ButtonProps } from "antd";
import styled from "@emotion/styled";

type TProps = Overwrite<ButtonProps, { type?: "primary" | "warn" | "default" }>;

const ANTDButtonStyled = styled(ANTDButton)`
  border-radius: 8px;
  height: 40px;
  border: 0;
  /* width: 100%; */
  padding: 0 24px;
  font-weight: 600;
  font-size: 16px;
  filter: drop-shadow(0px 8px 20px rgba(0, 108, 253, 0.3));
  color: ${({ theme }) => theme.gray.normal7};
  &[disabled] {
    opacity: 0.5;
  }
  &[ant-click-animating-without-extra-node="true"]::after {
    --antd-wave-shadow-color: none;
  }

  &[dataType="default"],
  &[dataType="default"][disabled] {
    border: 2px solid ${({ theme }) => theme.primary.deep2};
    color: ${({ theme }) => theme.primary.deep};
    box-shadow: ${({ theme }) => theme.shadow.primary};
    &[ant-click-animating-without-extra-node="true"]::after {
      --antd-wave-shadow-color: ${({ theme }) => theme.primary.normal};
    }
  }

  &[dataType="primary"],
  &[dataType="primary"][disabled] {
    background: ${({ theme }) => theme.linearGradient.primary};
    color: ${({ theme }) => theme.white.normal};
    box-shadow: ${({ theme }) => theme.shadow.primary};
    &[ant-click-animating-without-extra-node="true"]::after {
      --antd-wave-shadow-color: ${({ theme }) => theme.primary.normal};
    }
  }

  &[dataType="warn"],
  &[dataType="warn"][disabled] {
    background: ${({ theme }) => theme.warn.deep};
    color: ${({ theme }) => theme.white.normal};
    box-shadow: ${({ theme }) => theme.shadow.primary};
    &[ant-click-animating-without-extra-node="true"]::after {
      --antd-wave-shadow-color: ${({ theme }) => theme.warn.deep};
    }
  }
`;

const Button: React.FC<TProps> = ({ type, ...props }) => {
  return <ANTDButtonStyled {...props} datatype={type} />;
};
export default Button;
