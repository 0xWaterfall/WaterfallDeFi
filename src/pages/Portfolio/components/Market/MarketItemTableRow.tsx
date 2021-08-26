/** @jsxImportSource @emotion/react */

import { Table, TableColumn, TableHeaderColumn, TableRow } from "components/Table/Table";
import styled from "@emotion/styled";
import { injectIntl, WrappedComponentProps } from "react-intl";
import React, { memo, useState, useEffect } from "react";
import { Star } from "assets/images";
import { Market } from "types";
import { formatAPY, getPortfolioTvl } from "utils/formatNumbers";
import { useTheme } from "@emotion/react";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { useMarket } from "hooks";
type TProps = WrappedComponentProps & {
  data: Market;
};
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

const MarketItemTableRow = memo<TProps>(({ intl, data }) => {
  const [marketData, setMarketData] = useState(data);
  const { warn, green, primary, gray } = useTheme();
  const { push } = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const _md = await useMarket({ ...data });
      if (_md) setMarketData(_md);
    };
    fetchData();
  }, []);
  const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];
  const tranchesDisplayColor = [warn.normal, green.normal, primary.deep];
  return (
    <TableRowMarket height={100} css={{ color: gray.normal85, fontSize: 16 }}>
      <TableColumn>{marketData.portfolio}</TableColumn>
      <TableColumn minWidth={80}>
        <Star /> {marketData.assets}
      </TableColumn>
      <TableColumn minWidth={140}>{marketData.lockupPeriod}</TableColumn>
      <TableColumn minWidth={240} css={{ display: "flex" }}>
        <div css={{ display: "flex" }}>
          {marketData.tranches.length}
          {marketData?.tranches.map((_t, _i) => {
            return (
              <div css={{ display: "flex" }} key={_i}>
                <APYStyled>
                  <span>{tranchesDisplayText[_i]}</span>
                  <span css={{ marginTop: 15, color: tranchesDisplayColor[_i] }}>{formatAPY(_t.apy)}</span>
                </APYStyled>
                {_i !== marketData?.tranches.length - 1 ? <div>&nbsp;→&nbsp;</div> : null}
              </div>
            );
          })}
        </div>
      </TableColumn>
      <TableColumn minWidth={160}>
        {marketData.tvl} {marketData.assets}
      </TableColumn>
      <TableColumn minWidth={80}>
        <Tag color="yellow" value={"Pending"}></Tag>
        {/* <Tag color="red" value={"Expired"}></Tag> */}
        {/* {i === 2 ? <Tag color="yellow" value={"Pending"}></Tag> : null} */}
        {/* {i === 3 ? <Tag color="green" value={"Active"}></Tag> : null} */}
      </TableColumn>
      <TableColumn minWidth={240}>
        <APYStyled>
          <Button
            type="primary"
            onClick={() => {
              push({ pathname: "/portfolio/details", state: marketData });
            }}
          >
            Deposit
          </Button>
          <span css={{ fontSize: 10, marginTop: 10 }}>Next Time: 0D 12H 24M 56S</span>
        </APYStyled>
      </TableColumn>
    </TableRowMarket>
  );
});
export default injectIntl(MarketItemTableRow);
