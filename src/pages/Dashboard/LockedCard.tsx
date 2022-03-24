/** @jsxImportSource @emotion/react */

import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { useTotalTvl } from "hooks";

const Wrapper = styled.div`
  height: 143px;
  border-radius: 24px;
  padding: 26px 0;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.light)};
  position: relative;
  transform: translateY(-56px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(90deg, #4ac9ff 0%, #167bff 98.68%);
  background-clip: text;
  color: transparent;
`;

const Value = styled.div`
  height: 60px;
  padding: 0 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary.deepBrown};
  font-size: 32px;
  font-weight: 600;
  border-radius: 16px;
  border: solid 1px transparent;
  background-image: linear-gradient(132.89deg, #fff, #fff), linear-gradient(90deg, #4ac9ff 0%, #167bff 98.68%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0px 4px 10px 0px #187eff33;
  white-space: nowrap;
  min-width: 300px;
  @media screen and (max-width: 414px) {
    font-size: 28px;
    transform: scale(0.8);
  }
`;

type TProps = WrappedComponentProps;

const LockedCard = memo<TProps>(({ intl }) => {
  const totalTvl = useTotalTvl();
  return (
    <Wrapper>
      <Text>{intl.formatMessage({ defaultMessage: "Total Value Locked" })}</Text>
      <Value>${totalTvl}</Value>
    </Wrapper>
  );
});

export default injectIntl(LockedCard);
