/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Star } from "assets/images";
import { Table } from "components/Table/Table";
import TableHeader from "components/Table/TableHeader";
import TableRow from "components/Table/TableRow";
import TableColumn from "components/Table/TableColumn";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";

const APYStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

type TProps = WrappedComponentProps;

const MyPortfolio = memo<TProps>(({ intl }) => {
  const { gray, warn, green, primary } = useTheme();
  const { push } = useHistory();
  return (
    <Table>
      <TableRow>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Portfolio" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Asset" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Lock-up period" })}</TableColumn>
        <TableColumn minWidth={320}>{intl.formatMessage({ defaultMessage: "Deposit APY" })}</TableColumn>
        <TableColumn minWidth={200}>{intl.formatMessage({ defaultMessage: "TVL" })}</TableColumn>
      </TableRow>
      {[1, 2, 3, 4].map((p) => (
        <TableRow
          height={100}
          css={{ color: gray.normal85, fontSize: 16 }}
          key={p}
          onClick={() => {
            push({ pathname: "/portfolio/series" });
          }}
        >
          <TableColumn>Cake Falls</TableColumn>
          <TableColumn>
            <Star /> CAKE
          </TableColumn>
          <TableColumn>7 Days</TableColumn>
          <TableColumn minWidth={320} css={{ display: "flex" }}>
            <div css={{ display: "flex" }}>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Senior" })}</span>
                <span css={{ marginTop: 15, color: warn.normal }}>5%</span>
              </APYStyled>
              <div>&nbsp;→&nbsp;</div>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Mezzanine" })}</span>
                <span css={{ marginTop: 15, color: green.normal }}>7.5%</span>
              </APYStyled>
              <div>&nbsp;→&nbsp;</div>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Junior" })}</span>
                <span css={{ marginTop: 15, color: primary.deep }}>30%</span>
              </APYStyled>
            </div>
          </TableColumn>
          <TableColumn minWidth={200}>1,000,000 CAKE</TableColumn>
        </TableRow>
      ))}
    </Table>
  );
});

export default injectIntl(MyPortfolio);
