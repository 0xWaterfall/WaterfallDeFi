/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Union } from "assets/images";
// import Button from "components/Button/Button";
import Tooltip from "components/Tooltip/Tooltip";

type TProps = WrappedComponentProps;

const ClaimBlockName = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary.normal};
  margin-bottom: 8px;
`;

const Claim = memo<TProps>(({ intl }) => {
  const { primary, fonts, white } = useTheme();

  return (
    <div
      css={{
        color: primary.deep,
        padding: "18px 22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `2px solid ${primary.deep2}`,
        borderRadius: 8,
        transform: "translateY(-40px)",
        position: "relative",
        zIndex: 1,
        backgroundColor: white.normal,
        maxWidth: 210
      }}
    >
      <ClaimBlockName>
        <span css={{ marginRight: 4 }}>{intl.formatMessage({ defaultMessage: "Week Distribution" })}</span>
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
              </p>
            </React.Fragment>
          }
        >
          <Union />
        </Tooltip>
      </ClaimBlockName>
      <div
        css={{
          fontSize: 20,
          fontFamily: fonts.CarterOne,
          "@media screen and (max-width: 678px)": {
            fontSize: 12
          }
        }}
      >
        500,000 WTF
      </div>
    </div>
  );
});

export default injectIntl(Claim);
