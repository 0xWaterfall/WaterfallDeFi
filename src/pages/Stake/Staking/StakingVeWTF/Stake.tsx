/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Button from "components/Button/Button";
import StakeInput from "components/Input/StakeInput";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  padding: 32px 41px;
  background: ${({ theme }) => theme.white.normal5};
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.gray.normal85};
`;

const Title = styled.div`
  font-size: 24px;
  line-height: 125%;
`;

const Line = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.gray.normal08};
  margin: 20px 0;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  p {
    color: ${({ theme }) => theme.gray.normal7};
    font-size: 16px;
    line-height: 125%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
  }
`;

const ButtonWrapper = styled(Button)`
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 100px;
`;
type TProps = WrappedComponentProps;

const Stake = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <Title>{intl.formatMessage({ defaultMessage: "Stake" })}</Title>
      <Line />
      <Label>
        <p>Ve-WTF balance</p>
        <span>0</span>
      </Label>

      <StakeInput
        suffixText="Ve-WTF"
        onMAX={() => {
          console.log(1);
        }}
      />

      <ButtonWrapper type="primary">{intl.formatMessage({ defaultMessage: "Stake" })}</ButtonWrapper>
    </Wrapper>
  );
});

export default injectIntl(Stake);
