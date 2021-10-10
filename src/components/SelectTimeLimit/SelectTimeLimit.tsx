/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { OpUnitType } from "dayjs";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  display: grid;
  gap: 15px;
  grid-auto-flow: column;
`;

export const Block = styled.div`
  display: flex;
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
  }
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
    { key: "1 Month", text: intl.formatMessage({ defaultMessage: "1 Month" }), value: 1, unit: "M" },
    { key: "3 Month", text: intl.formatMessage({ defaultMessage: "3 Months" }), value: 3, unit: "M" },
    { key: "6 Month", text: intl.formatMessage({ defaultMessage: "6 Months" }), value: 6, unit: "M" },
    { key: "1 Year", text: intl.formatMessage({ defaultMessage: "1 Year" }), value: 12, unit: "M" }
  ];

  useEffect(() => {
    if (reset) {
      setActived(undefined);
    }
  }, [reset]);

  return (
    <Wrapper {...props}>
      {TIMES.map((p) => (
        <Block
          key={p.key}
          data-actived={p.key === actived}
          onClick={() => {
            setActived(p.key);
            onSelected?.({ value: p.value, unit: p.unit as OpUnitType });
          }}
        >
          {p.text}
        </Block>
      ))}
      {suffixRender}
    </Wrapper>
  );
});

export default injectIntl(SelectTimeLimit);
