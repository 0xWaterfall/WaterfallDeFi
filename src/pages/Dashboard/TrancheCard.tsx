/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { BUSD, WTFToken } from "assets/images";
import Button from "components/Button/Button";

const Wrapper = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => theme.white.normal};
  padding: 63px 40px;
  display: grid;
  gap: 24px;
  grid-auto-flow: row;
  position: relative;
  filter: drop-shadow(0px 4px 20px rgba(0, 108, 253, 0.04));
`;

const Block = styled.div`
  height: 77px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 500px;
  background: ${({ theme }) => theme.primary.lightBrown};
  border-radius: 12px;
  div {
    display: flex;
    align-items: center;
  }

  :nth-of-type(1) p {
    color: ${({ theme }) => theme.tags.yellowText};
  }
  :nth-of-type(2) p {
    color: ${({ theme }) => theme.green.normal};
  }
  :nth-of-type(3) p {
    color: ${({ theme }) => theme.primary.light};
  }
`;

const Section = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.primary.deep};
`;

const WTF = styled(WTFToken)`
  width: 26px;
  height: 26px;
  margin-right: 5px;
`;

const ButtonWrapper = styled(Button)`
  border-radius: 50px;
  position: absolute;
  left: 50%;
  bottom: 0;
  padding: 0 82px;
  height: 58px;
  font-size: 20px;
  font-weight: 500;
  transform: translate(-50%, 50%);
`;

const IconWrapper = styled.div`
  width: 88px;
  height: 88px;
  padding: 10px;
  border-radius: 50%;
  border: solid 4px transparent;
  background-image: linear-gradient(132.89deg, #fff, #fff),
    linear-gradient(180deg, #5946f8 0%, #2494dc 44.79%, #00cccb 100%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 100%;
    height: 100%;
  }
`;

type TProps = WrappedComponentProps;

const TrancheCard = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <IconWrapper>
        <BUSD />
      </IconWrapper>
      <Block>
        <span>{intl.formatMessage({ defaultMessage: "Senior" })}</span>
        <Section>
          <p>APR 3%</p>
          <div>
            <WTF /> +25%
          </div>
        </Section>
      </Block>
      <Block>
        <span>{intl.formatMessage({ defaultMessage: "Mezzanine" })}</span>
        <Section>
          <p>APR 7%</p>
          <div>
            <WTF /> +35%
          </div>
        </Section>
      </Block>
      <Block>
        <span>{intl.formatMessage({ defaultMessage: "Junior" })}</span>
        <Section>
          <p>APR 17%</p>
          <div>
            <WTF /> +40%
          </div>
        </Section>
      </Block>
      <ButtonWrapper type="primary">{intl.formatMessage({ defaultMessage: "Start" })}</ButtonWrapper>
    </Wrapper>
  );
});

export default injectIntl(TrancheCard);
