/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Star } from "assets/images";
import { Table } from "components/Table/Table";
import TableHeader from "components/Table/TableHeader";
import TableRow from "components/Table/TableRow";
import TableColumn from "components/Table/TableColumn";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import TrancheChart from "./TrancheChart";
import AssetChart from "./AssetChart";
import Button from "components/Button/Button";
import Positions from "./Positions";

type TProps = WrappedComponentProps;

const MyPortfolio = memo<TProps>(({ intl }) => {
  const { gray, warn, green, primary, fonts } = useTheme();
  const { push } = useHistory();
  return (
    <div>
      {/* overview */}
      <div css={{ marginBottom: 24, fontSize: 20, fontWeight: 600, color: gray.normal85 }}>
        {intl.formatMessage({ defaultMessage: "Overview" })}
      </div>
      <div css={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridColumnGap: 20 }}>
        <div css={{ paddingInline: 24, borderRadius: 12, border: `1px solid ${primary.deep2}` }}>
          <div
            css={{
              height: 70,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${primary.deep2}`
            }}
          >
            <div>
              <span css={{ color: gray.normal7 }}>{intl.formatMessage({ defaultMessage: "Total notional:" })}</span>
              <span css={{ fontWeight: 700 }}> $100,000,000.1234</span>
            </div>
            <div>
              <span css={{ color: gray.normal7 }}>{intl.formatMessage({ defaultMessage: "Average Duration:" })}</span>
              <span css={{ fontWeight: 700 }}>3D 12H</span>
            </div>
          </div>
          <div css={{ display: "flex", paddingBlock: 35 }}>
            <TrancheChart />
            <AssetChart />
          </div>
        </div>
        <div css={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: 20 }}>
          <div
            css={{
              border: `1px solid ${primary.deep2}`,
              borderRadius: 12,
              paddingInline: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div css={{ paddingBlock: 24, color: gray.normal7 }}>
                {intl.formatMessage({ defaultMessage: "Return principal+Interest" })}
              </div>
              <div css={{ fontFamily: fonts.CarterOne, color: primary.deep, fontSize: 24 }}>100,000,000 BUSD</div>
            </div>
            <div css={{ padding: "16px 0", borderTop: `1px solid ${primary.deep2}` }}>
              <Button type="primary">{intl.formatMessage({ defaultMessage: "Withdraw All" })}</Button>
            </div>
          </div>
          <div
            css={{
              border: `1px solid ${primary.deep2}`,
              borderRadius: 12,
              paddingInline: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div css={{ paddingBlock: 24, color: gray.normal7 }}>
                {intl.formatMessage({ defaultMessage: "WTF Reward" })}
              </div>
              <div css={{ fontFamily: fonts.CarterOne, color: primary.deep, fontSize: 24 }}>500,000 WTF</div>
            </div>
            <div css={{ padding: "16px 0", borderTop: `1px solid ${primary.deep2}` }}>
              <Button type="default">{intl.formatMessage({ defaultMessage: "Approve" })}</Button>
            </div>
          </div>
        </div>
      </div>

      {/* position */}
      <div css={{ margin: "24px 0", fontSize: 20, fontWeight: 600, color: gray.normal85 }}>
        {intl.formatMessage({ defaultMessage: "Positions" })}
      </div>
      <Positions />
    </div>
  );
});

export default injectIntl(MyPortfolio);
