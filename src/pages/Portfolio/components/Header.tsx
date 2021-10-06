/** @jsxImportSource @emotion/react */

import { useSize } from "ahooks";
import { WaterFallMountain, Boxes } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import Claim from "./Claim";
import Airdrop from "./Airdrop";

type TProps = WrappedComponentProps;
const TitleH1 = styled.h1`
  font-size: 36px;
  line-height: 55px;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal)};
  position: relative;
  max-width: 626px;
  margin: 0 auto;
  text-align: center;
  font-weight: 600;
  @media screen and (max-width: 678px) {
    font-size: 36px;
    line-height: 55px;
    text-align: left;
  }
`;

const DescText = styled.p`
  max-width: 510px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal)};
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  margin-top: 8px;
  @media screen and (max-width: 1024px) {
    margin: 40px 0 24px;
  }
  @media screen and (max-width: 678px) {
    text-align: left;
  }
`;
const Wrapper = styled.div`
  display: flex;
  /* flex-direction: column; */
  /* align-items: center; */
  margin-top: 20px;
  margin-bottom: 100px;

  @media screen and (max-width: 1024px) {
    margin-bottom: 20px;
    flex-direction: column;
  }
`;

const Header = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <Boxes
        css={{
          // position: "absolute",
          // top: 80,
          // right: "95%",
          marginTop: 120,
          "@media screen and (max-width: 1024px)": {
            display: "none"
          }
        }}
      />
      <div css={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 60 }}>
        <TitleH1>{intl.formatMessage({ defaultMessage: "Risk Optimized Yield Farming" })}</TitleH1>
        <DescText>
          {intl.formatMessage({
            defaultMessage:
              "Yield will be distributed in a way such that users of more senior tranches get a fixed return, while users of more junior tranches get a leveraged return"
          })}
        </DescText>
      </div>

      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "@media screen and (max-width: 1024px)": {
            position: "static",
            transform: "translateX(0)"
          }
        }}
      >
        <WaterFallMountain
          css={{
            transform: "translate(-20px,20px)"
          }}
        />
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridColumnGap: 16,
            "@media screen and (max-width: 1024px)": {
              gridTemplateColumns: "none",
              gridRowGap: 16
            }
          }}
        >
          <Claim />
          <Airdrop />
        </div>
      </div>
    </Wrapper>
  );
});

export default injectIntl(Header);
