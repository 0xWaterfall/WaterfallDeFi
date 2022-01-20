/** @jsxImportSource @emotion/react */

import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { Sticker, WTFCoin, Pancake, ArrowRight, ComingSoonTopBg, ComingSoonRightBg } from "assets/images";
import Button from "components/Button/Button";

const Wrapper = styled.div`
  padding-top: 160px;
  max-width: 800px;
  padding: 160px 18px 0;
  margin: 0 auto;
`;

const CardWrapper = styled.div`
  max-width: 800px;
  padding: 68px 0 83px;
  position: relative;
  border-radius: 21px;
  border: solid 2.25px transparent;
  background-image: linear-gradient(180deg, #fff, #fff),
    linear-gradient(180deg, rgba(87, 101, 230, 0.2) 0%, rgba(87, 101, 230, 0) 85.02%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
`;

const LinearGradientWrapper = styled.div`
  width: 1301px;
  height: 382px;
  background: linear-gradient(
    90deg,
    rgba(252, 182, 4, 0.3) 14.14%,
    rgba(3, 161, 75, 0.3) 45.76%,
    rgba(12, 108, 254, 0.3) 84.73%
  );
  filter: blur(200px);
  transform: matrix(-1, 0, 0, 1, 0, 0);
  position: absolute;
  bottom: 81px;
  left: -336px;
`;

const IndexWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  max-width: 551px;
  font-size: 64px;
  line-height: 83px;
  background: linear-gradient(90deg, #aeafff 1.37%, #197fff 54.32%, #92f9ff 105.12%);
  background-clip: text;
  color: transparent;
  font-weight: bold;
  text-align: center;
`;

const PancakeDirection = styled.div`
  display: flex;
  margin: 37px 0 32px;
  align-items: center;
  color: ${({ theme }) => theme.gray.normal};
`;

const Description = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.gray.normal85};
  max-width: 360px;
  text-align: center;
  margin-bottom: 64px;
`;

const ButtonWrapper = styled(Button)`
  border-radius: 12px;
  height: 54px;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  padding: 0 21px;
  color: ${({ theme }) => theme.white.normal};
  path {
    fill: ${({ theme }) => theme.white.normal};
  }
  &[dataType="primary"] {
    background: linear-gradient(90deg, #4ac9ff 0%, #167bff 98.68%);
    box-shadow: 0px 8px 20px rgba(0, 108, 253, 0.3);
  }
`;

const StickerWrapper = styled(Sticker)`
  position: absolute;
  bottom: 0;
  left: -106px;
  @media screen and (max-width: 876px) {
    display: none;
  }
`;

const ComingSoonTopBgWrapper = styled(ComingSoonTopBg)`
  position: absolute;
  top: -160px;
  left: -8px;
  transform: translateX(-100%);
  z-index: 1;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const ComingSoonRightBgWrapper = styled(ComingSoonRightBg)`
  position: absolute;
  top: 365px;
  right: -35px;
  transform: translateX(100%);
  z-index: 2;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

type TProps = WrappedComponentProps;

const CommingSoon = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <CardWrapper>
        <LinearGradientWrapper />
        <StickerWrapper />
        <ComingSoonTopBgWrapper />
        <ComingSoonRightBgWrapper />
        <IndexWrapper>
          <Title>{intl.formatMessage({ defaultMessage: "WTF farm will be opened soon!" })}</Title>
          <PancakeDirection>
            <WTFCoin css={{ marginRight: 34 }} />
            <ArrowRight css={{ marginRight: 16 }} />
            <Pancake css={{ marginRight: 4 }} />
            <span>pancakeswap</span>
          </PancakeDirection>
          <Description>
            {intl.formatMessage({ defaultMessage: "Please try to put WTF on pancakeswap to earn liquidity income!" })}
          </Description>
          <ButtonWrapper
            type="primary"
            // href="https://pancakeswap.finance/add/0x2fA0cac2c75Efb50382B5091C6494194eAcF65B0/BNB"
            href="https://pancakeswap.finance/add/0xd73f32833b6d5d9c8070c23e599e283a3039823c/BNB"
            target="_blank"
          >
            {/* <Pancake css={{ marginRight: 4 }} /> */}

            {/* <span css={{ marginRight: 6 }}>pancakeswap</span>
            <ArrowRight /> */}
            <div
              style={{
                backgroundImage: `url(/coins/PANCAKE.png)`,
                width: "150px",
                height: "60px",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"
              }}
            />
          </ButtonWrapper>
        </IndexWrapper>
      </CardWrapper>
    </Wrapper>
  );
});

export default injectIntl(CommingSoon);
