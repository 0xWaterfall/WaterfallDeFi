/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Bulb } from "assets/images";
import Button from "components/Button/Button";
import useScrollTop from "hooks/useScrollTop";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Action from "./Action/Action";

const Wrapper = styled.div`
  max-width: 1072px;
  padding: 86px 24px 160px;
  margin: 0 auto;
`;

const Unclaim = styled.div`
  padding: 0 30px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 40px;
  & > section {
    margin-right: 44px;
    p {
      font-weight: 500;
      font-size: 16px;
      line-height: 21px;
      color: ${({ theme }) => theme.gray.normal85};
      margin-bottom: 6px;
    }

    span {
      font-size: 12px;
      line-height: 16px;
      color: ${({ theme }) => theme.gray.normal5};
    }
  }
  button {
    background: ${({ theme }) => theme.primary.lightBrown};
    color: ${({ theme }) => theme.primary.normal};
    font-weight: 500;
    font-size: 14px;
    line-height: 125%;
    margin-right: 10px;
    height: 32px;
    box-shadow: none;
    :hover,
    :focus {
      background: ${({ theme }) => theme.primary.lightBrown};
      color: ${({ theme }) => theme.primary.normal};
    }
  }
  & > div {
    padding: 0 12px;
    height: 32px;
    background: ${({ theme }) => theme.primary.lightBrown};
    border-radius: 8px;
    display: grid;
    gap: 6.5px;
    grid-auto-flow: column;
    align-items: center;

    span {
      font-size: 12px;
      line-height: 16px;
      color: ${({ theme }) => theme.gray.normal7};
    }
  }
`;

const BodyWrapper = styled.div``;

const APYCard = styled.div`
  background: ${({ theme }) => "linear-gradient(360deg, rgba(21, 121, 255, .1) 0%, rgba(21, 123, 255, .1) 100%)"};
  padding: 24px 43px 24px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.gray.normal85};
  border-radius: 12px;
  & > div {
    p {
      font-weight: 500;
      font-size: 20px;
      line-height: 26px;
      margin-bottom: 8px;
    }
    span {
      font-size: 14px;
      line-height: 18px;
    }
  }
  & > span {
    font-style: italic;
    font-weight: 300;
    font-size: 40px;
    line-height: 52px;
    color: ${({ theme }) => theme.primary.deep};
  }
`;

const Total = styled.div`
  width: fit-content;
  padding: 0 30px;
  margin: 20px 0 32px;
  font-size: 16px;
  line-height: 21px;
  color: ${({ theme }) => theme.gray.normal7};
  display: grid;
  gap: 16px;
  grid-auto-flow: column;
`;

type TProps = WrappedComponentProps;

const Stake = memo<TProps>(({ intl }) => {
  useScrollTop();
  return (
    <Wrapper>
      <Unclaim>
        <section>
          <p>{intl.formatMessage({ defaultMessage: "You unclaim WTF" })}: 123.321</p>
          <span>({intl.formatMessage({ defaultMessage: "From portfolio reward" })})</span>
        </section>
        <Button>{intl.formatMessage({ defaultMessage: "Claim" })}</Button>
        <div>
          <Bulb />
          <span>{intl.formatMessage({ defaultMessage: "Claim to the wallet first, then stake WTF." })}</span>
        </div>
      </Unclaim>

      <BodyWrapper>
        <APYCard>
          <div>
            <p>{intl.formatMessage({ defaultMessage: "Lock WTF to earn more" })}</p>
            <span>
              {intl.formatMessage({ defaultMessage: "Earn daily WTF rewards and weekly trade fee dividends. " })}
            </span>
          </div>
          <span>APY 150%</span>
        </APYCard>

        <Total>
          <span>{intl.formatMessage({ defaultMessage: "Total locked WTF" })}: 16,784,611.32</span>
          <span>{intl.formatMessage({ defaultMessage: "Average lock duration" })}: 4.0 months</span>
        </Total>

        <Action />
      </BodyWrapper>
    </Wrapper>
  );
});

export default injectIntl(Stake);
