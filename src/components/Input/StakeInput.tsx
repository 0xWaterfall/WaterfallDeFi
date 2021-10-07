/** @jsxImportSource @emotion/react */

import React from "react";
import styled from "@emotion/styled";
import Input from "./Input";
import { InputProps } from "antd";

type TProps = Partial<typeof Input> & InputProps & { suffixText?: React.ReactNode; onMAX?: () => void };

const WrapperInput = styled(Input)`
  &.ant-input-affix-wrapper {
    padding: 16px 19px;
    border: 2px solid ${({ theme }) => theme.primary.deep2};
    border-right-width: 2px !important;
    :hover {
      border-right-width: 2px !important;
    }
  }
  &.ant-input-affix-wrapper-focused {
    border-color: ${({ theme }) => theme.primary.deep};
  }
  &.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-right-width: 2px !important;
  }
  .ant-input-suffix {
    font-size: 14px;
    color: ${({ theme }) => theme.gray.normal5};
    cursor: pointer;
    p {
      font-weight: 600;
      color: ${({ theme }) => theme.primary.deep};
    }
  }
`;

const SplitLine = styled.div`
  width: 1px;
  height: 100%;
  background: ${({ theme }) => theme.primary.deep2};
  margin: 0 16px;
`;

const StakeInput: React.FC<TProps> = ({ suffixText, onMAX, ...props }) => {
  return (
    <WrapperInput
      {...props}
      suffix={
        <>
          <p onClick={onMAX}>MAX</p>
          {suffixText && (
            <>
              <SplitLine />
              <span>{suffixText}</span>
            </>
          )}
        </>
      }
    />
  );
};
export default StakeInput;
