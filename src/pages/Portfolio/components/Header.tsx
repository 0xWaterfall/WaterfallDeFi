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
  position: relative;
  max-width: 626px;
  margin: 0 auto;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.CarterOne};
  @media screen and (max-width: 678px) {
    font-size: 36px;
    line-height: 55px;
    text-align: left;
  }
`;

const DescText = styled.p`
  max-width: 510px;
  color: ${({ theme }) => theme.gray.normal7};
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
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 150px;

  @media screen and (max-width: 1024px) {
    margin-bottom: 0;
  }
`;

const Header = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <div css={{ position: "relative", "@media screen and (max-width: 1024px)": {} }}>
        <div css={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <TitleH1>{intl.formatMessage({ defaultMessage: "Deposit together, enjoy the distribution" })}</TitleH1>
          <DescText>
            {intl.formatMessage({
              defaultMessage:
                "Yield will be distributed in a way such that users of more senior tranches get a fixed return, while users of more junior tranches get a leveraged return"
            })}
          </DescText>
        </div>
        <Boxes
          css={{
            position: "absolute",
            top: 80,
            right: "95%",
            "@media screen and (max-width: 1024px)": {
              display: "none"
            }
          }}
        />

        <div
          css={{
            position: "absolute",
            top: 0,
            right: 0,
            transform: "translateX(100%)",
            "@media screen and (max-width: 1024px)": {
              position: "static",
              transform: "translateX(0)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }
          }}
        >
          <WaterFallMountain />
          <Claim />
        </div>
      </div>
    </Wrapper>
  );
});

export default injectIntl(Header);
