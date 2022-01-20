/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Coin from "components/Coin";
import numeral from "numeral";
import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router";
import { LinearGradientSubtract } from "styles";
import { useFarms } from "./hooks/useFarms";

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 48px;
  max-width: 1072px;
  padding: 86px 24px 160px;
  margin: 0 auto;
`;

const Label = styled.div`
  padding-bottom: 10px;
  // border-bottom: 1px solid ${({ theme }) => theme.useColorModeValue(theme.primary.deep1, theme.white.normal1)};
  font-size: 20px;
  line-height: 125%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
`;

const Label2 = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.useColorModeValue(theme.primary.deep1, theme.white.normal1)};
  font-size: 16px;
  line-height: 125%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
`;

const CardGroup = styled.div`
  display: grid;
  column-gap: 35px;
  row-gap: 24px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "a b c";
  position: relative;
  @media screen and (max-width: 876px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "a b";
  }

  @media screen and (max-width: 512px) {
    grid-template-columns: auto;
    grid-template-areas: "a";
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.block5)};
  border-radius: 24px;
  padding: 19px 16px 22px;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  cursor: pointer;
  transition: transform 0.5s;
  :hover {
    transform: translateY(-10px);
  }
`;

const LinearGradientSubtractWrapper = styled(LinearGradientSubtract)`
  position: absolute;
  top: 0;
  left: -140px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  span {
    margin-right: 10px;
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
    color: ${({ theme }) => theme.background.iconfont};
  }
`;

const IconGroup = styled.div`
  display: flex;
  & > div {
    width: 44px;
    height: 44px;
    background: ${({ theme }) => theme.white.normal};
    background-size: contain;
    border-radius: 50%;
    padding: 11px;
  }
  & > div:nth-of-type(2) {
    transform: translateX(-11px);
  }
`;

const LabelLP = styled.div`
  font-size: 20px;
  line-height: 125%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal08)};
`;

const DataWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  div {
    display: grid;
    gap: 8px;
    grid-auto-flow: row;
    p {
      font-size: 12px;
      line-height: 125%;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
    }
    span {
      font-size: 16px;
      line-height: 125%;
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
      font-weight: bold;
    }
  }
`;

type TProps = WrappedComponentProps;

const FarmContainer = memo<TProps>(({ intl }) => {
  const { push } = useHistory();
  const farms = useFarms();
  return (
    <Wrapper>
      <Label>{intl.formatMessage({ defaultMessage: "Waterfall Liquidity Mining" })}</Label>
      <Label2>
        {intl.formatMessage({ defaultMessage: "Provide Liquidity for $WTF pairs and earn $WTF rewards!" })}
      </Label2>
      <CardGroup>
        <LinearGradientSubtractWrapper />
        {farms.map((_farm, idx) => (
          <Card
            key={idx}
            onClick={() => {
              push({ pathname: `/farm/${idx}` });
            }}
          >
            <IconWrapper>
              <IconGroup>
                <Coin assetName={_farm.logo1} size={44} />
                <Coin assetName={_farm.logo2} size={44} />
              </IconGroup>
              <span>WTF</span>
            </IconWrapper>
            <LabelLP>{_farm.name}</LabelLP>
            <DataWrapper>
              <div>
                <p>{intl.formatMessage({ defaultMessage: "Total Stake" })}</p>
                <span>{numeral(_farm.totalStaked).format("0,0.[0000]")}</span>
              </div>
              <div>
                <p>{intl.formatMessage({ defaultMessage: "APR" })}</p>
                <span>{_farm.maxAPR}%</span>
              </div>
              <div>
                <p>{intl.formatMessage({ defaultMessage: "Your stake" })}</p>
                <span>{numeral(_farm.userStakedLP).format("0,0.[0000]")}</span>
              </div>
            </DataWrapper>
          </Card>
        ))}
      </CardGroup>
    </Wrapper>
  );
});

export default injectIntl(FarmContainer);
