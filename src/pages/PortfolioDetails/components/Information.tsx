/** @jsxImportSource @emotion/react */

import { ArrowLeft } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import styled from "@emotion/styled";
import { Market } from "types";
import { formatDisplayTVL, getLockupPeriod } from "utils/formatNumbers";

const Wrapper = styled.div`
  display: flex;
  padding-top: 37px;
  /* & > div {
    padding: 0px 20px;
  } */
  /* & span {
    font-size: 14px;
    line-height: 19px;
    color: ${({ theme }) => theme.gray.normal7};
  } */
  /* @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    & > div {
      padding: 10px 0;
    }
  } */
`;
const Arrow = styled(ArrowLeft)`
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal85)};
  & :hover {
    color: ${({ theme }) => theme.useColorModeValue(theme.primary.deep, theme.white.normal5)};
  }
  margin-top: 4px;
  margin-right: 20px;
  cursor: pointer;
`;

const InformationWrapper = styled.div`
  display: grid;
  gap: 40px;
  grid-auto-flow: column;
  @media screen and (max-width: 768px) {
    grid-auto-flow: row;
  }
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  span:last-child {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  }
  :last-child {
    span:last-child {
      font-size: 16px;
      color: ${({ theme }) => theme.primary.deep};
    }
  }
`;

const PortfolioName = styled.span`
  font-size: 24px;
  height: 30px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
`;

const Assets = styled.span`
  font-size: 20px;
  height: 30px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
`;

type TProps = WrappedComponentProps & {
  data: Market;
};

const Information = memo<TProps>(({ data }) => {
  const { push } = useHistory();

  return (
    <Wrapper>
      <Arrow onClick={() => push({ pathname: "/portfolio/markets" })} />
      <InformationWrapper>
        <Block>
          <PortfolioName>{data?.portfolio}</PortfolioName>
          <span>Listing date: {data?.listingDate}</span>
        </Block>
        <Block>
          <Assets>{data?.assets}</Assets>
          <span>Lock-up period: {data?.duration ? getLockupPeriod(data?.duration) : "-"}</span>
        </Block>
        <Block>
          <div />
          <span>
            TVL: {data?.tvl} {data?.assets}
          </span>
        </Block>
      </InformationWrapper>
    </Wrapper>
  );
});

export default injectIntl(Information);
