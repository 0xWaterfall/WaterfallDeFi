/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Union } from "assets/images";
// import Button from "components/Button/Button";
import Tooltip from "components/Tooltip/Tooltip";
import { useWTF } from "hooks";
import { formatNumberSeparator } from "utils/formatNumbers";

type TProps = WrappedComponentProps;

const AirdropBlockName = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  margin-bottom: 8px;
`;

const Label = styled.span`
  margin-right: 4px;
  font-size: 12px;
`;

const Airdrop = memo<TProps>(({ intl }) => {
  const { primary, fonts, white, useColorModeValue, dark } = useTheme();
  // const { weekDistribution } = useWTF();
  return (
    <div
      css={{
        color: primary.deep,
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `2px solid ${primary.deep2}`,
        borderRadius: 8,
        position: "relative",
        zIndex: 1,
        backgroundColor: useColorModeValue(white.normal, dark.block)
      }}
    >
      <AirdropBlockName>
        <Label>{intl.formatMessage({ defaultMessage: "Airdrop bonus for early deposit" })}</Label>
        <Tooltip
          overlay={
            <React.Fragment>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "In each cycle, users who deposit funds in the first 12 hours will be allocated 100,000 WTF in proportion to the size of the principal."
                })}
              </p>
            </React.Fragment>
          }
        >
          <Union />
        </Tooltip>
      </AirdropBlockName>
      <div
        css={{
          fontSize: 20,
          fontWeight: 600,
          "@media screen and (max-width: 678px)": {
            fontSize: 12
          }
        }}
      >
        100,000 WTF
      </div>
    </div>
  );
});

export default injectIntl(Airdrop);
