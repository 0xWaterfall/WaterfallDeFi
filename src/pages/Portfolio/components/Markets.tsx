/** @jsxImportSource @emotion/react */

import { memo, useState, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import MarketItem from "./Market/MarketItem";
import MarketItemTableRow from "./Market/MarketItemTableRow";
import { useSize } from "ahooks";
import { Table, TableHeaderColumn, TableRow } from "components/Table/Table";
import { useMarkets, useNetwork } from "hooks/useSelectors";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

type TProps = WrappedComponentProps;

const Markets = memo<TProps>(({ intl }) => {
  const { width } = useSize(document.body);
  const { active, account, chainId } = useWeb3React<Web3Provider>();
  const markets = useMarkets();
  const network = useNetwork();
  const [networkFilter, setNetworkFilter] = useState(chainId === 56 ? "bnb" : "avax");
  useEffect(() => {
    if (chainId === 56) {
      setNetworkFilter("bnb");
    }
    if (chainId === 43114) {
      setNetworkFilter("avax");
    }
  }, [chainId]);
  useEffect(() => {
    if (network === "avax") {
      setNetworkFilter("avax");
    }
    if (network === "bnb") {
      setNetworkFilter("bnb");
    }
  }, [network]);

  return (
    <>
      {Boolean(width && width > 768) && (
        <Table css={{ display: "grid", gridRowGap: 32 }}>
          <TableRow>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Portfolio" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={120}>
              <div css={{ paddingLeft: "40px" }}>{intl.formatMessage({ defaultMessage: "Asset" })}</div>
            </TableHeaderColumn>
            <TableHeaderColumn minWidth={140}>
              {intl.formatMessage({ defaultMessage: "Lock-up period" })}
            </TableHeaderColumn>
            <TableHeaderColumn minWidth={240}>
              {intl.formatMessage({ defaultMessage: "Deposit APR" })}
            </TableHeaderColumn>
            <TableHeaderColumn minWidth={160}>{intl.formatMessage({ defaultMessage: "TVL" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={80}>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Action" })}</TableHeaderColumn>
          </TableRow>
          {markets.map((_m, i) => {
            if (networkFilter === "avax" && !_m.isAvax) return null;
            if (networkFilter !== "avax" && _m.isAvax) return null;
            return <MarketItemTableRow key={i} selectId={i} data={_m} />;
          })}
        </Table>
      )}
      {Boolean(width && width <= 768) && (
        <>
          {markets.map((_m, i) => {
            if (networkFilter === "avax" && !_m.isAvax) return null;
            if (networkFilter !== "avax" && _m.isAvax) return null;
            return (
              <div key={i}>
                <MarketItem selectId={i} data={_m} />
              </div>
            );
          })}
        </>
      )}
    </>
  );
});

export default injectIntl(Markets);
