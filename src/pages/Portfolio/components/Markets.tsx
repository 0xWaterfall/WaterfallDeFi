/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Star } from "assets/images";
import TableWrapper from "components/Table/TableWrapper";
import TableHeader from "components/Table/TableHeader";
import TableRow from "components/Table/TableRow";
import TableColumn from "components/Table/TableColumn";
import Tag from "components/Tag/Tag";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import Button from "components/Button/Button";
import MarketItem from "./Market/MarketItem";
import { useSize } from "ahooks";

const APYStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

type TProps = WrappedComponentProps;

const Markets = memo<TProps>(({ intl }) => {
  const { gray, warn, green, primary } = useTheme();
  const { push } = useHistory();
  const { width } = useSize(document.body);
  return (
    <>
      {Boolean(width && width > 768) && (
        <TableWrapper>
          <TableHeader>
            <TableColumn>{intl.formatMessage({ defaultMessage: "Portfolio" })}</TableColumn>
            <TableColumn>{intl.formatMessage({ defaultMessage: "Asset" })}</TableColumn>
            <TableColumn>{intl.formatMessage({ defaultMessage: "Lock-up period" })}</TableColumn>
            <TableColumn minWidth={320}>{intl.formatMessage({ defaultMessage: "Deposit APY" })}</TableColumn>
            <TableColumn minWidth={200}>{intl.formatMessage({ defaultMessage: "TVL" })}</TableColumn>
            <TableColumn minWidth={80}>{intl.formatMessage({ defaultMessage: "Status" })}</TableColumn>
            <TableColumn minWidth={150}>{intl.formatMessage({ defaultMessage: "Action" })}</TableColumn>
          </TableHeader>
          {[1, 2, 3, 4].map((p, i) => (
            <TableRow
              height={100}
              css={{ color: gray.normal85, fontSize: 16 }}
              key={p}
              onClick={() => {
                push({ pathname: "/portfolio/details" });
              }}
            >
              <TableColumn>Cake Falls</TableColumn>
              <TableColumn>
                <Star /> CAKE
              </TableColumn>
              <TableColumn>7 Days</TableColumn>
              <TableColumn minWidth={320} css={{ display: "flex" }}>
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
              <TableColumn minWidth={200}>1,000,000 CAKE</TableColumn>
              <TableColumn minWidth={80}>
                {i === 1 || i === 0 ? <Tag color="red" value={"Expired"}></Tag> : null}
                {i === 2 ? <Tag color="yellow" value={"Pending"}></Tag> : null}
                {i === 3 ? <Tag color="green" value={"Active"}></Tag> : null}
              </TableColumn>
              <TableColumn minWidth={150}>
                <APYStyled>
                  <Button type="primary">Deposit</Button>
                  <span css={{ fontSize: 10, marginTop: 10 }}>Next Time: 0D 12H 24M 56S</span>
                </APYStyled>
              </TableColumn>
            </TableRow>
          ))}
        </TableWrapper>
      )}
      {Boolean(width && width <= 768) && (
        <>
          {[1, 2, 3, 4].map((p, i) => (
            <div key={i}>
              <MarketItem />
            </div>
          ))}
        </>
      )}
    </>
  );
});

export default injectIntl(Markets);
