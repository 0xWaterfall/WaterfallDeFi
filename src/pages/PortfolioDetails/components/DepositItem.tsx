/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Row, Col } from "antd";
import TranchesCard from "./TranchesCard";
import ApproveCard from "./ApproveCard";
import { useTheme } from "@emotion/react";

type TProps = WrappedComponentProps & {
  isRe?: boolean;
};

const Box2 = styled.div`
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
`;

const DepositItem = memo<TProps>(({ intl, isRe }) => {
  const { primary } = useTheme();
  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gridColumnGap: 24,
        "@media screen and (max-width: 675px)": {
          gridTemplateColumns: "none",
          gridRowGap: 20
        }
      }}
    >
      <div css={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr", gridRowGap: 20 }}>
        <TranchesCard type="Senior" />
        <TranchesCard type="Mezzanine" />
        <TranchesCard type="Junior" />
      </div>
      <ApproveCard isRe={isRe} />
    </div>
  );
});

export default injectIntl(DepositItem);
