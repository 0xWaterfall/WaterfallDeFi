/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import theme from "styles/theme";
import { Sticker, WTFCoin, Pancake, ArrowRight, WTFCoinBG1, WTFBG } from "assets/images";
// import WTFCoinBG2 from "assets/images/wtfcoinbg2.png";
import WTFCoinBG2 from "./../../assets/images/wtfcoinbg2.png";
import { useSize } from "ahooks";

const Wrapper = styled.div`
  max-width: 1048px;
  padding: 180px 15px 144px;
  margin: 0 auto;
  @media screen and (max-width: 876px) {
    padding-top: 100px;
  }
`;
const StickerWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: -115px;
`;
const BGWrapper1 = styled.div`
  position: absolute;
  top: -160px;
  left: -180px;
`;
const BGWrapper2 = styled.div`
  position: absolute;
  bottom: 100px;
  right: -300px;
`;
const BGWrapper3 = styled.div`
  position: absolute;
  width: 100%;
  height: 400px;
  left: 0;
  top: 100px;
  z-index: -1;
  & > svg {
    width: 100%;
  }
`;
const InfoWrapper = styled.div`
  border-radius: 20px;
  width: 762px;
  height: 614px;
  margin: auto;
  text-align: center;
  background: linear-gradient(180deg, #dde0fa 0%, rgb(255, 255, 255) 86.64%);
  padding: 5px;
  position: relative;

  max-width: 90vw;

  & > div:nth-of-type(1) {
    border-radius: 15px;
    background: ${({ theme }) => theme.white.normal};
    padding: 20px;
    height: 100%;
    width: 100%;
    max-width: 90vw;

    @media screen and (max-width: 768px) {
      padding-top: 100px;
    }
  }
  & > div:nth-of-type(1) > div:nth-of-type(1) {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    & > svg {
      margin: 0 10px;
    }
  }
  & > div:nth-of-type(1) > div:nth-of-type(2) {
    font-family: IBM Plex Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2px;
    margin-bottom: 40px;
    color: ${({ theme }) => theme.gray.normal85};
  }
  & > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) {
    width: 191px;
    height: 54px;
    background: linear-gradient(90deg, #4ac9ff 0%, #167bff 98.68%);
    box-shadow: 0px 8px 20px rgba(0, 108, 253, 0.3);
    border-radius: 12px;
    margin: auto;
    color: ${({ theme }) => theme.white.normal};
    cursor: pointer;
    line-height: 54px;
    font-family: IBM Plex Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    & > svg {
      margin-right: 5px;
      margin-left: 5px;
    }
  }

  & h1 {
    font-family: IBM Plex Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 64px;
    line-height: 83px;
    letter-spacing: 0.2px;

    background: -webkit-linear-gradient(90deg, #aeafff 1.37%, #197fff 54.32%, #92f9ff 105.12%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

type TProps = WrappedComponentProps;

const Staking = memo<TProps>(({ intl }) => {
  const { width } = useSize(document.body);
  return (
    <>
      <Wrapper>
        <InfoWrapper>
          <div>
            <h1>{intl.formatMessage({ defaultMessage: "WTF farm will be opened soon!" })}</h1>
            <div>
              <WTFCoin />
              <ArrowRight />
              <Pancake />
            </div>
            <div>
              {intl.formatMessage({ defaultMessage: "Please try to put WTF on pancakeswap to earn liquidity income!" })}
            </div>
            <div>
              <div>
                <Pancake /> pancakeswap <ArrowRight />
              </div>
            </div>
          </div>
          {Boolean(width && width > 768) && (
            <>
              <StickerWrapper>
                <Sticker />
              </StickerWrapper>
              <BGWrapper1>
                <WTFCoinBG1 />
              </BGWrapper1>
              <BGWrapper2>
                {/* <WTFCoinBG2 /> */}
                <div style={{ backgroundImage: `url(${WTFCoinBG2})`, width: 335, height: 335 }}></div>
              </BGWrapper2>
            </>
          )}
        </InfoWrapper>
        <BGWrapper3>
          <WTFBG />
        </BGWrapper3>
      </Wrapper>
    </>
  );
});

export default injectIntl(Staking);
