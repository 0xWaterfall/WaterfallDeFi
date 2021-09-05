/** @jsxImportSource @emotion/react */

import { Deposit, Wait, Withdraw, ArrowLine } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { Row, Col } from "antd";
import { useSize } from "ahooks";

type TProps = WrappedComponentProps;
const TitleH2 = styled.h2`
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  color: ${({ theme }) => theme.gray.normal};
  font-family: ${({ theme }) => theme.fonts.CarterOne};
`;
const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;

  align-items: center;
  & > svg {
    height: 74px;
    width: 74px;
  }
  @media screen and (max-width: 768px) {
    & > svg {
      height: 48px;
      width: 48px;
    }
  }
`;
const DescText = styled.p`
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: ${({ theme }) => theme.gray.normal7};
  max-width: 270px;
  margin: 0 auto;
  @media screen and (max-width: 1024px) {
    margin: 0;
  }
`;
const ArrowWrapper = styled.div`
  position: absolute;
  top: 30px;
  left: calc(50% + 80px);
  width: calc(50%);
  height: 200px;
  padding: 10px;
  & > svg {
    max-width: calc(100%);
  }
`;
const RowWrapper = styled.div`
  background: linear-gradient(
    90deg,
    rgba(252, 182, 4, 0.1) 14.14%,
    rgba(3, 161, 75, 0.1) 45.76%,
    rgba(12, 108, 254, 0.1) 84.73%
  );
  filter: blur(200px);
  transform: matrix(-1, 0, 0, 1, 0, 0);
  position: absolute;
  width: 100%;
  height: 100%;
`;

const ColWrapper = styled(Col)`
  @media screen and (max-width: 768px) {
    display: grid !important;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    grid-auto-rows: minmax(30px, auto);
    background: ${({ theme }) => theme.white.normal};
    border: 1px solid ${({ theme }) => theme.primary.lightBrown};
    padding: 10px;
    margin: 10px 0;
    box-sizing: border-box;
    border-radius: 12px;
    & > div {
      grid-column: 1;
      grid-row: 1 / 3;
    }
    & > h2 {
      grid-column: 2 / 6;
      grid-row: 1;
      text-align: left;
    }
    & > p {
      grid-column: 2 / 6;
      grid-row: 2;
      text-align: left;
    }
  }
`;
const WorkFlow = memo<TProps>(({ intl }) => {
  const { width } = useSize(document.body);
  return (
    <div
      css={{
        position: "relative",
        marginBottom: 90,
        "@media screen and (max-width: 1024px)": {
          marginBottom: 45
        }
      }}
    >
      <RowWrapper />
      <Row>
        <ColWrapper span={8} md={8} xs={24}>
          <ImgWrapper>
            <Deposit />
          </ImgWrapper>
          <TitleH2>{intl.formatMessage({ defaultMessage: "Deposit" })}</TitleH2>
          <DescText>
            {intl.formatMessage({ defaultMessage: "Choose the tranche that suits you and get started!" })}
          </DescText>
          {Boolean(width && width > 768) && (
            <ArrowWrapper>
              <ArrowLine />
            </ArrowWrapper>
          )}
        </ColWrapper>
        <ColWrapper span={8} md={8} xs={24}>
          <ImgWrapper>
            <Wait />
          </ImgWrapper>
          <TitleH2>{intl.formatMessage({ defaultMessage: "Wait" })}</TitleH2>
          <DescText>
            {intl.formatMessage({
              defaultMessage: "When all the tranches are filled, it will set off the portfolio deployment."
            })}
          </DescText>
          {Boolean(width && width > 768) && (
            <ArrowWrapper>
              <ArrowLine />
            </ArrowWrapper>
          )}
        </ColWrapper>
        <ColWrapper span={8} md={8} xs={24}>
          <ImgWrapper>
            <Withdraw />
          </ImgWrapper>
          <TitleH2>{intl.formatMessage({ defaultMessage: "Withdraw" })}</TitleH2>
          <DescText>
            {intl.formatMessage({ defaultMessage: "When the deployment period expires, you can claim your returns." })}
          </DescText>
        </ColWrapper>
      </Row>
    </div>
  );
});

export default injectIntl(WorkFlow);
