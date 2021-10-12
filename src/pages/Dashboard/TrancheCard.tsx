/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { BUSD, WTFToken } from "assets/images";
import Button from "components/Button/Button";
import Tooltip from "components/Tooltip/Tooltip";
import { useMarkets, useWTFPrice } from "hooks/useSelectors";
import { formatAllocPoint, formatAPY, getJuniorAPY, getNetApr, getWTFApr } from "utils/formatNumbers";
import { useHistory } from "react-router";
import numeral from "numeral";
import { useWTFPriceLP } from "hooks/useWTFfromLP";

const Wrapper = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.armyGreen)};
  padding: 77px 40px 46px;
  display: grid;
  gap: 24px;
  grid-auto-flow: row;
  position: relative;
  filter: drop-shadow(0px 4px 20px rgba(0, 108, 253, 0.04));
`;

const Block = styled.section`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 40% 60%;
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

type TProps = WrappedComponentProps;

const TrancheCard = memo<TProps>(({ intl }) => {
  const markets = useMarkets();
  // const wtfPrice = useWTFPrice();
  const { price: wtfPrice } = useWTFPriceLP();
  const currentMarket = markets[0];
  const { push } = useHistory();
  const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];

  return (
    <Wrapper>
      <IconWrapper>
        <BUSD />
      </IconWrapper>
      {tranchesDisplayText.map((trancheText, _i) => {
        const trancheApr = currentMarket && currentMarket.tranches ? currentMarket.tranches[_i].apy : "-";
        const wtfApr = currentMarket
          ? getWTFApr(
              formatAllocPoint(currentMarket?.pools[_i], currentMarket?.totalAllocPoints),
              currentMarket?.tranches[_i],
              currentMarket?.duration,
              currentMarket?.rewardPerBlock,
              wtfPrice
            )
          : "-";

        const netApr =
          trancheApr && wtfApr && wtfApr !== null ? Number(trancheApr) + Number(numeral(wtfApr).value()) : "-";

        return (
          <Block key={trancheText}>
            <h1>{trancheText}</h1>
            <Section>
              <APRWrapper>
                <span>{intl.formatMessage({ defaultMessage: "Total APR" })}: </span>
                <p>
                  {netApr}
                  {" %"}
                </p>
              </APRWrapper>
              <APRWrapper>
                <span>
                  {trancheText} {intl.formatMessage({ defaultMessage: "APR" })}:{" "}
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
                        {currentMarket?.tranches[_i].fee} %
                      </p>
                    </React.Fragment>
                  }
                >
                  <u>{intl.formatMessage({ defaultMessage: "Withdraw Fee" })}:</u>
                </Tooltip>
                <span>{currentMarket?.tranches[_i].fee} %</span>
              </Fee>
            </Section>
          </Block>
        );
      })}
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
