/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Stakings from "config/staking";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import StakeCard from "./StakeCard";

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 48px;
`;

const Label = styled.div`
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.primary.deep1};
  font-size: 20px;
  line-height: 125%;
  color: ${({ theme }) => theme.gray.normal7};
`;

const CardGroup = styled.div`
  display: grid;
  column-gap: 35px;
  row-gap: 24px;
  grid-template-areas: "a b c";
  position: relative;
  @media screen and (max-width: 876px) {
    grid-template-areas: "a b";
  }

  @media screen and (max-width: 512px) {
    grid-template-areas: "a";
  }
`;

type TProps = WrappedComponentProps;

const StakeContainer = memo<TProps>(({ intl }) => {
  const { push } = useHistory();

  return (
    <Wrapper>
      <Label>{intl.formatMessage({ defaultMessage: "Staking WTF get double reward" })}</Label>
      <CardGroup>
        {Stakings.map((s, idx) => (
          <div
            key={idx}
            onClick={() => {
              push({ pathname: `/stake/staking/${idx}` });
            }}
          >
            <StakeCard data={s} />
          </div>
        ))}
      </CardGroup>
    </Wrapper>
  );
});

export default injectIntl(StakeContainer);
