/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Button from "components/Button/Button";
import StakeInput from "components/Input/StakeInput";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  padding: 0 42px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.block5)};
  border-radius: 24px;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  @media screen and (max-width: 876px) {
    padding-bottom: 24px;
    margin-bottom: 24px;
  }
`;

const Tabs = styled.div`
  padding: 32px 0 20px;
  display: grid;
  gap: 20px;
  grid-auto-flow: column;
  width: fit-content;
  div {
    font-size: 24px;
    line-height: 125%;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
    cursor: pointer;
    &[data-actived="true"],
    :hover {
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
    }
  }
`;

const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal1)};
  padding-top: 32px;
`;

const Label = styled.div`
  font-size: 14px;
  line-height: 125%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
`;

const Balance = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 125%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  margin: 12px 0;
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
  margin-top: 86px;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  background: transparent;
  :hover,
  :focus {
    background: transparent;
  }
`;

type TProps = WrappedComponentProps;

const StakeAction = memo<TProps>(({ intl }) => {
  const TABS = [
    { key: "STAKE", text: intl.formatMessage({ defaultMessage: "Stake" }) },
    { key: "UNSTAKE", text: intl.formatMessage({ defaultMessage: "Unstake" }) }
  ];

  const [actived, setActived] = useState("STAKE");

  return (
    <Wrapper>
      <Tabs>
        {TABS.map((p) => (
          <div key={p.key} data-actived={actived === p.key} onClick={setActived.bind(null, p.key)}>
            {p.text}
          </div>
        ))}
      </Tabs>
      <Container>
        <Label>{intl.formatMessage({ defaultMessage: "LP Token balance" })}</Label>
        <Balance>134,927,517.2408</Balance>
        <StakeInput suffixText={"WTF-BUSD"} />
        <ButtonWrapper type="primaryLine">{intl.formatMessage({ defaultMessage: "Approve" })}</ButtonWrapper>
      </Container>
    </Wrapper>
  );
});

export default injectIntl(StakeAction);
