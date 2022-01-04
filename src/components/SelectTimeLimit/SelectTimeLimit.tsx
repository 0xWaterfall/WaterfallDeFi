/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Radio } from "antd";
import { OpUnitType } from "dayjs";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div``;

export const Group = styled(Radio.Group)`
  &.ant-radio-group {
    display: grid;
    gap: 20px;
    grid-auto-flow: column;
    @media screen and (max-width: 560px) {
      grid-template-rows: repeat(2, 1fr);
    }
    .ant-radio-inner {
      border-color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
      background: transparent;
    }
    .ant-radio-wrapper:hover .ant-radio,
    .ant-radio:hover .ant-radio-inner,
    .ant-radio-input:focus + .ant-radio-inner,
    .ant-radio-checked .ant-radio-inner {
      border-color: ${({ theme }) => theme.primary.normal};
    }
    span {
      font-size: 14px;
      line-height: 125%;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    }
  }

  /* display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  color: ${({ theme }) => theme.gray.normal7};
  border: 1px solid ${({ theme }) => theme.gray.normal2};
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  &[data-actived="true"],
  :hover {
    border-color: ${({ theme }) => theme.primary.deep};
    background: ${({ theme }) => theme.primary.deep1};
    color: ${({ theme }) => theme.primary.deep};
  }
  &[data-actived="true"] {
    cursor: default;
  } */
`;

type TProps = React.HTMLAttributes<HTMLDivElement> &
  WrappedComponentProps & {
    onSelected?: (e: { value: number; unit?: OpUnitType }) => void;
    reset?: boolean;
    suffixRender?: React.ReactNode;
  };

const SelectTimeLimit = memo<TProps>(({ intl, onSelected, reset, suffixRender, ...props }) => {
  const [actived, setActived] = useState<string>();

  const TIMES = [
    // { key: "1 Month", text: intl.formatMessage({ defaultMessage: "1 Month" }), value: 30, unit: "d" },
    { key: "3 Month", text: intl.formatMessage({ defaultMessage: "3 Months" }), value: 92, unit: "d" },
    { key: "6 Month", text: intl.formatMessage({ defaultMessage: "6 Months" }), value: 6, unit: "M" },
    { key: "1 Year", text: intl.formatMessage({ defaultMessage: "1 Year" }), value: 12, unit: "M" },
    // { key: "18 Month", text: intl.formatMessage({ defaultMessage: "18 Months" }), value: 18, unit: "M" },
    { key: "2 Year", text: intl.formatMessage({ defaultMessage: "2 Year" }), value: 730.485, unit: "d" }
  ];

  useEffect(() => {
    if (reset) {
      setActived(undefined);
    }
  }, [reset]);

  return (
    <Wrapper {...props}>
      <Group
        onChange={(e) => {
          console.log(e);
          setActived(e.target.value);
          const selected = TIMES.find((p) => p.key === e.target.value);
          selected && onSelected?.({ value: selected.value, unit: selected.unit as OpUnitType });
        }}
        value={actived}
      >
        {TIMES.map((p) => (
          <Radio key={p.key} value={p.key}>
            {p.text}
          </Radio>
        ))}
      </Group>
    </Wrapper>
  );
});

export default injectIntl(SelectTimeLimit);
