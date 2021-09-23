/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useMemo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "components/Button/Button";
import { useState } from "react";
import Select, { Option } from "components/Select/Select";
import { Table, TableColumn, TableHeaderColumn, TableRow } from "components/Table/Table";
import { CaretDown, Union } from "assets/images";
import Tooltip from "components/Tooltip/Tooltip";
import styled from "@emotion/styled";
import { useSize } from "ahooks";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { MarketList } from "config/market";
import { formatNumberDisplay, formatNumberWithDecimalsDisplay, formatTimestamp } from "utils/formatNumbers";
import BigNumber from "bignumber.js";
import { TrancheCycle } from "types";
import Tag from "components/Tag/Tag";
import { useHistoryQuery } from "pages/PortfolioDetails/hooks/useSubgraph";
import NoData from "components/NoData/NoData";
import { IType } from "./Portfolio/components/MyPortfolio/type";
import SparePositionItem from "./SparePositionItem";

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    & > div {
      margin-bottom: 20px;
    }
  }
`;

const Segement = styled.div`
  border-radius: 8px;
  padding: 7px 8px;
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  display: grid;
  gap: 5px;
  grid-auto-flow: column;
`;

const SegementBlock = styled.div`
  padding: 6px 16px;
  margin-right: 5;
  cursor: pointer;
  color: ${({ theme }) => theme.gray.normal7};
  &[data-actived="true"] {
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadow.positionsTab};
    color: ${({ theme }) => theme.primary.deep};
  }
`;

const SelectGroup = styled.div`
  display: grid;
  gap: 14px;
  grid-auto-flow: column;
  color: ${({ theme }) => theme.gray.normal7};
  title {
    margin-bottom: 6px;
  }
`;

const NoDataWrapper = styled(NoData)`
  @media screen and (max-width: 768px) {
    display: grid;
    gap: 20px;
    grid-auto-flow: row;
  }
`;

type TProps = WrappedComponentProps;

const SparePositions = memo<TProps>(({ intl }) => {
  const { gray, primary, shadow, linearGradient, white } = useTheme();
  const [activedTab, setActivedTab] = useState<IType>("ALL");
  const [isfolds, setFolds] = useState<{ [key: string]: boolean }>({});
  const { width } = useSize(document.body);
  const { account } = useWeb3React<Web3Provider>();
  const [selectedTranche, setSelectedTranche] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(-1);
  const market = MarketList[0];
  // const { loading, error, data } = useHistoryQuery(account);
  const { userInvests, trancheCycles } = useHistoryQuery(account);

  const TYPES: { name: string; value: IType; status: number }[] = [
    { name: intl.formatMessage({ defaultMessage: "All" }), value: "ALL", status: -1 },
    { name: intl.formatMessage({ defaultMessage: "Pending" }), value: "PENDING", status: 0 },
    { name: intl.formatMessage({ defaultMessage: "Active" }), value: "ACTIVE", status: 1 },
    { name: intl.formatMessage({ defaultMessage: "Expired" }), value: "EXPIRED", status: 2 }
  ];
  const tranchesName = ["Senior", "Mezzanine", "Junior"];
  const handleTranchesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTranche(Number(event));
  };
  const handleStatusChange = (value: IType, status: number) => {
    setActivedTab(value);
    setSelectedStatus(status);
  };

  const payload = useMemo(() => {
    return userInvests?.filter((_userInvest: any) => {
      const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
      if (_userInvest.principal == "0") return false;
      if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche) return false;
      if (selectedStatus > -1 && selectedStatus !== trancheCycles[trancheCycleId].state) return false;
      return true;
    });
  }, [selectedTranche, selectedStatus, trancheCycles]);

  return (
    <React.Fragment>
      <FilterWrapper>
        <Segement>
          {TYPES.map(({ name, value, status }) => (
            <SegementBlock
              key={value}
              data-actived={activedTab === value}
              onClick={() => handleStatusChange(value, status)}
            >
              {name}
            </SegementBlock>
          ))}
        </Segement>
        <SelectGroup>
          <div>
            <title>{intl.formatMessage({ defaultMessage: "Assets" })}</title>
            <Select>
              <Option value="ALL">All</Option>
              <Option value="BUSD">BUSD</Option>
            </Select>
          </div>
          <div>
            <title>{intl.formatMessage({ defaultMessage: "Tranches" })}</title>
            <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTranchesChange(e)}>
              <Option value="-1">All</Option>
              <Option value="0">Senior</Option>
              <Option value="1">Mezzanine</Option>
              <Option value="2">Junior</Option>
            </Select>
          </div>
        </SelectGroup>
      </FilterWrapper>

      <Table>
        <TableRow>
          <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Portfolio Name" })}</TableHeaderColumn>
          <TableHeaderColumn minWidth={60}>{intl.formatMessage({ defaultMessage: "Asset" })}</TableHeaderColumn>
          <TableHeaderColumn minWidth={200}>{intl.formatMessage({ defaultMessage: "Cycle" })}</TableHeaderColumn>
          <TableHeaderColumn minWidth={240}>{intl.formatMessage({ defaultMessage: "Net APY" })}</TableHeaderColumn>
          <TableHeaderColumn minWidth={150}>{intl.formatMessage({ defaultMessage: "Principal" })}</TableHeaderColumn>
          <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
          <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Interest" })}</TableHeaderColumn>
          <TableHeaderColumn></TableHeaderColumn>
        </TableRow>
        <NoDataWrapper isNoData={!payload?.length}>
          {[1, 2, 3].map((p) => (
            <SparePositionItem key={p} />
          ))}
        </NoDataWrapper>
      </Table>
    </React.Fragment>
  );
});

export default injectIntl(SparePositions);
