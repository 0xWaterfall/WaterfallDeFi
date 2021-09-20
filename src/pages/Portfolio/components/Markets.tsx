/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useState, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import MarketItem from "./Market/MarketItem";
import MarketItemTableRow from "./Market/MarketItemTableRow";
import { useSize } from "ahooks";
import { Table, TableHeaderColumn, TableRow } from "components/Table/Table";
import { Market } from "types";
import { MarketList } from "config/market";
import { useMarkets } from "hooks/useSelectors";

type TProps = WrappedComponentProps;

const Markets = memo<TProps>(({ intl }) => {
  const { width } = useSize(document.body);
  const markets = useMarkets();
  return (
    <>
      {Boolean(width && width > 768) && (
        <Table css={{ display: "grid", gridRowGap: 32 }}>
          <TableRow>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Portfolio" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={120}>{intl.formatMessage({ defaultMessage: "Asset" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={140}>
              {intl.formatMessage({ defaultMessage: "Lock-up period" })}
            </TableHeaderColumn>
            <TableHeaderColumn minWidth={240}>
              {intl.formatMessage({ defaultMessage: "Deposit APR" })}
            </TableHeaderColumn>
            <TableHeaderColumn minWidth={160}>{intl.formatMessage({ defaultMessage: "TVL" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={80}>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={240}>{intl.formatMessage({ defaultMessage: "Action" })}</TableHeaderColumn>
          </TableRow>
          {markets.map((_m, i) => (
            <MarketItemTableRow key={i} selectId={i} data={_m} />
          ))}
        </Table>
      )}
      {Boolean(width && width <= 768) && (
        <>
          {markets.map((_m, i) => (
            <div key={i}>
              <MarketItem selectId={i} data={_m} />
            </div>
          ))}
        </>
      )}
    </>
  );
});

export default injectIntl(Markets);
