/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Star } from "assets/images";
// import TableWrapper from "components/Table/TableWrapper";
// import TableHeader from "components/Table/TableHeader";
// import TableRow from "components/Table/TableRow";
// import TableColumn from "components/Table/TableColumn";
import Tag from "components/Tag/Tag";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import Button from "components/Button/Button";
import MarketItem from "./Market/MarketItem";
import { useSize } from "ahooks";
import { Table, TableColumn, TableHeaderColumn, TableRow } from "components/Table/Table";

const APYStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableRowMarket = styled(TableRow)`
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  border-radius: 12px;
  height: 127px;
  background-color: ${({ theme }) => theme.primary.lightBrown};
`;

type TProps = WrappedComponentProps;

const Markets = memo<TProps>(({ intl }) => {
  const { gray, warn, green, primary } = useTheme();
  const { push } = useHistory();
  const { width } = useSize(document.body);
  return (
    <>
      {Boolean(width && width > 768) && (
        <Table css={{ display: "grid", gridRowGap: 32 }}>
          <TableRow>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Portfolio" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={80}>{intl.formatMessage({ defaultMessage: "Asset" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={140}>
              {intl.formatMessage({ defaultMessage: "Lock-up period" })}
            </TableHeaderColumn>
            <TableHeaderColumn minWidth={240}>
              {intl.formatMessage({ defaultMessage: "Deposit APY" })}
            </TableHeaderColumn>
            <TableHeaderColumn minWidth={160}>{intl.formatMessage({ defaultMessage: "TVL" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={80}>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={240}>{intl.formatMessage({ defaultMessage: "Action" })}</TableHeaderColumn>
          </TableRow>
          {[1, 2, 3, 4].map((p, i) => (
            <TableRowMarket height={100} css={{ color: gray.normal85, fontSize: 16 }} key={p}>
              <TableColumn>Cake Falls</TableColumn>
              <TableColumn minWidth={80}>
                <Star /> CAKE
              </TableColumn>
              <TableColumn minWidth={140}>7 Days</TableColumn>
              <TableColumn minWidth={240} css={{ display: "flex" }}>
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
              <TableColumn minWidth={160}>1,000,000 CAKE</TableColumn>
              <TableColumn minWidth={80}>
                {i === 1 || i === 0 ? <Tag color="red" value={"Expired"}></Tag> : null}
                {i === 2 ? <Tag color="yellow" value={"Pending"}></Tag> : null}
                {i === 3 ? <Tag color="green" value={"Active"}></Tag> : null}
              </TableColumn>
              <TableColumn minWidth={240}>
                <APYStyled>
                  <Button
                    type="primary"
                    onClick={() => {
                      push({ pathname: "/portfolio/details" });
                    }}
                  >
                    Deposit
                  </Button>
                  <span css={{ fontSize: 10, marginTop: 10 }}>Next Time: 0D 12H 24M 56S</span>
                </APYStyled>
              </TableColumn>
            </TableRowMarket>
          ))}
        </Table>
      )}
      {Boolean(width && width <= 768) && (
        <>
          {[1, 2, 3, 4].map((p, i) => (
            <div key={i}>
              <MarketItem />
            </div>
          ))}
        </>
      )}
    </>
  );
});

export default injectIntl(Markets);
