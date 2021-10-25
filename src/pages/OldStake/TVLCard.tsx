/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { StakingCardImage } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  padding: 32px 40px 36px;
  background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.block)};
  border-radius: 24px;
  position: relative;
  margin-bottom: 48px;
  h1 {
    font-weight: 500;
    font-size: 36px;
    line-height: 125%;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  }

  p {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    margin: 24px 0 12px;
    background: linear-gradient(90deg, #4ac9ff 0%, #167bff 98.68%);
    background-clip: text;
    color: transparent;
  }

  div {
    border-radius: 12px;
    box-shadow: 0px 4px 10px 0px #187eff33;
    border: solid 1px transparent;
    background-image: linear-gradient(90deg, #fff, #fff), linear-gradient(90deg, #4ac9ff 0%, #167bff 98.68%);
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    font-weight: 600;
    font-size: 32px;
    line-height: 42px;
    padding: 9px 47px;
    color: ${({ theme }) => theme.primary.deepBrown};
    width: fit-content;
  }
`;

const StakingCardImageWrapper = styled(StakingCardImage)`
  position: absolute;
  bottom: 0;
  right: 0;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

type TProps = WrappedComponentProps;

const TVLCard = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <StakingCardImageWrapper />
      <h1>{intl.formatMessage({ defaultMessage: "Staking" })}</h1>
      <p>{intl.formatMessage({ defaultMessage: "Total TVL" })}</p>
      <div>$444,162,901</div>
    </Wrapper>
  );
});

export default injectIntl(TVLCard);
