/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Star } from "assets/images";
import { Table, TableColumn, TableRow } from "components/Table/Table";
import { size } from "lodash";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import DepositBlock from "./DepositBlock";
import { Progress } from "antd";
import Percentage from "./Percentage";

const APYStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClaimBlock = styled.div`
  min-width: 190px;
  height: 78px;
  background-color: ${({ theme }) => theme.primary.lightBrown};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.claim};
  padding-left: 24px;
  padding-top: 12px;
  color: ${({ theme }) => theme.primary.deep};
  line-height: 1.5;
  position: relative;
  @media screen and (max-width: 678px) {
    height: 68px;
  }
  @media screen and (max-width: 512px) {
    margin-top: 12px;
  }
`;

const ClaimBlockName = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary.normal};
  margin-bottom: 4px;
`;

type TProps = WrappedComponentProps;

const CreateDeposit = memo<TProps>(({ intl }) => {
  const { gray, warn, green, primary } = useTheme();
  const { push } = useHistory();
  return (
    <Table>
      <TableRow>
        <TableColumn minWidth={60}>{intl.formatMessage({ defaultMessage: "Series" })}</TableColumn>
        <TableColumn minWidth={240}>{intl.formatMessage({ defaultMessage: "Cycle" })}</TableColumn>
        <TableColumn minWidth={270}>{intl.formatMessage({ defaultMessage: "Deposit APY" })}</TableColumn>
        <TableColumn minWidth={170}>{intl.formatMessage({ defaultMessage: "Series TVL" })}</TableColumn>
        <TableColumn>{intl.formatMessage({ defaultMessage: "Remaining" })}</TableColumn>
        <TableColumn></TableColumn>
      </TableRow>
      {[1, 2, 3, 4].map((p) => (
        <TableRow
          height={100}
          css={{ color: gray.normal85, fontSize: 16 }}
          key={p}
          onClick={() => {
            push({ pathname: "/portfolio/details" });
          }}
        >
          <TableColumn>2</TableColumn>
          <TableColumn minWidth={250}>2021/07/01→2021/07/08</TableColumn>
          <TableColumn minWidth={280} css={{ display: "flex" }}>
            <div css={{ display: "flex" }}>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Senior" })}</span>
                <span css={{ marginTop: 15, color: warn.normal }}>5%</span>
              </APYStyled>
              <div>&nbsp;→&nbsp;</div>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Mezzanine" })}</span>
                <span css={{ marginTop: 15, color: green.normal }}>7.5%</span>
              </APYStyled>
              <div>&nbsp;→&nbsp;</div>
              <APYStyled>
                <span>{intl.formatMessage({ defaultMessage: "Junior" })}</span>
                <span css={{ marginTop: 15, color: primary.deep }}>30%</span>
              </APYStyled>
            </div>
          </TableColumn>
          <TableColumn>30,000</TableColumn>
          <TableColumn minWidth={200} css={{ display: "flex" }}>
            <div css={{ display: "flex" }}>
              <APYStyled>
                <span css={{ fontSize: 12 }}>{intl.formatMessage({ defaultMessage: "Senior" })}</span>
                <span css={{ marginTop: 23, fontSize: 12 }}>50%</span>
              </APYStyled>
              <div>&nbsp; &nbsp;</div>
              <APYStyled>
                <span css={{ fontSize: 12 }}>{intl.formatMessage({ defaultMessage: "Mezzanine" })}</span>
                <span css={{ marginTop: 23, fontSize: 12 }}>50%</span>
              </APYStyled>
              <div>&nbsp; &nbsp;</div>
              <APYStyled>
                <span css={{ fontSize: 12 }}>{intl.formatMessage({ defaultMessage: "Junior" })}</span>
                <span css={{ marginTop: 23, fontSize: 12 }}>25%</span>
              </APYStyled>
            </div>
          </TableColumn>
          <TableColumn css={{ display: "flex" }}>
            <div css={{ display: "flex" }}>
              <APYStyled>
                <DepositBlock />
                <span css={{ fontSize: 10, marginTop: 10 }}>Close in: 0D 12H 24M 56S</span>
              </APYStyled>
            </div>
          </TableColumn>
        </TableRow>
      ))}
    </Table>
  );
});

export default injectIntl(CreateDeposit);
