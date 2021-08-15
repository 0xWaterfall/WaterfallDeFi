/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { Deposit, Wait, Withdraw, ArrowLine } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { Row, Col, Layout } from "antd";

type TProps = WrappedComponentProps;
const TitleH2 = styled.h2`
  font-size: 16px;
  line-height: 25px;
  text-align: center;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.gray.normal};
`;
const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  & > svg {
    height: 74px;
    width: 74px;
  }
`;
const DescText = styled.p`
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.Nunito};
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
const WorkFlow = memo<TProps>(({ intl }) => {
  const { fonts, gray } = useTheme();

  return (
    <div css={{ marginTop: 50, position: "relative" }}>
      <RowWrapper />
      <Row>
        <Col span={8} md={8} xs={24} sm={24}>
          <ImgWrapper>
            <Deposit />
          </ImgWrapper>
          <TitleH2>{intl.formatMessage({ defaultMessage: "Deposit" })}</TitleH2>
          <DescText>
            {intl.formatMessage({ defaultMessage: "Choose the tranche that suits you and get started!" })}
          </DescText>
          <ArrowWrapper>
            <ArrowLine />
          </ArrowWrapper>
        </Col>
        <Col span={8} md={8} xs={24} sm={24}>
          <ImgWrapper>
            <Wait />
          </ImgWrapper>
          <TitleH2>{intl.formatMessage({ defaultMessage: "Wait" })}</TitleH2>
          <DescText>
            {intl.formatMessage({
              defaultMessage: "When all the tranche is full, the waterfall will start to set off."
            })}
          </DescText>
          <ArrowWrapper>
            <ArrowLine />
          </ArrowWrapper>
        </Col>
        <Col span={8} md={8} xs={24} sm={24}>
          <ImgWrapper>
            <Withdraw />
          </ImgWrapper>
          <TitleH2>{intl.formatMessage({ defaultMessage: "Withdraw" })}</TitleH2>
          <DescText>
            {intl.formatMessage({ defaultMessage: "When the period expires, you can get all your funds back." })}
          </DescText>
        </Col>
      </Row>
    </div>
  );
});

export default injectIntl(WorkFlow);
