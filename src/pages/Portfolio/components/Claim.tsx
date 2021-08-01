/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Union } from "assets/images";
// import Button from "components/Button/Button";
import Tooltip from "components/Tooltip/Tooltip";

type TProps = WrappedComponentProps;

const ClaimBlock = styled.div`
  min-width: 190px;
  height: 78px;
  background-color: ${({ theme }) => theme.primary.lightBrown};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.claim};
  padding-left: 24px;
  padding-top: 12px;
  color: ${({ theme }) => theme.primary.deep};
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

const Claim = memo<TProps>(({ intl }) => {
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
      <ClaimBlock css={{ marginRight: 16 }}>
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
            "@media screen and (max-width: 678px)": {
              fontSize: 12
            }
          }}
        >
          500000 WTF
        </div>
      </ClaimBlock>

      {/* <ClaimBlock css={{ paddingRight: 60 }}>
        <ClaimBlockName>
          <span css={{ marginRight: 4 }}>{intl.formatMessage({ defaultMessage: "Activation bonus" })}</span>
          <Tooltip
            overlay={
              <React.Fragment>
                <span>
                  {intl.formatMessage({
                    defaultMessage: "This reward is used as a reward for providing services to other users."
                  })}
                </span>
                <br />
                <span>-</span>
                <br />
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "Every time you click, you will help all users convert the reward pool tokens into portfolio assets."
                  })}
                </span>
              </React.Fragment>
            }
          >
            <Union />
          </Tooltip>
        </ClaimBlockName>
        <div
          css={{
            fontSize: 20,
            "@media screen and (max-width: 678px)": {
              fontSize: 12
            }
          }}
        >
          500000 WTF
        </div>

        <Button
          type="primary"
          css={{
            width: "auto",
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translate(50%,-50%)",
            "@media screen and (max-width: 678px)": {
              fontSize: 12,
              height: 32
            }
          }}
        >
          {intl.formatMessage({ defaultMessage: "Claim" })}
        </Button>
      </ClaimBlock> */}
    </div>
  );
});

export default injectIntl(Claim);
