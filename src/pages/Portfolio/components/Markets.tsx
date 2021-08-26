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

type TProps = WrappedComponentProps;

const Markets = memo<TProps>(({ intl }) => {
  const { gray, warn, green, primary } = useTheme();
  const { width } = useSize(document.body);
  const [market, setMarket] = useState<Array<Market>>([...MarketList]);

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
          {market.map((_m, i) => (
            <MarketItemTableRow data={_m} key={i} />
          ))}
        </Table>
      )}
      {Boolean(width && width <= 768) && (
        <>
          {market.map((_m, i) => (
            <div key={i}>
              <MarketItem data={_m} />
            </div>
          ))}
        </>
      )}
    </>
  );
});

export default injectIntl(Markets);
