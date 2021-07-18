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
    <div css={{ display: "flex", color: primary.deep }}>
      <ClaimBlock css={{ marginRight: 16 }}>
        <ClaimBlockName>
          <span css={{ marginRight: 4 }}>{intl.formatMessage({ defaultMessage: "Week Distribution" })}</span>
          <Tooltip
            overlay={intl.formatMessage({
              defaultMessage: "All position holders can get weekly WTF rewards. Distributed every 4 hours."
            })}
          >
            <Union />
          </Tooltip>
        </ClaimBlockName>
        <div css={{ fontSize: 20 }}>500000 WTF</div>
      </ClaimBlock>

      <ClaimBlock css={{ paddingRight: 60 }}>
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
        <div css={{ fontSize: 20 }}>500000 WTF</div>

        <Button
          type="primary"
          css={{ width: "auto", position: "absolute", top: 0, right: 0, transform: "translate(50%,50%)" }}
        >
          {intl.formatMessage({ defaultMessage: "Claim" })}
        </Button>
      </ClaimBlock>
    </div>
  );
});

export default injectIntl(Claim);
