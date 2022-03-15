/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { BUSD, WAVAX, WTFToken } from "assets/images";
import Button from "components/Button/Button";
import Tooltip from "components/Tooltip/Tooltip";
import { useMarkets, useNetwork, useWTFPrice } from "hooks/useSelectors";
import { formatAllocPoint, formatAPY, getJuniorAPY, getNetApr, getWTFApr } from "utils/formatNumbers";
import { useHistory } from "react-router";
import numeral from "numeral";
import { useWTFPriceLP } from "hooks/useWTFfromLP";
import { Carousel } from "antd";
import { Market } from "types";

const Wrapper = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.armyGreen)};
  padding: 77px 40px 46px;
  // display: grid;
  // gap: 24px;
  // grid-auto-flow: row;
  display: flex;
  flex-direction: column;
  position: relative;
  filter: drop-shadow(0px 4px 20px rgba(0, 108, 253, 0.04));
  min-width: 100%;
`;

const Block = styled.section`
  // display: grid;
  // grid-auto-flow: column;
  // grid-template-columns: 40% 60%;
  display: flex;
  margin-bottom: 20px;
  margin-right: 1px;
  font-size: 14px;
  background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.armyGreen)};
  border-radius: 12px;
  border: solid 1px transparent;
  background-image: ${({ theme }) =>
    theme.useColorModeValue(
      "linear-gradient(132.89deg, #fff, #fff), linear-gradient(93.83deg, #e8f7ff 26.54%, #bffeff 70.96%)",
      `linear-gradient(132.89deg,${theme.dark.armyGreen} , ${theme.dark.armyGreen}), linear-gradient(93.83deg, rgba(232, 247, 255, 0.2) 26.54%, rgba(191, 254, 255, 0.2) 70.96%)`
    )};
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0px 4px 8px 0px #00000005;
  overflow: hidden;
  div {
    display: flex;
    align-items: center;
  }
  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 18px;
  }
  > h1 {
    width: 40%;
  }
  > section {
    width: 60%;
  }
  p {
    font-weight: 600;
    font-size: 16px;
  }
  &:nth-of-type(1) {
    h1,
    p {
      color: ${({ theme }) => theme.tags.yellowText};
    }
  }
  &:nth-of-type(2) {
    h1,
    p {
      color: ${({ theme }) => theme.green.normal};
    }
  }
  :nth-of-type(3) {
    h1,
    p {
      color: ${({ theme }) => theme.primary.light};
    }
  }
`;

const Section = styled.section`
  height: 100%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  background: ${({ theme }) => theme.useColorModeValue(theme.background.apr, theme.dark.block)};
  padding: 19px 29px;
`;

const ButtonWrapper = styled(Button)`
  border-radius: 50px;
  position: absolute;
  left: 50%;
  bottom: 0;
  padding: 0 82px;
  height: 58px;
  font-size: 20px;
  font-weight: 500;
  transform: translate(-50%, 50%);
`;

const IconWrapper = styled.div`
  width: 88px;
  height: 88px;
  padding: 10px;
  border-radius: 50%;
  border: solid 4px transparent;
  background-image: linear-gradient(132.89deg, #fff, #fff),
    linear-gradient(180deg, #5946f8 0%, #2494dc 44.79%, #00cccb 100%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const APRWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  line-height: 18.2px;
`;

const Line = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.primary.deep};
  margin: 10px 0 14px;
  opacity: 0.1;
`;

const Fee = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 15.6px;
  font-size: 12px;
  u {
    text-decoration: none;
    border-bottom: 1px dashed ${({ theme }) => theme.useColorModeValue(theme.gray.normal3, theme.white.normal3)};
  }
`;
const CarouselContainer = styled(Carousel)`
  min-width: 100%;
  max-width: 100%;
  width: 100%;
  padding-bottom: 12px;
  // & > div {
  //   height: auto;
  //   margin-right: 1px !important;
  // }
  > .slick-dots li button {
    // width: 6px !important;
    // height: 6px !important;
    // border-radius: 100% !important;
    background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)} !important;
  }
  > .slick-dots li.slick-active button {
    // width: 7px !important;
    // height: 7px !important;
    // border-radius: 100% !important;
    background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)} !important;
  }
`;
const Title = styled.div`
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.gray.normal08};
  font-size: 24px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  font-weight: 500;
`;
type TProps = WrappedComponentProps;

const TrancheCard = memo<TProps>(({ intl }) => {
  const network = useNetwork();
  const markets = useMarkets();
  // const wtfPrice = useWTFPrice();
  const { price: wtfPrice } = useWTFPriceLP();

  const { push } = useHistory();
  const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];
  return (
    <Wrapper>
      <IconWrapper>{network === "avax" ? <WAVAX /> : <BUSD />}</IconWrapper>
      <CarouselContainer dotPosition="bottom" autoplay={true}>
        {markets.map((_market: Market, index) => {
          if (network === "avax" && !_market.isAvax) return null;
          if (network !== "avax" && _market.isAvax) return null;
          if (!_market.isRetired)
            return (
              <div key={index}>
                <Title>{_market.portfolio}</Title>
                {tranchesDisplayText.map((trancheText, _i) => {
                  const trancheApr = _market && _market.tranches ? _market.tranches[_i].apy : "-";
                  const wtfApr = _market
                    ? getWTFApr(
                        formatAllocPoint(_market?.pools[_i], _market?.totalAllocPoints),
                        _market?.tranches[_i],
                        _market?.duration,
                        _market?.rewardPerBlock,
                        wtfPrice
                      )
                    : "-";

                  const netApr =
                    trancheApr && wtfApr && wtfApr !== null
                      ? Number(trancheApr) + Number(numeral(wtfApr).value())
                      : // ? Number(numeral(trancheApr).value()) + Number(numeral(wtfApr).value())
                        "-";

                  return (
                    <Block key={trancheText}>
                      <h1>{trancheText}</h1>
                      <Section>
                        <APRWrapper>
                          <span>{intl.formatMessage({ defaultMessage: "Total APR" })}: </span>
                          <p>
                            {numeral(netApr).format("0,0.[00]")}
                            {" %"}
                          </p>
                        </APRWrapper>
                        <APRWrapper>
                          <span>
                            {_i !== 2 ? "Fixed " : "Variable "}
                            {/* {trancheText} */}
                            {intl.formatMessage({ defaultMessage: "APR" })}:{" "}
                          </span>
                          <span>
                            {trancheApr}
                            {" %"}
                          </span>
                        </APRWrapper>
                        <APRWrapper>
                          <span>{intl.formatMessage({ defaultMessage: "WTF APR" })}: </span>
                          <span>
                            {wtfApr}
                            {" %"}
                          </span>
                        </APRWrapper>
                        <Line />
                        <Fee>
                          <Tooltip
                            overlay={
                              <React.Fragment>
                                <p>
                                  {intl.formatMessage({
                                    defaultMessage: `After maturity, you can choose to withdraw all the principal + Yield. The platform will charge a fee of (principal + all yield in the current period) x `
                                  })}
                                  {_market?.tranches[_i].fee} %
                                </p>
                              </React.Fragment>
                            }
                          >
                            <u>{intl.formatMessage({ defaultMessage: "Withdraw Fee" })}:</u>
                          </Tooltip>
                          <span>{_market?.tranches[_i].fee} %</span>
                        </Fee>
                      </Section>
                    </Block>
                  );
                })}
              </div>
            );
        })}
      </CarouselContainer>

      <ButtonWrapper
        type="primary"
        onClick={() => {
          push("/portfolio/markets");
        }}
      >
        {intl.formatMessage({ defaultMessage: "Start" })}
      </ButtonWrapper>
    </Wrapper>
  );
});

export default injectIntl(TrancheCard);
