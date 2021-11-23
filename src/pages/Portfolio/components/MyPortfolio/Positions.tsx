/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useMemo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "components/Button/Button";
import { useState } from "react";
import { IType } from "./type";
import Select, { Option } from "components/Select/Select";
import { Table, TableColumn, TableHeaderColumn, TableRow } from "components/Table/Table";
import { CaretDown, Union } from "assets/images";
import Tooltip from "components/Tooltip/Tooltip";
import styled from "@emotion/styled";
import MyPortfolioItem from "./MyPortfolioItem";
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
type TProps = WrappedComponentProps;
const FilterDiv = styled.div`
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

const Positions = memo<TProps>(({ intl }) => {
  const { gray, primary, shadow, linearGradient, white } = useTheme();
  const [activedTab, setActivedTab] = useState<IType>("ALL");
  const [isfolds, setFolds] = useState<{ [key: string]: boolean }>({});
  const { width } = useSize(document.body);
  const { account } = useWeb3React<Web3Provider>();
  const [selectedTranche, setSelectedTranche] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(-1);
  const market = MarketList[0];
  // const { loading, error, data } = useHistoryQuery(account);
  const { userInvests, trancheCycles } = useHistoryQuery(account, market.duration);

  const TYPES: { name: string; value: IType; status: number }[] = [
    { name: intl.formatMessage({ defaultMessage: "All" }), value: "ALL", status: -1 },
    { name: intl.formatMessage({ defaultMessage: "Pending" }), value: "PENDING", status: 0 },
    { name: intl.formatMessage({ defaultMessage: "Active" }), value: "ACTIVE", status: 1 },
    { name: intl.formatMessage({ defaultMessage: "Matured" }), value: "EXPIRED", status: 2 }
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
      <FilterDiv>
        <div css={{ borderRadius: 8, padding: "7px 8px", border: `1px solid ${primary.deep2}`, display: "flex" }}>
          {TYPES.map(({ name, value, status }) => (
            <div
              key={value}
              css={{
                padding: "6px 10px",
                marginRight: 5,
                cursor: "pointer",
                ":last-of-type": {
                  marginRight: 0
                },
                color: gray.normal7,
                ...(activedTab === value
                  ? { borderRadius: 8, boxShadow: shadow.positionsTab, color: primary.deep }
                  : {})
              }}
              onClick={() => handleStatusChange(value, status)}
            >
              {name}
            </div>
          ))}
        </div>
        <div css={{ display: "flex" }}>
          <div css={{ marginRight: 14, color: gray.normal7 }}>
            <div css={{ marginBottom: 6 }}>{intl.formatMessage({ defaultMessage: "Assets" })}</div>
            <Select>
              {/* <Option value="Cake">Cake</Option> */}
              {/* <Option value="USDC">USDC</Option> */}
              <Option value="ALL">All</Option>
              <Option value="BUSD">BUSD</Option>
            </Select>
          </div>
          <div css={{ color: gray.normal7 }}>
            <div css={{ marginBottom: 6 }}>{intl.formatMessage({ defaultMessage: "Tranches" })}</div>
            <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTranchesChange(e)}>
              <Option value="-1">All</Option>
              <Option value="0">Senior</Option>
              <Option value="1">Mezzanine</Option>
              <Option value="2">Junior</Option>
            </Select>
          </div>
        </div>
      </FilterDiv>
      {Boolean(width && width > 768) && (
        <Table>
          <TableRow>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Portfolio Name" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={60}>{intl.formatMessage({ defaultMessage: "Asset" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={240}>{intl.formatMessage({ defaultMessage: "Cycle" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Net APY" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Principal" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Yield" })}</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
          <NoData isNoData={!payload?.length}>
            {payload?.map((_userInvest: any, _idx: number) => {
              const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
              // if (_userInvest.principal == "0") return;
              // if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche) return;
              // if (selectedStatus > -1 && selectedStatus !== trancheCycles[trancheCycleId].state) return;

              return (
                <div
                  key={_idx}
                  css={{
                    ":hover": {
                      // boxShadow: "0px 0px 20px rgba(0, 108, 253, 0.1)"
                    }
                  }}
                >
                  <TableRow
                    css={{
                      color: gray.normal85,
                      fontSize: 16,
                      borderBottom: `1px solid ${primary.lightBrown}`
                    }}
                  >
                    <TableColumn>{market.portfolio}</TableColumn>
                    <TableColumn minWidth={60}>{market.assets}</TableColumn>
                    <TableColumn minWidth={240} style={{ whiteSpace: "unset" }}>
                      {trancheCycles &&
                        trancheCycles[trancheCycleId] &&
                        trancheCycles[trancheCycleId].state !== 0 &&
                        `${formatTimestamp(trancheCycles[trancheCycleId].startAt)} → ${formatTimestamp(
                          Number(trancheCycles[trancheCycleId].endAt)
                        )}`}
                      {}
                    </TableColumn>
                    <TableColumn style={{ whiteSpace: "break-spaces" }}>
                      {tranchesName[_userInvest.tranche]}:{" "}
                      {trancheCycles && trancheCycles[trancheCycleId] && trancheCycles[trancheCycleId].state !== 0
                        ? new BigNumber(_userInvest.capital)
                            .minus(new BigNumber(_userInvest.principal))
                            .dividedBy(new BigNumber(_userInvest.principal))
                            // .times(new BigNumber((365 / 7) * 10000))
                            .times(new BigNumber(365 * 86400 * 100))
                            .dividedBy(
                              new BigNumber(trancheCycles[trancheCycleId].endAt - trancheCycles[trancheCycleId].startAt)
                            )
                            .toFormat(0)
                            .toString()
                        : "-"}
                      %
                    </TableColumn>
                    <TableColumn>
                      {formatNumberDisplay(_userInvest.principal)} {market.assets}
                    </TableColumn>
                    <TableColumn>
                      {trancheCycles[trancheCycleId].state === 0 ? <Tag color="yellow" value={"Pending"}></Tag> : null}
                      {trancheCycles[trancheCycleId].state === 1 ? <Tag color="green" value={"Active"}></Tag> : null}
                      {trancheCycles[trancheCycleId].state === 2 ? <Tag color="red" value={"Matured"}></Tag> : null}
                    </TableColumn>
                    <TableColumn>
                      {trancheCycles && trancheCycles[trancheCycleId] && trancheCycles[trancheCycleId].state !== 0
                        ? formatNumberDisplay(
                            new BigNumber(_userInvest.capital).minus(new BigNumber(_userInvest.principal)).toString()
                          )
                        : "-"}{" "}
                      {market.assets}
                    </TableColumn>
                    <TableColumn>
                      <div
                        css={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: `2px solid ${primary.deep2}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setFolds((isfolds) => ({ ...isfolds, [_idx]: !isfolds[_idx] }));
                        }}
                      >
                        <CaretDown
                          css={{
                            transition: "transform 0.3s",
                            transform: "rotate(0)",
                            ...(isfolds[_idx] ? { transform: "rotate(180deg)" } : {})
                          }}
                        />
                      </div>
                    </TableColumn>
                  </TableRow>
                  {isfolds[_idx] && (
                    <div css={{ padding: "24px 32px", position: "relative" }}>
                      <div
                        css={{
                          width: "100%",
                          height: "100%",
                          background: linearGradient.primary,
                          opacity: 0.02,
                          position: "absolute",
                          top: 0,
                          left: 0
                        }}
                      />
                      <div css={{ display: "flex", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
                        <div
                          css={{
                            padding: "16px 19px",
                            marginRight: 27,
                            border: `1px solid ${primary.deep2}`,
                            borderRadius: 8
                          }}
                        >
                          <div css={{ display: "flex", alignItems: "flex-start", fontSize: 12, color: gray.normal7 }}>
                            <div>
                              {intl.formatMessage({ defaultMessage: "Principal+" })}
                              <Tooltip
                                overlay={intl.formatMessage({
                                  defaultMessage:
                                    "Before the cycle starts, the principal can be redeemed in the Pending state."
                                })}
                              >
                                <u
                                  css={{
                                    borderBottom: "1px dotted",
                                    borderColor: gray.normal7,
                                    color: gray.normal7,
                                    textDecoration: "none"
                                  }}
                                >
                                  {intl.formatMessage({ defaultMessage: "Est. yield" })}
                                </u>
                              </Tooltip>
                            </div>

                            <Tooltip
                              overlay={intl.formatMessage({
                                defaultMessage:
                                  "In the active state, the yield is the theoretical yield calculated based on the theoretical APR.The actual yield is subject to the system display after expiration."
                              })}
                              css={{ marginLeft: 5 }}
                            >
                              <Union css={{ color: gray.normal3 }} />
                            </Tooltip>
                          </div>
                          <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>
                            {formatNumberDisplay(_userInvest.capital)} {market?.assets}
                          </div>
                          <div css={{ display: "flex" }}>
                            {/* <Button
                              css={{ marginRight: 10, fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
                              type="primary"
                            >
                              {intl.formatMessage({ defaultMessage: "Withdraw all" })}
                            </Button>
                            <Button
                              css={{ fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
                              type="primary"
                            >
                              {intl.formatMessage({ defaultMessage: "Re-deposit" })}
                            </Button> */}
                          </div>
                        </div>
                        <div
                          css={{
                            padding: "16px 19px",
                            width: 235,
                            marginRight: 23,
                            border: `1px solid ${primary.deep2}`,
                            borderRadius: 8
                          }}
                        >
                          <div css={{ display: "flex", alignItems: "center" }}>
                            <span css={{ marginRight: 5, color: gray.normal7, fontSize: 12 }}>
                              {intl.formatMessage({ defaultMessage: "WTF Reward" })}
                            </span>
                          </div>
                          <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>- WTF</div>
                          <div css={{ display: "flex" }}>
                            {/* <Button
                              css={{ marginRight: 10, fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
                              type="primary"
                            >
                              {intl.formatMessage({ defaultMessage: "Claim" })}
                            </Button> */}
                          </div>
                        </div>
                        <div css={{ flex: 1, padding: 18, width: "100%", position: "relative", borderRadius: 8 }}>
                          <div
                            css={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              backgroundColor: white.normal,
                              borderRadius: 8
                            }}
                          />
                          <div css={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start" }}>
                            <div css={{ marginRight: 4 }}>
                              <Union css={{ color: primary.deep, transform: "translateY(2px)" }} />
                            </div>
                            <div css={{ color: gray.normal7, fontSize: 12 }}>
                              {intl.formatMessage({
                                defaultMessage: `Upon maturity, you can choose to withdraw all the principal + yield. Alternatively you can choose to deposit to the next cycle - and choose the amount of re-deposit and tranche you re-deposit to.`
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </NoData>
        </Table>
      )}
      {Boolean(width && width <= 768) && (
        <NoData isNoData={!payload.length}>
          {payload.map((_userInvest: any, _idx: number) => {
            const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
            // if (_userInvest.principal == "0") return;
            // // if (trancheCycles[trancheCycleId].state === 0) return;
            // if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche) return;
            // if (selectedStatus > -1 && selectedStatus !== trancheCycles[trancheCycleId].state) return;
            // console.log("render");

            return (
              <div key={_idx}>
                <MyPortfolioItem
                  market={market}
                  isCurrentPosition={false}
                  _userInvest={_userInvest}
                  positionIdx={0}
                  _trancheCycle={trancheCycles[trancheCycleId]}
                />
              </div>
            );
          })}
        </NoData>
      )}
    </React.Fragment>
  );
});

export default injectIntl(Positions);
