/** @jsxImportSource @emotion/react */

import React from "react";
import styled from "@emotion/styled";
import Input from "./Input";
import { InputProps } from "antd";

type TProps = Partial<typeof Input> & InputProps & { suffixText?: React.ReactNode; onMAX?: () => void };

const WrapperInput = styled(Input)`
  height: 48px;
  &.ant-input-affix-wrapper {
    padding: 14px 20px;
    border: 1px solid ${({ theme }) => theme.useColorModeValue(theme.gray.normal2, theme.white.normal2)};
    border-radius: 8px;
    border-right-width: 1px !important;
    :hover {
      border-right-width: 1px !important;
    }
  }
  &.ant-input-affix-wrapper-focused {
    border-color: ${({ theme }) => theme.primary.deep};
  }
  &.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-right-width: 1px !important;
  }
  .ant-input-suffix {
    font-size: 14px;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
    cursor: pointer;
    p {
      font-weight: 600;
      color: ${({ theme }) => theme.primary.deep};
    }
  }
`;

const StakeInput: React.FC<TProps> = ({ suffixText, ...props }) => {
  return (
    <WrapperInput
      {...props}
      suffix={
        <>
          {suffixText && (
            <>
              <span>{suffixText}</span>
            </>
          )}
        </>
      }
    />
  );
};
export default StakeInput;
