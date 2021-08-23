/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import TrancheChart from "./TrancheChart";
import AssetChart from "./AssetChart";
import Button from "components/Button/Button";
import Positions from "./Positions";

type TProps = WrappedComponentProps;
const TitleDiv = styled.div`
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.gray.normal};
`;
const MainGridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-column-gap: 20px;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;
const MainGridContainer2 = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 20px;
  & > div {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border-radius: 12px;
    padding-inline: 24px;
    border: 1px solid ${({ theme }) => theme.primary.deep2};
  }
  @media screen and (max-width: 768px) {
    & > div {
      align-items: flex-start;
    }
  }
`;

const GridItem1 = styled.div`
  padding-inline: 24px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  & > div:nth-of-type(1) {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.primary.deep2};
  }
  @media screen and (max-width: 768px) {
    border: none;
    padding-inline: 0;
    & > div:nth-of-type(1) {
      border-bottom: none;
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
const ChartDiv = styled.div`
  display: flex;
  padding-block: 35px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    & > div {
      background-color: ${({ theme }) => theme.primary.lightBrown};
      margin: 10px 0px;
      border-radius: 12px;
      padding: 20px;
    }
  }
`;

const MyPortfolio = memo<TProps>(({ intl }) => {
  const { gray, primary, fonts } = useTheme();
  return (
    <div>
      {/* overview */}
      <TitleDiv>{intl.formatMessage({ defaultMessage: "Overview" })}</TitleDiv>
      <MainGridContainer>
        <GridItem1>
          <div>
            <div>
              <span css={{ color: gray.normal7 }}>{intl.formatMessage({ defaultMessage: "Total notional:" })}</span>
              <span css={{ fontWeight: 700 }}> $100,000,000.1234</span>
            </div>
            <div>
              <span css={{ color: gray.normal7 }}>{intl.formatMessage({ defaultMessage: "Average Duration:" })}</span>
              <span css={{ fontWeight: 700 }}>3D 12H</span>
            </div>
          </div>
          <ChartDiv>
            <TrancheChart />
            <AssetChart />
          </ChartDiv>
        </GridItem1>
        <MainGridContainer2>
          <div>
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
          <div>
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
        </MainGridContainer2>
      </MainGridContainer>

      {/* position */}
      <div css={{ margin: "24px 0", fontSize: 20, fontWeight: 600, color: gray.normal85 }}>
        {intl.formatMessage({ defaultMessage: "Positions" })}
      </div>
      <Positions />
    </div>
  );
});

export default injectIntl(MyPortfolio);
