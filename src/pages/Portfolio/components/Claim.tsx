/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Union } from "assets/images";
// import Button from "components/Button/Button";
import Tooltip from "components/Tooltip/Tooltip";
import { useWeeklyReward, useWTF } from "hooks";
import { formatNumberSeparator } from "utils/formatNumbers";
import numeral from "numeral";

type TProps = WrappedComponentProps;

const ClaimBlockName = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  margin-bottom: 12px;
`;
const Label = styled.span`
  margin-right: 4px;
  font-size: 12px;
`;

const Claim = memo<TProps>(({ intl }) => {
  const { primary, fonts, white, useColorModeValue, dark } = useTheme();
  const { weekDistribution } = useWTF();
  const isHide = weekDistribution.toString() === "0" ? "hidden" : "visible";
  const weeklyReward = useWeeklyReward();
  console.log("weeklyReward", weeklyReward);
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
        zIndex: 1, // visibility: `${isHide}`,
        backgroundColor: useColorModeValue(white.normal, dark.block)
      }}
    >
      <ClaimBlockName>
        <Label css={{ marginRight: 4 }}>
          {intl.formatMessage({ defaultMessage: "Weekly rewards for AVAX coming soon!" })}
        </Label>
        <Tooltip
          overlay={
            <React.Fragment>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "All position holders can get different proportions of rewards according to different tranche."
                })}
              </p>
              <br />
              <p>
                {intl.formatMessage({
                  defaultMessage: "Details will be revealed soon."
                })}
              </p>
              {/* <p>
                {intl.formatMessage({
                  defaultMessage: "• Senior: 25% of total WTF"
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage: "• Mezzanine: 35% of total WTF"
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage: "• Junior: 40% of total WTF"
                })}
              </p> */}
            </React.Fragment>
          }
        >
          <Union />
        </Tooltip>
      </ClaimBlockName>
      <div
        css={{
          fontSize: 20,
          fontWeight: 600,
          textAlign: "center",
          "@media screen and (max-width: 678px)": {
            fontSize: 12
          }
        }}
      >
        {/* 👀 */}
        {weeklyReward !== "0" ? numeral(weeklyReward).format("0,0.[0]") : ""}

        {/*  {formatNumberSeparator(weekDistribution.toString())} WTF */}
      </div>
    </div>
  );
});

export default injectIntl(Claim);
