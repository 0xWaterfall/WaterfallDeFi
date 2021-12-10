/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Stakings from "config/staking";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { StakingConfig } from "types";
import Increase from "./Increase";
import Stake from "./Stake";
import Unstake from "./Unstake";

const Wrapper = styled.div`
  width: 500px;
  padding: 24px 32px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.header)};
  box-shadow: ${({ theme }) => theme.useColorModeValue("0px 8px 40px 0px rgba(0, 108, 253, 0.1)", "none")};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  position: relative;
  z-index: 1;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
`;

const Segement = styled.div`
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  padding: 6px 8px;
  display: flex;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const Block = styled.div`
  padding: 6px 16px;
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  border-radius: 8px;
  cursor: pointer;
  &[data-actived="true"] {
    cursor: default;
    color: ${({ theme }) => theme.primary.deep};
    background: ${({ theme }) => theme.white.normal};
    box-shadow: 0px 0px 10px rgba(0, 102, 255, 0.1);
  }
`;

type TProps = WrappedComponentProps & {
  stakingConfig: StakingConfig;
};
const Action = memo<TProps>(({ intl, stakingConfig }) => {
  const [activedKey, setActivedKey] = useState("STAKE");
  const TABS = [
    { key: "STAKE", text: intl.formatMessage({ defaultMessage: "Stake" }) },
    { key: "UNSTAKE", text: intl.formatMessage({ defaultMessage: "Unstake" }) }
  ];
  return (
    <Wrapper>
      <Segement>
        {TABS.map((p) => (
          <Block
            key={p.key}
            data-actived={p.key === activedKey}
            onClick={() => {
              setActivedKey(p.key);
            }}
          >
            {p.text}
          </Block>
        ))}
      </Segement>
      {/* {activedKey === "STAKE" && <Stake />} */}
      {activedKey === "STAKE" && <Increase stakingConfig={stakingConfig} fromMasterChef={false} />}
      {activedKey === "UNSTAKE" && <Unstake stakingConfig={stakingConfig} />}
    </Wrapper>
  );
});

export default injectIntl(Action);
