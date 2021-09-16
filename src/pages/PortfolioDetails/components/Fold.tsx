/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Tooltip from "components/Tooltip/Tooltip";
import Button from "components/Button/Button";
import { Union } from "assets/images";
import styled from "@emotion/styled";

type TProps = WrappedComponentProps;

const Wrapper = styled.div`
  padding: 24px 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  z-index: 1;
  background-color: ${({ theme }) => theme.primary.lightBrown};
  border-radius: 12px;
  padding: 20px;
`;

const WithdrawDiv = styled.div`
  padding: 16px 19px;
  margin-right: 27;
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.white.normal};
  width: 100%;
  margin-bottom: 20px;
`;

const RewardDiv = styled.div`
  padding: 16px 19px;
  width: 100%;
  margin-right: 23px;
  background-color: ${({ theme }) => theme.white.normal};
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NoteDiv = styled.div`
  display: flex;
  padding: 16px 19px;
  background-color: ${({ theme }) => theme.white.normal};
  border-radius: 8px;
`;

const Fold = memo<TProps>(({ intl }) => {
  const { gray, primary } = useTheme();

  return (
    <Wrapper>
      <WithdrawDiv>
        <div css={{ display: "flex", alignItems: "center" }}>
          <span css={{ marginRight: 5, color: gray.normal7, fontSize: 12 }}>
            {intl.formatMessage({ defaultMessage: "Max withdrawal principal+Interest" })}
          </span>
          <Tooltip
            overlay={
              <React.Fragment>
                <p>{intl.formatMessage({ defaultMessage: "When you can withdraw:" })}</p>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      '1. Before the cycle deploys, the principal can be withdrawn while the portfolio is in the "Pending" stage'
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      '2. After the deployment is completed, the principal + interest can be withdrawn while the portfolio is in the "Mature" stage'
                  })}
                </p>
              </React.Fragment>
            }
          >
            <Union css={{ color: gray.normal3 }} />
          </Tooltip>
        </div>
        <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>10,000,010 BUSD</div>
        <div css={{ display: "flex" }}>
          <Button
            css={{ marginRight: 10, fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
            type="primary"
          >
            {intl.formatMessage({ defaultMessage: "Withdraw all" })}
          </Button>
          <Button css={{ fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }} type="primary">
            {intl.formatMessage({ defaultMessage: "Re-deposit" })}
          </Button>
        </div>
      </WithdrawDiv>
      <RewardDiv>
        <div css={{ display: "flex", alignItems: "center" }}>
          <span css={{ marginRight: 5, color: gray.normal7, fontSize: 12 }}>
            {intl.formatMessage({ defaultMessage: "WTF Reward" })}
          </span>
        </div>
        <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>- WTF</div>
        <div css={{ display: "flex" }}>
          <Button
            css={{ marginRight: 10, fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
            type="primary"
          >
            {intl.formatMessage({ defaultMessage: "Claim" })}
          </Button>
        </div>
      </RewardDiv>
      <NoteDiv>
        <div css={{ marginRight: 4 }}>
          <Union css={{ color: primary.deep, transform: "translateY(2px)" }} />
        </div>
        <div css={{ color: gray.normal7, fontSize: 12 }}>
          {intl.formatMessage({
            defaultMessage: `Upon maturity, you can choose to withdraw all the principal + interest. Alternatively you can choose to deposit to the next cycle - and choose the amount of re-deposit and tranche you re-deposit to.`
          })}
        </div>
      </NoteDiv>
    </Wrapper>
  );
});

export default injectIntl(Fold);
