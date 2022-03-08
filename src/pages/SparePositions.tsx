/** @jsxImportSource @emotion/react */

import React, { memo, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useState } from "react";
import Select, { Option } from "components/Select/Select";
import { Table, TableHeaderColumn, TableRow } from "components/Table/Table";
import { Union } from "assets/images";
import Tooltip from "components/Tooltip/Tooltip";
import styled from "@emotion/styled";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import BigNumber from "bignumber.js";
import { PORTFOLIO_STATUS, UserInvest } from "types";
import { useHistoryQuery2 } from "pages/PortfolioDetails/hooks/useSubgraph";
import NoData from "components/NoData/NoData";
import { IType } from "./Portfolio/components/MyPortfolio/type";
import SparePositionItem from "./SparePositionItem";
import { useMarkets } from "hooks/useSelectors";
import numeral from "numeral";
import { BIG_TEN } from "utils/bigNumber";
import { usePositions } from "hooks";
import { useLocation } from "react-router";

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

const Segment = styled.div`
  border-radius: 8px;
  padding: 7px 8px;
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  display: grid;
  gap: 5px;
  grid-auto-flow: column;
`;

const SegmentBlock = styled.div`
  padding: 6px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  &[data-actived="true"] {
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadow.positionsTab};
    color: ${({ theme }) => theme.primary.deep};
    background: ${({ theme }) => theme.white.normal};
  }
`;

const SelectGroup = styled.div`
  display: grid;
  gap: 14px;
  grid-auto-flow: column;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  title {
    font-size: 12px;
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
  const [subgraphResult, setSubgraphResult] = useState<any[]>([]);
  const { account } = useWeb3React<Web3Provider>();

  const [activedTab, setActivedTab] = useState<IType>("ALL");
  const [selectedAsset, setSelectedAsset] = useState<string>("ALL");
  const [selectedTranche, setSelectedTranche] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const { state, pathname } = useLocation<{ id: number }>();
  const id = pathname === "/portfolio/my-portfolio" ? undefined : state?.id ?? 0;

  const positions = usePositions(id?.toString());
  const markets = useMarkets();

  useEffect(() => {
    if (account) fetchSubgraph();
  }, []);

  const fetchSubgraph = async () => {
    const _subgraphResult = await useHistoryQuery2(id?.toString(), account, markets);
    setSubgraphResult(_subgraphResult);
  };

  const _investHistoryResult = subgraphResult && subgraphResult.length > 0 ? [...subgraphResult] : [];
  for (let marketIdx = 0; marketIdx < _investHistoryResult.length; marketIdx++) {
    const _subgraphResultMarket = subgraphResult[marketIdx];
    if (!_subgraphResultMarket) continue;
    const _market = markets[marketIdx];
    const { userInvests: _userInvests, trancheCycles } = _subgraphResultMarket;
    const _position = positions[marketIdx];

    let userInvests = _userInvests?.filter((_userInvest: UserInvest) => {
      if (_userInvest?.cycle === Number(_market?.cycle) && _market?.status === PORTFOLIO_STATUS.PENDING) return false;
      if (_userInvest?.cycle === Number(_market?.cycle) && _market?.status === PORTFOLIO_STATUS.ACTIVE) return false;
      return true;
    });

    let _cycle;
    const _MCprincipals: string[][] = [];

    if (_position) {
      //single currency
      if (!_market.isMulticurrency) {
        for (let i = 0; i < _position.length; i++) {
          //single currency cycle
          _cycle = new BigNumber(_position[i][0]._hex).toString();

          //single currency, i = individual tranche
          const _principal = !_market?.isMulticurrency
            ? numeral(new BigNumber(_position[i][1]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[0000]")
            : "";

          if (
            _cycle == _market?.cycle &&
            (_market?.status === PORTFOLIO_STATUS.PENDING || _market?.status === PORTFOLIO_STATUS.ACTIVE)
          ) {
            userInvests = [
              {
                capital: "0",
                cycle: Number(_market?.cycle),
                harvestAt: 0,
                id: "",
                investAt: 0,
                owner: "",
                principal: _principal,
                tranche: i,
                interest: "0",
                earningsAPY: "NaN"
              },
              ...userInvests
            ];
          }
        }
      } else {
        //multicurrency
        _cycle = new BigNumber(_position[0][0]._hex).toString();

        //multicurrency, j = individual tranche
        //assume three tranches for now
        for (let j = 0; j < 3; j++) {
          _MCprincipals.push(
            _market.depositAssetAddresses.map((a, tokenIdx) =>
              numeral(
                new BigNumber(_position[j + 1 + tokenIdx * 3][0]._hex).dividedBy(BIG_TEN.pow(18)).toString()
              ).format("0,0.[0000]")
            )
          );
        }
        if (
          _cycle == _market?.cycle &&
          (_market?.status === PORTFOLIO_STATUS.PENDING || _market?.status === PORTFOLIO_STATUS.ACTIVE)
        ) {
          userInvests = [
            ..._MCprincipals.map((p, ti) => {
              return {
                capital: "0",
                cycle: Number(_market?.cycle),
                harvestAt: 0,
                id: "",
                investAt: 0,
                owner: "",
                principal: null,
                MCprincipal: p,
                tranche: ti,
                interest: "0",
                earningsAPY: "NaN"
              };
            }),
            ...userInvests
          ];
        }
      }
    }
    _investHistoryResult[marketIdx].userInvests = userInvests;
  }

  const TYPES: { name: string; value: IType; status: number }[] = [
    { name: intl.formatMessage({ defaultMessage: "All" }), value: "ALL", status: -1 },
    { name: intl.formatMessage({ defaultMessage: "Pending" }), value: "PENDING", status: 0 },
    { name: intl.formatMessage({ defaultMessage: "Active" }), value: "ACTIVE", status: 1 },
    { name: intl.formatMessage({ defaultMessage: "Matured" }), value: "EXPIRED", status: 2 }
  ];
  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.toString());
  };
  const handleTranchesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTranche(Number(event));
  };
  const handleStatusChange = (value: IType, status: number) => {
    setActivedTab(value);
    setSelectedStatus(status);
  };

  const userInvestsPayload: { _userInvest: UserInvest[] }[] = [];
  let filteredCount = 0;
  for (let marketIdx = 0; marketIdx < _investHistoryResult.length; marketIdx++) {
    if (!_investHistoryResult[marketIdx]) continue;
    const { userInvests: _userInvests, trancheCycles } = _investHistoryResult[marketIdx];
    const filtered = _userInvests?.filter((_userInvest: any) => {
      if (!trancheCycles) return false;
      const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
      if (_userInvest.principal == "0") return false;
      if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche) return false;
      if (selectedAsset !== "ALL" && !markets[marketIdx].assets.includes(selectedAsset)) return false;
      if (
        selectedStatus > -1 &&
        trancheCycles[trancheCycleId] &&
        selectedStatus !== trancheCycles[trancheCycleId].state
      )
        return false;
      return true;
    });
    filteredCount += filtered.length;

    userInvestsPayload[marketIdx] = { _userInvest: filtered };
  }

  return (
    <React.Fragment>
      <FilterWrapper>
        <Segment>
          {TYPES.map(({ name, value, status }) => (
            <SegmentBlock
              key={value}
              data-actived={activedTab === value}
              onClick={() => handleStatusChange(value, status)}
            >
              {name}
            </SegmentBlock>
          ))}
        </Segment>
        <SelectGroup>
          <div>
            <title>{intl.formatMessage({ defaultMessage: "Assets" })}</title>
            <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAssetChange(e)}>
              <Option value="ALL">All</Option>
              <Option value="BUSD">BUSD</Option>
              <Option value="TUSD">TUSD</Option>
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
          <TableHeaderColumn minWidth={180}>{intl.formatMessage({ defaultMessage: "Cycle" })}</TableHeaderColumn>
          <TableHeaderColumn minWidth={60}>{intl.formatMessage({ defaultMessage: "Tranche" })}</TableHeaderColumn>
          <TableHeaderColumn minWidth={140}>
            {intl.formatMessage({ defaultMessage: "APR" })}&nbsp;
            <Tooltip
              overlay={
                <React.Fragment>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "For Pending and Active position, EXPECTED APR is displayed"
                    })}
                  </p>
                  <br />
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "For Matured position, ACTUAL APR is displayed, after taking into consideration withdrawal fee"
                    })}
                  </p>
                </React.Fragment>
              }
            >
              <Union />
            </Tooltip>
          </TableHeaderColumn>
          <TableHeaderColumn minWidth={130}>
            <div css={{ paddingLeft: 17 }}>{intl.formatMessage({ defaultMessage: "Principal" })}</div>
          </TableHeaderColumn>
          <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
          <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Yield" })}</TableHeaderColumn>
          <TableHeaderColumn></TableHeaderColumn>
        </TableRow>

        <NoDataWrapper isNoData={!filteredCount}>
          {userInvestsPayload.map((_userInvestMarket, __idx) => {
            const { _userInvest: userInvests } = _userInvestMarket;
            const { trancheCycles } = _investHistoryResult[__idx];

            return userInvests.map((_userInvest: UserInvest, _idx: number) => {
              const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;

              const trancheCycle = trancheCycles[trancheCycleId];

              const _market = markets[__idx];

              return (
                <SparePositionItem
                  key={`${_idx} ${__idx} ${trancheCycleId}`}
                  userInvest={_userInvest}
                  market={_market}
                  trancheCycle={trancheCycle}
                />
              );
            });
          })}
        </NoDataWrapper>
      </Table>
    </React.Fragment>
  );
});

export default injectIntl(SparePositions);
