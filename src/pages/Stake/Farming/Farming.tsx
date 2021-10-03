/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { ArrowLeft, ChevronLeft } from "assets/images";
import useScrollTop from "hooks/useScrollTop";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router";
import { LinearGradientSubtract } from "styles";
import InfoCard from "./InfoCard";
import StakeAction from "./StakeAction";

const Wrapper = styled.div`
  max-width: 1048px;
  padding: 104px 15px 0;
  margin: 0 auto;
`;

const FarmingCard = styled.div`
  background: ${({ theme }) => theme.primary.lightBrown};
  border-radius: 24px;
  padding: 45px 53px;
  color: ${({ theme }) => theme.gray.normal85};
  font-weight: 500;
  font-size: 24px;
  line-height: 125%;
  display: flex;
  align-items: center;
  margin-bottom: 48px;
  position: relative;
  cursor: pointer;
  span {
    margin-left: 24px;
  }
`;

const CardGroup = styled.div`
  display: grid;
  gap: 24px;
  grid-auto-flow: column;
  grid-template-columns: 4fr 3fr;
  position: relative;
  @media screen and (max-width: 876px) {
    grid-auto-flow: row;
    grid-template-columns: auto;
  }
`;

const LinearGradientSubtractWrapper = styled(LinearGradientSubtract)`
  position: absolute;
  left: -140px;
  top: -40px;
`;

type TProps = WrappedComponentProps;

const Farming = memo<TProps>(({ intl }) => {
  useScrollTop();

  const { goBack } = useHistory();

  return (
    <Wrapper>
      <FarmingCard onClick={goBack}>
        <ChevronLeft />
        <span>{intl.formatMessage({ defaultMessage: "Farming WTF" })}</span>
      </FarmingCard>
      <CardGroup>
        <LinearGradientSubtractWrapper />
        <InfoCard />
        <StakeAction />
      </CardGroup>
    </Wrapper>
  );
});

export default injectIntl(Farming);
