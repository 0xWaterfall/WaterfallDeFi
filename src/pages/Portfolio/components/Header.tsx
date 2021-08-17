/** @jsxImportSource @emotion/react */

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
  max-height: 300px;
  margin: 0 auto;
  padding: 10px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.CarterOne};
  @media screen and (min-width: 768px) {
    max-width: 600px;
  }
  @media screen and (max-width: 768px) {
    font-size: 36px;
    text-align: left;
    padding: 0px;
  }
`;
const DescText = styled.p`
  @media screen and (min-width: 768px) {
    max-width: 500px;
  }
  color: ${({ theme }) => theme.gray.normal7};
  font-family: ${({ theme }) => theme.fonts.Nunito};
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  @media screen and (max-width: 768px) {
    text-align: left;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 55px;
  justify-content: space-between;

  @media screen and (min-width: 768px) {
    margin-top: 137px;
  }
  @media screen and (max-width: 768px) {
    padding: 0;
    margin-top: 20px;
  }
  ,
  @media screen and (max-width: 512px) : {
    align-items: flex-start;
  }
`;
const WaterFallMountainWrapper = styled.div`
  width: 165px;
  height: 200px;
  padding: 10px;
  @media screen and (min-width: 768px) {
    position: absolute;
    top: 0px;
    left: 100%;
  }
  @media screen and (max-width: 768px) {
    position: relative;
  }
`;
const DistributionWrapper = styled.div`
  @media screen and (min-width: 768px) {
    position: absolute;
    top: 180px;
    left: 100%;
  }
  @media screen and (max-width: 768px) {
    position: relative;
  }

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
    font-family: ${({ theme }) => theme.fonts.CarterOne};
  }
`;
const BoxesWrapper = styled.div`
  width: 165px;
  height: 200px;
  padding: 10px;
  background-image: url(Boxes.png);
  position: absolute;
  @media screen and (min-width: 768px) {
    top: 60px;
    right: 100%;
  }
  @media screen and (max-width: 768px) {
    transform: scaleX(-1);
    right: 40px;
    top: 250px;
    z-index: -1;
  }
`;
const Header = memo<TProps>(({ intl }) => {
  const { width } = useSize(document.body);

  return (
    <div>
      <Wrapper>
        <div css={{ position: "relative" }}>
          <TitleH1>{intl.formatMessage({ defaultMessage: "Deposit Together, enjoy the distribution" })}</TitleH1>
          {Boolean(width && width > 768) && (
            <>
              <WaterFallMountainWrapper>
                <WaterFallMountain />
              </WaterFallMountainWrapper>
              <DistributionWrapper>
                <Claim />
              </DistributionWrapper>
              <BoxesWrapper>
                <Boxes />
              </BoxesWrapper>
            </>
          )}
        </div>
        <DescText>
          {intl.formatMessage({
            defaultMessage:
              "Through cash flow distribution, it will ensure that Senior users get a fixed income, while Junior can get more leveraged income."
          })}
        </DescText>
        {Boolean(width && width <= 768) && (
          <>
            <WaterFallMountainWrapper>
              <WaterFallMountain />
            </WaterFallMountainWrapper>
            <DistributionWrapper>
              <Claim />
            </DistributionWrapper>
            <BoxesWrapper>
              <Boxes />
            </BoxesWrapper>
          </>
        )}
      </Wrapper>
    </div>
  );
});

export default injectIntl(Header);
