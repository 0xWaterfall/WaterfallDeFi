/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Button from "components/Button/Button";
import StakeInput from "components/Input/StakeInput";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  padding: 32px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.header)};
  box-shadow: 0px 4px 10px 0px #0000000a;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
`;

const Title = styled.div`
  font-size: 24px;
  line-height: 125%;
`;

const Line = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal08, theme.white.normal08)};
  margin: 20px 0;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  p {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    font-size: 16px;
    line-height: 125%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
  }
`;

const NextTime = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.tags.yellowText};
  display: flex;
  justify-content: center;
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 25px;
  background: transparent;
  :hover,
  :focus {
    background: transparent;
  }
`;

type TProps = WrappedComponentProps;

const Unlock = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <div>
        <Title>{intl.formatMessage({ defaultMessage: "Unlock" })}</Title>
        <Line />
        <Label>
          <p>{intl.formatMessage({ defaultMessage: "Available unlock" })}</p>
          <span>0 Ve-WTF</span>
        </Label>
        <StakeInput
          suffixText="WTF"
          onMAX={() => {
            console.log(1);
          }}
        />
        <Line css={{ margin: "24px 0 26px" }} />
        <Label>
          <p>{intl.formatMessage({ defaultMessage: "Recevied  WTF" })}</p>
          <span>0</span>
        </Label>
      </div>
      <div>
        <NextTime>
          <span>{intl.formatMessage({ defaultMessage: "Next time: " })}</span>
          <span>2D 12:56:56</span>
        </NextTime>
        <ButtonWrapper type="primaryLine">{intl.formatMessage({ defaultMessage: "Unlock" })}</ButtonWrapper>
      </div>
    </Wrapper>
  );
});

export default injectIntl(Unlock);
