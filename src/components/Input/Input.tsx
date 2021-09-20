/** @jsxImportSource @emotion/react */

import React from "react";
import { Input as ANTDInput, InputProps } from "antd";
import styled from "@emotion/styled";

type TProps = InputProps;

const WrapperInput = styled(ANTDInput)`
  width: 100%;
  border-radius: 16px;
  height: 56px;
  padding: 0 24px;
  font-size: 24px;
  color: ${({ theme }) => theme.primary.deep};
  border-color: ${({ theme }) => theme.primary.deep2};
  box-shadow: none;
  border-radius: 8px;
  :hover,
  :focus {
    border-color: ${({ theme }) => theme.primary.normal};
    box-shadow: none;
  }
  input {
    background: initial;
    color: ${({ theme }) => theme.primary.deep};
    font-size: 20px;
  }
  &.ant-input-affix-wrapper {
    border-radius: 8px;
    box-shadow: none;
    border-color: ${({ theme }) => theme.primary.deep2};
  }
  &.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover,
  &.ant-input-affix-wrapper:focus,
  &.ant-input-affix-wrapper-focused {
    border-color: ${({ theme }) => theme.primary.normal};
    box-shadow: none;
  }
  &.ant-input-affix-wrapper-disabled {
    background-color: ${({ theme }) => theme.white.normal};
    color: ${({ theme }) => theme.primary.deep};
    opacity: 0.5;
  }
`;

const Input: React.FC<TProps> = ({ ...props }) => {
  return <WrapperInput {...props} />;
};
export default Input;
