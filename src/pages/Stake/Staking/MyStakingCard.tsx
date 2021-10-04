/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import AddAmountModal from "./Modal/AddAmountModal";

const Wrapper = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.white.normal5};
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  border-radius: 24px;
  display: grid;
  gap: 24px;
  grid-template-areas: "a b c d e";
  color: ${({ theme }) => theme.gray.normal7};
  margin-bottom: 50px;

  @media screen and (max-width: 1000px) {
    grid-template-areas:
      "a a b b"
      "c c d e";
  }

  @media screen and (max-width: 580px) {
    grid-template-areas:
      "a a"
      "b b"
      "c c"
      "d e";
  }

  span {
    display: block;
    font-size: 14px;
    line-height: 125%;
    margin-bottom: 11px;
    white-space: nowrap;
  }
  p {
    font-weight: bold;
    font-size: 20px;
    line-height: 125%;
    color: ${({ theme }) => theme.gray.normal85};
    margin-bottom: 11px;
  }
`;

const Block = styled.div`
  padding: 18px 28px;
  border-radius: 24px;
  border: solid 1px transparent;
  background-image: linear-gradient(180deg, #fff, #fff),
    linear-gradient(180deg, #5946f8 0%, #2494dc 44.79%, #00cccb 100%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LinearGradientBtn = styled.button`
  min-width: 138px;
  height: 32px;
  border-radius: 8px;
  border: solid 2px transparent;
  background-image: linear-gradient(93.83deg, #fff, #fff), linear-gradient(93.83deg, #e8f7ff 26.54%, #bffeff 70.96%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0px 4px 10px 0px #0f60e31a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 125%;
  color: ${({ theme }) => theme.primary.deep};
  cursor: pointer;
`;

const NoBorderBlock = styled.div`
  padding: 18px 0;
  margin-left: 20px;
`;

type TProps = WrappedComponentProps;

const MyStakingCard = memo<TProps>(({ intl }) => {
  const [amountModalVisit, setAmountModalVisit] = useState(true);
  return (
    <Wrapper>
      <Block css={{ gridArea: "a" }}>
        <div>
          <span>{intl.formatMessage({ defaultMessage: "Locking" })}（WTF）</span>
          <p>1,000,000,000</p>
          <span>$ 2517.12</span>
        </div>
        <LinearGradientBtn>{intl.formatMessage({ defaultMessage: "Add Amount" })}</LinearGradientBtn>
      </Block>
      <Block css={{ gridArea: "b" }}>
        <div>
          <span>{intl.formatMessage({ defaultMessage: "Expire date" })}</span>
          <p>Unlockable</p>
        </div>
        <LinearGradientBtn>{intl.formatMessage({ defaultMessage: "Add Amount" })}</LinearGradientBtn>
      </Block>
      <Block css={{ gridArea: "c" }}>
        <div>
          <span>{intl.formatMessage({ defaultMessage: "You get Ratio" })}</span>
          <p>0.83%</p>
        </div>
        <LinearGradientBtn>{intl.formatMessage({ defaultMessage: "Add Amount" })}</LinearGradientBtn>
      </Block>
      <NoBorderBlock css={{ gridArea: "d" }}>
        <span>{intl.formatMessage({ defaultMessage: "Staking" })}（Ve-WTF）</span>
        <p>1,000,000,000</p>
        <span>$ 2517.12</span>
      </NoBorderBlock>
      <NoBorderBlock css={{ gridArea: "e" }}>
        <span>{intl.formatMessage({ defaultMessage: "Your Share" })}</span>
        <p>0.1%</p>
      </NoBorderBlock>
      <AddAmountModal visible={amountModalVisit} onCancel={setAmountModalVisit} />
    </Wrapper>
  );
});

export default injectIntl(MyStakingCard);
