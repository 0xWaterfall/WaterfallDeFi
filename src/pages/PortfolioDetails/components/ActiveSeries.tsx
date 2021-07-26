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

const ActiveSeries = memo<TProps>(({ intl }) => {
  const { gray, warn, green, primary } = useTheme();
  const { push } = useHistory();
  return (
    <Table>
      <TableRow>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Series" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Maturity Time" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Deposit APY" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Series TVL" })}</TableColumn>
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
          <TableColumn>1</TableColumn>
          <TableColumn minWidth={250}>2021/07/01→2021/07/08</TableColumn>
          <TableColumn minWidth={280} css={{ display: "flex" }}>
            <div css={{ display: "flex" }}>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Senior" })}</span>
                <span css={{ marginTop: 15, color: warn.normal }}>2%</span>
              </APYStyled>
              <div>&nbsp;→&nbsp;</div>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Mezzanine" })}</span>
                <span css={{ marginTop: 15, color: green.normal }}>3%</span>
              </APYStyled>
              <div>&nbsp;→&nbsp;</div>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Junior" })}</span>
                <span css={{ marginTop: 15, color: primary.deep }}>15%</span>
              </APYStyled>
            </div>
          </TableColumn>
          <TableColumn>30,000</TableColumn>
        </TableRow>
      ))}
      {[1].map((p) => (
        <TableRow
          height={100}
          css={{ color: gray.normal85, fontSize: 16 }}
          key={p}
          onClick={() => {
            push({ pathname: "/portfolio/details" });
          }}
        >
          <TableColumn></TableColumn>
          <TableColumn> Senior TVL: 20,000 </TableColumn>
          <TableColumn> Junior TVL: 50,000 </TableColumn>
          <TableColumn></TableColumn>
        </TableRow>
      ))}
    </Table>
  );
});

export default injectIntl(ActiveSeries);
