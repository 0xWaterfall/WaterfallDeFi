/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Button from "components/Button/Button";
import StakeInput from "components/Input/StakeInput";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
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
  div {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    font-size: 14px;
    line-height: 125%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
  }
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 158px;
`;

type TProps = WrappedComponentProps;

const Unstake = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <div>
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
        <Label css={{ marginTop: 25 }}>
          <div>{intl.formatMessage({ defaultMessage: "Recevied  WTF" })}</div>
          <span>0</span>
        </Label>
        <Label>
          <div>{intl.formatMessage({ defaultMessage: "Burn Ve- WTF" })}</div>
          <span>0</span>
        </Label>
      </div>
      <ButtonWrapper type="primary">{intl.formatMessage({ defaultMessage: "Unlock" })}</ButtonWrapper>
    </Wrapper>
  );
});

export default injectIntl(Unstake);
