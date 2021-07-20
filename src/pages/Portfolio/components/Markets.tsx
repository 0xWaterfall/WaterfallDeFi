/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { Star } from "assets/images";
import { Table, TableColumn, TableRow } from "components/Table/Table";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";

type TProps = WrappedComponentProps;

const Markets = memo<TProps>(({ intl }) => {
  const { gray } = useTheme();
  const { push } = useHistory();
  return (
    <Table>
      <TableRow>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Portfolio" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Asset" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Tenure" })}</TableColumn>
        <TableColumn minWidth={280}>{intl.formatMessage({ defaultMessage: "Deposit APY" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "TVL" })}</TableColumn>
      </TableRow>
      {[1, 2, 3, 4].map((p) => (
        <TableRow
          height={100}
          css={{ color: gray.normal85, fontSize: 16 }}
          key={p}
          onClick={() => {
            push({ pathname: "/portfolio/details" });
          }}
        >
          <TableColumn>Cake Falls</TableColumn>
          <TableColumn>
            <Star /> Cake
          </TableColumn>
          <TableColumn>7 Days</TableColumn>
          <TableColumn minWidth={280}>Senior → Mezzanine → Junior</TableColumn>
          <TableColumn>1,000,000</TableColumn>
        </TableRow>
      ))}
    </Table>
  );
});

export default injectIntl(Markets);
