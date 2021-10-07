/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { ArrowLeft, ChevronLeft, Union } from "assets/images";
import Button from "components/Button/Button";
import useScrollTop from "hooks/useScrollTop";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.header3)};
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
`;

const Line = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal08)};
  margin: 26px 0;
`;

const Title = styled.div`
  width: fit-content;
  display: grid;
  gap: 6px;
  grid-auto-flow: column;
  align-items: center;
  font-size: 24px;
  line-height: 31px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    margin-bottom: 13px;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
    font-size: 16px;
    line-height: 125%;
    font-weight: bold;
  }
  span {
    font-size: 14px;
    line-height: 125%;
  }
`;

type TProps = WrappedComponentProps;

const RewardCard = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <Title>
        <span>{intl.formatMessage({ defaultMessage: "Pending Rewards" })}</span>
        <Union />
      </Title>
      <Line />
      <Container>
        <div>
          <p>0 WTF</p>
          <span>$ 0</span>
        </div>
        <div>
          <p>0 BUSD</p>
          <span>$ 0</span>
        </div>
        <Button type="primary">{intl.formatMessage({ defaultMessage: "Harvest" })}</Button>
      </Container>
    </Wrapper>
  );
});

export default injectIntl(RewardCard);
