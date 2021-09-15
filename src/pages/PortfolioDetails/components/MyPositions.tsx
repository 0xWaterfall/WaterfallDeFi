/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useState, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Table, TableColumn, TableHeaderColumn, TableRow } from "components/Table/Table";
import { CaretDown, Union } from "assets/images";
import Tooltip from "components/Tooltip/Tooltip";
import MyPositionItem from "./MyPositionItem";
import { useSize } from "ahooks";
import Button from "components/Button/Button";
import Tag from "components/Tag/Tag";
import { useLocation } from "react-router-dom";
import { Invest, Market, PORTFOLIO_STATUS } from "types";

import { AbiItem } from "web3-utils";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Web3 from "web3";
import {
  formatAllocPoint,
  formatAPY,
  formatBalance,
  formatNumberDisplay,
  formatTimestamp,
  getInterest,
  getJuniorAPY
} from "utils/formatNumbers";
import styled from "@emotion/styled";
import { successNotification } from "utils/notification";
import { useAppDispatch } from "store";
import { getPosition } from "store/position";
import { usePendingWTFReward, usePosition, useSelectedMarket } from "hooks/useSelectors";
import useRedeemDirect from "../hooks/useRedeemDirect";
import BigNumber from "bignumber.js";

type TProps = WrappedComponentProps & {
  data: Market;
};
const Text2 = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ color }) => color};
  margin: 10px 0;
`;
const MyPositions = memo<TProps>(({ intl }) => {
  const { gray, white, primary, linearGradient, tags } = useTheme();
  const { width } = useSize(document.body);
  const [redeemLoading, setRedeemLoading] = useState<{ [key: number]: boolean }>({});
  const [isfolds, setFolds] = useState<{ [key: number]: boolean }>({});
  const location = useLocation<Market>();
  const { account, active } = useWeb3React<Web3Provider>();
  const dispatch = useAppDispatch();
  const market = useSelectedMarket();
  const position = usePosition();
  const { onRedeemDirect } = useRedeemDirect();
  const { tranchesPendingReward } = usePendingWTFReward();
  const { interests, principalAndInterests } = getInterest(market?.tranches, position, market?.duration);
  useEffect(() => {
    market && account && dispatch(getPosition({ market, account }));
  }, [market, account]);

  const redeemDirect = async (i: number) => {
    setRedeemLoading((redeemLoading) => ({ ...redeemLoading, [i]: true }));
    try {
      await onRedeemDirect(i);
      successNotification("Redeem Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setRedeemLoading((redeemLoading) => ({ ...redeemLoading, [i]: false }));
    }
  };
  const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];
  const tranchesDisplayTextColor = [tags.yellowText, tags.greenText, primary.deep];

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
            <TableHeaderColumn minWidth={240}>
              {intl.formatMessage({ defaultMessage: "Deposit APR" })}
            </TableHeaderColumn>
            <TableHeaderColumn minWidth={200}>{intl.formatMessage({ defaultMessage: "Principal" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Status" })}</TableHeaderColumn>
            <TableHeaderColumn>{intl.formatMessage({ defaultMessage: "Interest" })}</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
          {position &&
            position?.map((p, i) => {
              if (new BigNumber(p[1].hex).toNumber() !== 0)
                return (
                  <div
                    key={i}
                    css={
                      {
                        // ":hover": {
                        //   boxShadow: "0px 0px 20px rgba(0, 108, 253, 0.1)"
                        // }
                      }
                    }
                  >
                    <TableRow
                      css={{ color: gray.normal85, fontSize: 16, borderBottom: `1px solid ${primary.lightBrown}` }}
                    >
                      <TableColumn minWidth={150}>{market?.portfolio}</TableColumn>
                      <TableColumn>{market?.assets}</TableColumn>
                      <TableColumn minWidth={240} style={{ whiteSpace: "unset" }}>
                        {market?.status === PORTFOLIO_STATUS.ACTIVE && market.actualStartAt && market.duration
                          ? `${formatTimestamp(market.actualStartAt)} -
                          ${formatTimestamp(Number(market.actualStartAt) + Number(market.duration))}`
                          : null}
                      </TableColumn>
                      <TableColumn minWidth={240}>
                        {tranchesDisplayText[i]}:
                        <Text2 color={tranchesDisplayTextColor[i]}>
                          {i !== position.length - 1
                            ? formatAPY(market?.tranches[i].apy)
                            : getJuniorAPY(market?.tranches)}
                        </Text2>
                        {formatAllocPoint(market?.pools[i], market?.totalAllocPoints)}% WTF
                      </TableColumn>
                      <TableColumn minWidth={200}>
                        {formatNumberDisplay(p?.[1]?.hex)} {market?.assets}
                      </TableColumn>
                      <TableColumn>
                        {market?.status === PORTFOLIO_STATUS.PENDING && <Tag color="yellow" value="Pending" />}
                        {market?.status === PORTFOLIO_STATUS.ACTIVE && <Tag color="green" value="Active" />}
                        {market?.status === PORTFOLIO_STATUS.EXPIRED && <Tag color="red" value="Expired" />}
                      </TableColumn>
                      <TableColumn>
                        {market?.status === PORTFOLIO_STATUS.ACTIVE && interests && interests[i] + " " + market?.assets}
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
                            setFolds((isfolds) => ({ ...isfolds, [i]: !isfolds[i] }));
                          }}
                        >
                          <CaretDown
                            css={{
                              transition: "transform 0.3s",
                              transform: "rotate(0)",
                              ...(isfolds[i] ? { transform: "rotate(180deg)" } : {})
                            }}
                          />
                        </div>
                      </TableColumn>
                    </TableRow>
                    {isfolds[i] && (
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
                                {intl.formatMessage({ defaultMessage: "Principal + Est. Interest" })}
                              </span>
                              <Tooltip
                                overlay={
                                  <React.Fragment>
                                    <p>{intl.formatMessage({ defaultMessage: "When you can withdraw:" })}</p>
                                    <p>
                                      {intl.formatMessage({
                                        defaultMessage:
                                          '1. Before the cycle deploys, the principal can be withdrawn while the portfolio is in the "Pending" stage'
                                      })}
                                    </p>
                                    <p>
                                      {intl.formatMessage({
                                        defaultMessage:
                                          '2. After the deployment is completed, the principal + interest can be withdrawn while the portfolio is in the "Mature" stage'
                                      })}
                                    </p>
                                  </React.Fragment>
                                }
                              >
                                <Union css={{ color: gray.normal3 }} />
                              </Tooltip>
                            </div>
                            <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>
                              {market?.status === PORTFOLIO_STATUS.ACTIVE
                                ? principalAndInterests && principalAndInterests[i]
                                : formatNumberDisplay(p?.[1]?.hex)}{" "}
                              {market?.assets}
                            </div>
                            <div css={{ display: "flex" }}>
                              <Button
                                css={{
                                  marginRight: 10,
                                  fontSize: 12,
                                  height: 30,
                                  padding: "0 12px",
                                  borderRadius: 4,
                                  visibility: market?.status !== PORTFOLIO_STATUS.PENDING ? "hidden" : "visible"
                                }}
                                type="primary"
                                onClick={() => redeemDirect(i)}
                                loading={redeemLoading[i] || false}
                              >
                                {intl.formatMessage({ defaultMessage: "Redeem" })}
                              </Button>

                              {/* <Button css={{ fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }} type="primary">
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
                            <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>
                              {tranchesPendingReward[i]
                                ? formatNumberDisplay(tranchesPendingReward[i].toString())
                                : "-"}
                              WTF
                            </div>
                            <div css={{ display: "flex" }}>
                              <Button
                                css={{
                                  marginRight: 10,
                                  fontSize: 12,
                                  height: 30,
                                  padding: "0 12px",
                                  borderRadius: 4,
                                  visibility: "hidden"
                                }}
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
                                  defaultMessage: `Upon maturity, you can choose to withdraw all the principal + interest. Alternatively you can choose to deposit to the next cycle - and choose the amount of re-deposit and tranche you re-deposit to.`
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
        </Table>
      )}
      {Boolean(width && width <= 768) && (
        <>
          {market &&
            redeemDirect &&
            position.map((p, i) => {
              return (
                <div key={i}>
                  <MyPositionItem
                    market={market}
                    positionIdx={i}
                    position={p}
                    tranchesPendingReward={tranchesPendingReward[i]}
                    principalAndInterest={principalAndInterests && principalAndInterests[i]}
                    interest={interests && interests[i]}
                    redeemLoading={redeemLoading[i] || false}
                    redeemDirect={redeemDirect}
                  />
                </div>
              );
            })}
        </>
      )}
    </>
  );
});

export default injectIntl(MyPositions);
