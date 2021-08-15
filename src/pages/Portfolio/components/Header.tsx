/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import { WaterFallMountain, Boxes } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import Claim from "./Claim";

type TProps = WrappedComponentProps;
const TitleH1 = styled.h1`
  font-size: 48px;
  line-height: 74px;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.gray.normal85};
  margin-bottom: 15px;
  position: relative;
  width: 600px;
  max-height: 300px;
  margin: 0 auto;
  padding: 10px;
  text-align: center;
  @media screen and (max-width: 678px) : {
    font-size: 30px;
  }
`;
const DescText = styled.p`
  max-width: 500px;
  color: ${({ theme }) => theme.gray.normal85};
  font-family: ${({ theme }) => theme.fonts.Nunito};
  text-align: center;
  line-height: 1.5;
  @media screen and (max-width: 512px) : {
    text-align: left;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 137px;
  padding-bottom: 55px;
  justify-content: space-between;
  @media screen and (max-width: 1148px) : {
    margin: "60px 0 20px";
    padding: 0;
  }
  ,
    @media screen and (max-width: 512px) : {
    align-items: flex-start;
  }
`;
const WaterFallMountainWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 100%;
  width: 165px;
  height: 200px;
  padding: 10px;
`;
const DistributionWrapper = styled.div`
  position: absolute;
  top: 180px;
  left: 100%;
  width: 210px;
  height: 95px;
  padding: 10px 0px;
  padding-left: 20px;
  border: 2px solid rgba(0, 102, 255, 0.2);
  box-sizing: border-box;
  box-shadow: 0px 4px 10px rgba(15, 96, 227, 0.1);
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
  & > div > div > div:nth-of-type(1) {
    font-weight: 600;
    font-size: 14px;
    letter-spacing: -0.015em;
    color: ${({ theme }) => theme.primary.deep};
    font-family: ${({ theme }) => theme.fonts.Nunito};
    margin-top: 10px;
  }
  & > div > div > div:nth-of-type(2) {
    font-size: 24px;
    line-height: 37px;
    letter-spacing: -0.015em;
    color: ${({ theme }) => theme.primary.deep};
  }
`;
const BoxesWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 100%;
  width: 165px;
  height: 200px;
  padding: 10px;
  background-image: url(Boxes.png);
`;
const Header = memo<TProps>(({ intl }) => {
  const { primary, fonts, gray, white } = useTheme();

  return (
    <div>
      <Wrapper>
        <div css={{ position: "relative" }}>
          <TitleH1>{intl.formatMessage({ defaultMessage: "Deposit Together, enjoy the distribution" })}</TitleH1>
          <WaterFallMountainWrapper>
            <WaterFallMountain />
          </WaterFallMountainWrapper>
          <DistributionWrapper>
            <Claim />
          </DistributionWrapper>
          <BoxesWrapper>
            <Boxes />
          </BoxesWrapper>
        </div>
        <DescText>
          {intl.formatMessage({
            defaultMessage:
              "Through cash flow distribution, it will ensure that Senior users get a fixed income, while Junior can get more leveraged income."
          })}
        </DescText>
      </Wrapper>
    </div>
  );
});

export default injectIntl(Header);
