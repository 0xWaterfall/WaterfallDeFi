/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Union } from "assets/images";
import Button from "components/Button/Button";
import Tooltip from "components/Tooltip/Tooltip";

type TProps = WrappedComponentProps;

const ClaimBlock = styled.div`
  min-width: 107px;
  height: 38px;
  background-color: white;
  border-radius: 8px;
  border: 2px solid rgba(0, 111, 255, 0.2);
  box-shadow: 0px 10px 20px rgba(15, 96, 227, 0.04);
  padding: 9px 24px;
  line-height: 1.5;
  position: relative;
  @media screen and (max-width: 678px) {
    height: 68px;
  }
  @media screen and (max-width: 512px) {
    margin-top: 12px;
  }
`;

const ClaimBlockName = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary.normal};
  margin-bottom: 4px;
`;

const DepositBlock = memo<TProps>(({ intl }) => {
  const { primary } = useTheme();

  return (
    <div
      css={{
        display: "flex",
        color: primary.deep,
        "@media screen and (max-width: 1148px)": {
          marginTop: 40
        },
        "@media screen and (max-width: 512px)": {
          flexDirection: "column",
          marginTop: 0
        }
      }}
    >
      <ClaimBlock>
        <div css={{ fontSize: 16 }}>Deposit</div>
      </ClaimBlock>
    </div>
  );
});

export default injectIntl(DepositBlock);
