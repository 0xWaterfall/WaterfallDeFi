/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Table, TableColumn, TableRow } from "components/Table/Table";
import { size } from "lodash";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";

const APYStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

type TProps = WrappedComponentProps;

const MyPositions = memo<TProps>(({ intl }) => {
  const { gray, warn, green, primary } = useTheme();
  const { push } = useHistory();
  return (
    <Table>
      <TableRow>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Portfolio" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Asset" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Series" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Cycle" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Actual APY" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Principal" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Interest" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Auto Rolling" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Status" })}</TableColumn>
        <TableColumn></TableColumn>
      </TableRow>
      {[1, 2, 3, 4].map((p) => (
        <TableRow
          height={80}
          css={{ color: gray.normal85, fontSize: 16 }}
          key={p}
          onClick={() => {
            push({ pathname: "/portfolio/details" });
          }}
        >
          <TableColumn>Cake Fall</TableColumn>
          <TableColumn>Cake</TableColumn>
          <TableColumn>1</TableColumn>
          <TableColumn minWidth={235}>2021/07/01→2021/07/08</TableColumn>
          <TableColumn>Senior 3%</TableColumn>
          <TableColumn minWidth={170}>1,000,000 Cake</TableColumn>
          <TableColumn>10 Cake</TableColumn>
          <TableColumn></TableColumn>
          <TableColumn></TableColumn>
          <TableColumn></TableColumn>
        </TableRow>
      ))}
      <TableRow height={140}></TableRow>
      <TableRow height={140}></TableRow>
    </Table>
  );
});

export default injectIntl(MyPositions);
