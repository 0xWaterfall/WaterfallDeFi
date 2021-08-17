/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Table, TableColumn, TableHeaderColumn, TableRow } from "components/Table/Table";
import { CaretDown, Union } from "assets/images";
import Tooltip from "components/Tooltip/Tooltip";
import MyPositionItem from "./MyPositionItem";
import { useSize } from "ahooks";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";

type TProps = WrappedComponentProps;

const MyPositions = memo<TProps>(({ intl }) => {
  const { gray, white, primary, linearGradient } = useTheme();
  const { width } = useSize(document.body);
  const [isfolds, setFolds] = useState<{ [key: string]: boolean }>({});
  return (
    <>
      {Boolean(width && width > 768) && (
        <Table>
          <TableRow>
            <TableHeaderColumn minWidth={150}>
              {intl.formatMessage({ defaultMessage: "Portfolio Name" })}
            </TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Asset" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={240}>{intl.formatMessage({ defaultMessage: "Cycle" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Deposit APY" })}</TableHeaderColumn>
            <TableHeaderColumn minWidth={200}>{intl.formatMessage({ defaultMessage: "Principal" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Interest" })}</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
          {[1, 2, 3, 4].map((p) => (
            <div key={p}>
              <TableRow css={{ color: gray.normal85, fontSize: 16, borderBottom: `1px solid ${primary.lightBrown}` }}>
                <TableColumn minWidth={150}>Cake Fall 1</TableColumn>
                <TableColumn>BUSD</TableColumn>
                <TableColumn minWidth={240}>2021/07/01→2021/07/08</TableColumn>
                <TableColumn>Senior: 3%</TableColumn>
                <TableColumn minWidth={200}>1,000,000 BUSD</TableColumn>
                <TableColumn>
                  <Tag color="red" value="Active" />
                </TableColumn>
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
              <MyPositionItem />
            </div>
          ))}
        </>
      )}
    </>
  );
});

export default injectIntl(MyPositions);
