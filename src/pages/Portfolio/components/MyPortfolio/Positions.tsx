/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo } from "react";
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
import ReDeposit from "../ReDeposit/ReDeposit";
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
      margin-bottom: 10px;
    }
  }
`;
const Positions = memo<TProps>(({ intl }) => {
  const { gray, primary, shadow, linearGradient, white } = useTheme();
  const [activedTab, setActivedTab] = useState<IType>("ALL");
  const [isfolds, setFolds] = useState<{ [key: string]: boolean }>({});
  const { width } = useSize(document.body);

  const TYPES: { name: string; value: IType }[] = [
    { name: intl.formatMessage({ defaultMessage: "All" }), value: "ALL" },
    { name: intl.formatMessage({ defaultMessage: "Pending" }), value: "PENDING" },
    { name: intl.formatMessage({ defaultMessage: "Active" }), value: "ACTIVE" },
    { name: intl.formatMessage({ defaultMessage: "Expired" }), value: "EXPIRED" }
  ];

  return (
    <React.Fragment>
      <FilterDiv>
        <div css={{ borderRadius: 8, padding: "7px 8px", border: `1px solid ${primary.deep2}`, display: "flex" }}>
          {TYPES.map(({ name, value }) => (
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
              onClick={setActivedTab.bind(null, value)}
            >
              {name}
            </div>
          ))}
        </div>
        <div css={{ display: "flex" }}>
          <div css={{ marginRight: 14, color: gray.normal7 }}>
            <div css={{ marginBottom: 6 }}>{intl.formatMessage({ defaultMessage: "Assets" })}</div>
            <Select>
              <Option value="Cake">Cake</Option>
              <Option value="USDC">USDC</Option>
              <Option value="BUSD">BUSD</Option>
            </Select>
          </div>
          <div css={{ color: gray.normal7 }}>
            <div css={{ marginBottom: 6 }}>{intl.formatMessage({ defaultMessage: "Tranches" })}</div>
            <Select>
              <Option value="Senior">Senior</Option>
              <Option value="Mezzanine">Mezzanine</Option>
              <Option value="Junior">Junior</Option>
            </Select>
          </div>
        </div>
      </FilterDiv>
      {Boolean(width && width > 768) && (
        <Table>
          <TableRow>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Portfolio Name" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Asset" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={240}>{intl.formatMessage({ defaultMessage: "Cycle" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Deposit APY" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Principal" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Interest" })}</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
          {[1, 2, 3, 4].map((p) => (
            <div
              key={p}
              css={{
                ":hover": {
                  boxShadow: "0px 0px 20px rgba(0, 108, 253, 0.1)"
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
                <TableColumn>Cake Fall 1</TableColumn>
                <TableColumn>BUSD</TableColumn>
                <TableColumn minWidth={240}>2021/07/01→2021/07/08</TableColumn>
                <TableColumn>Senior: 3%</TableColumn>
                <TableColumn>1,000,000 BUSD</TableColumn>
                <TableColumn>Active</TableColumn>
                <TableColumn>10 BUSD</TableColumn>
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
                      setFolds((isfolds) => ({ ...isfolds, [p]: !isfolds[p] }));
                    }}
                  >
                    <CaretDown
                      css={{
                        transition: "transform 0.3s",
                        transform: "rotate(0)",
                        ...(isfolds[p] ? { transform: "rotate(180deg)" } : {})
                      }}
                    />
                  </div>
                </TableColumn>
              </TableRow>
              {isfolds[p] && (
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
                      <div css={{ display: "flex", alignItems: "center" }}>
                        <span css={{ marginRight: 5, color: gray.normal7, fontSize: 12 }}>
                          {intl.formatMessage({ defaultMessage: "Max withdrawal principal+Interest" })}
                        </span>
                        <Tooltip
                          overlay={
                            <React.Fragment>
                              <p>{intl.formatMessage({ defaultMessage: "When you can withdraw:" })}</p>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "1. Before the cycle starts, the principal can be withdrawn in the Pending state"
                                })}
                              </p>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "2. After the period expires, the principal + interest can be withdrawn in the Metured state"
                                })}
                              </p>
                            </React.Fragment>
                          }
                        >
                          <Union css={{ color: gray.normal3 }} />
                        </Tooltip>
                      </div>
                      <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>10,000,010 BUSD</div>
                      <div css={{ display: "flex" }}>
                        <Button
                          css={{ marginRight: 10, fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
                          type="primary"
                        >
                          {intl.formatMessage({ defaultMessage: "Withdraw all" })}
                        </Button>
                        <Button css={{ fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }} type="primary">
                          {intl.formatMessage({ defaultMessage: "Re-deposit" })}
                        </Button>
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
                      <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>0 WTF</div>
                      <div css={{ display: "flex" }}>
                        <Button
                          css={{ marginRight: 10, fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
                          type="primary"
                        >
                          {intl.formatMessage({ defaultMessage: "Claim" })}
                        </Button>
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
                            defaultMessage: `After maturity, you can choose to withdraw all the principal + interest. You can also choose to re-deposit to the next cycle. You can change the tranche and the number in next cycle, it's completely up to you.`
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Table>
      )}
      {Boolean(width && width <= 768) && (
        <>
          {[1, 2, 3, 4].map((p, i) => (
            <div key={i}>
              <MyPortfolioItem />
            </div>
          ))}
        </>
      )}
      <ReDeposit visible={false} />
    </React.Fragment>
  );
});

export default injectIntl(Positions);
