/** @jsxImportSource @emotion/react */

import React from "react";
import { Select as ANTDSelect, SelectProps } from "antd";
import styled from "@emotion/styled";
import { ClassNames, useTheme } from "@emotion/react";

const ANTDSelectStyled = styled(ANTDSelect)`
  min-width: 140px;
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background: transparent;
  }

  &.ant-select {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal85)};
    .ant-select-arrow {
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
    }
  }
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 4px;
    border-color: ${({ theme }) => theme.gray.normal08};
  }
  &.ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    border-color: ${({ theme }) => theme.gray.normal08};
  }
  &.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: ${({ theme }) => theme.gray.normal08};
    box-shadow: none;
  }
`;

type TProps = SelectProps<any>;
const Select: React.FC<TProps> = ({ children, ...props }) => {
  const { primary, gray, useColorModeValue, white, dark } = useTheme();
  return (
    <ClassNames>
      {({ css }) => (
        <ANTDSelectStyled
          dropdownClassName={css({
            "&.ant-select-dropdown": {
              backgroundColor: useColorModeValue(white.normal, dark.header)
            },
            ".ant-select-item": {
              color: useColorModeValue(gray.normal7, white.normal85)
            },
            ".ant-select-item-option-active:not(.ant-select-item-option-disabled),.ant-select-item-option-selected:not(.ant-select-item-option-disabled)":
              {
                backgroundColor: useColorModeValue(primary.lightBrown, dark.armyGreen)
              }
          })}
          {...props}
        >
          {children}
        </ANTDSelectStyled>
      )}
    </ClassNames>
  );
};
export default Select;

export const Option = ANTDSelect.Option;
