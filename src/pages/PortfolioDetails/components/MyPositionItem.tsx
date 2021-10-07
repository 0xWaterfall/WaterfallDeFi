/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { CaretDown } from "assets/images";
import Tag from "components/Tag/Tag";
import Tooltip from "components/Tooltip/Tooltip";
import { Union } from "assets/images";
import { Market, PORTFOLIO_STATUS, TrancheCycle } from "types";
import { formatAllocPoint, formatAPY, formatNumberDisplay, formatTimestamp, getJuniorAPY } from "utils/formatNumbers";
import { useTheme } from "@emotion/react";
import Button from "components/Button/Button";
import BigNumber from "bignumber.js";
type TProps = WrappedComponentProps & {
  market?: Market;
  position?: any;
  positionIdx: number;
  tranchesPendingReward?: string;
  interest?: string | undefined;
  principalAndInterest?: string | undefined;
  redeemLoading?: boolean;
  redeemDirect: (i: number) => Promise<void>;
  isCurrentPosition: boolean;
  _userInvest?: any;
  _trancheCycle?: TrancheCycle;
};

const Container = styled.div`
  background: ${({ theme }) => theme.white.normal};
  border: 1px solid ${({ theme }) => theme.primary.lightBrown};
  box-sizing: border-box;
  box-shadow: 0px 0px 10px ${({ theme }) => theme.shadow.marketItem};
  border-radius: 12px;
  padding: 20px 0px 40px 0px;
  margin-bottom: 20px;
`;
const RowDiv = styled.div`
  padding: 5px 20px;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.gray.normal7};
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  & > div:nth-of-type(2) {
    font-size: 14px;
    line-height: 19px;
    text-align: right;
    color: ${({ theme }) => theme.gray.normal85};
  }
  & > div > svg {
    // margin-left: 10 px;
    // width: 13px;
    // height: 13px;
  }
`;
const CaretDiv = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.primary.deep2};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const Text2 = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ color }) => color};
  margin: 10px 0;
`;

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

const MyPositionItem = memo<TProps>(
  ({
    intl,
    market,
    position,
    positionIdx,
    interest,
    principalAndInterest,
    tranchesPendingReward,
    redeemLoading,
    redeemDirect,
    isCurrentPosition,
    _trancheCycle,
    _userInvest
  }) => {
    const { tags, primary, gray } = useTheme();
    const [isFold, setFold] = useState(true);
    const tranchesDisplayText = ["Senior", "Mezzanine", "Junior"];
    const tranchesDisplayTextColor = [tags.yellowText, tags.greenText, primary.deep];

    return (
      <Container>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Portfolio Name" })}</div>
          <div>{market?.portfolio}</div>
        </RowDiv>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Asset" })}</div>
          <div>{market?.assets}</div>
        </RowDiv>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Cycle" })}</div>
          <div style={{ whiteSpace: "unset" }}>
            {isCurrentPosition && market?.status === PORTFOLIO_STATUS.ACTIVE && market.actualStartAt && market.duration
              ? `${formatTimestamp(market.actualStartAt)} -
                          ${formatTimestamp(Number(market.actualStartAt) + Number(market.duration))}`
              : null}
            {!isCurrentPosition &&
              _trancheCycle &&
              _trancheCycle.state !== 0 &&
              `${formatTimestamp(_trancheCycle.startAt)} → ${formatTimestamp(Number(_trancheCycle.endAt))}`}
          </div>
        </RowDiv>
        <RowDiv>
          <div css={{ display: "flex" }}>
            {intl.formatMessage({ defaultMessage: "Deposit APY" })}
            <Tooltip
              css={{ marginLeft: 10, lineHeight: 30 }}
              overlay={
                <React.Fragment>
                  <p></p>
                </React.Fragment>
              }
            >
              <Union />
            </Tooltip>
          </div>
          <div>
            {isCurrentPosition && `${tranchesDisplayText[positionIdx]} : `}
            <Text2 color={tranchesDisplayTextColor[positionIdx]}>
              {isCurrentPosition && market?.tranches && positionIdx !== market.tranches.length - 1
                ? formatAPY(market?.tranches[positionIdx].apy)
                : null}
              {isCurrentPosition && market?.tranches && positionIdx === market.tranches.length - 1
                ? getJuniorAPY(market?.tranches)
                : null}
              {!isCurrentPosition && `${tranchesDisplayText[_userInvest.tranche]} : `}
              {!isCurrentPosition && _trancheCycle && _trancheCycle.state !== 0
                ? new BigNumber(_userInvest.capital)
                    .minus(new BigNumber(_userInvest.principal))
                    .dividedBy(new BigNumber(_userInvest.principal))
                    // .times(new BigNumber((365 / 7) * 10000))
                    .times(new BigNumber(365 * 86400 * 100))
                    .dividedBy(new BigNumber(_trancheCycle.endAt - _trancheCycle.startAt))
                    .toFormat(0)
                    .toString()
                    .concat("%")
                : ""}
            </Text2>
            {isCurrentPosition && formatAllocPoint(market?.pools[positionIdx], market?.totalAllocPoints)}% WTF
          </div>
        </RowDiv>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Principal" })}</div>
          <div css={{ display: "flex", flexDirection: "column" }}>
            <span>
              {isCurrentPosition && formatNumberDisplay(position?.[1]?.hex)}
              {!isCurrentPosition && formatNumberDisplay(_userInvest.principal)} {market?.assets}
            </span>
            {/* <span css={{ color: theme.primary.deep }}>Maturity: 2D 12:56:56</span> */}
          </div>
        </RowDiv>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Status" })}</div>
          <div>
            {isCurrentPosition && market?.status === PORTFOLIO_STATUS.PENDING && <Tag color="yellow" value="Pending" />}
            {isCurrentPosition && market?.status === PORTFOLIO_STATUS.ACTIVE && <Tag color="green" value="Active" />}
            {isCurrentPosition && market?.status === PORTFOLIO_STATUS.EXPIRED && <Tag color="red" value="Expired" />}

            {!isCurrentPosition && _trancheCycle && _trancheCycle.state === 0 ? (
              <Tag color="yellow" value={"Pending"}></Tag>
            ) : null}
            {!isCurrentPosition && _trancheCycle && _trancheCycle.state === 1 ? (
              <Tag color="green" value={"Active"}></Tag>
            ) : null}
            {!isCurrentPosition && _trancheCycle && _trancheCycle.state === 2 ? (
              <Tag color="red" value={"Expired"}></Tag>
            ) : null}
          </div>
        </RowDiv>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Yield" })}</div>
          <div>
            {isCurrentPosition && market?.status === PORTFOLIO_STATUS.ACTIVE && interest && interest}
            {!isCurrentPosition && _trancheCycle && _trancheCycle.state !== 0
              ? formatNumberDisplay(
                  new BigNumber(_userInvest.capital).minus(new BigNumber(_userInvest.principal)).toString()
                )
              : "-"}{" "}
            {market?.assets}
          </div>
        </RowDiv>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "More" })}</div>
          <CaretDiv
            onClick={() => {
              setFold((isFold) => !isFold);
            }}
          >
            <CaretDown
              css={{
                transition: "transform 0.3s",
                transform: "rotate(0)",
                ...(isFold ? { transform: "rotate(180deg)" } : {})
              }}
            />
          </CaretDiv>
        </RowDiv>
        {!isFold && (
          <Wrapper>
            <WithdrawDiv>
              <div css={{ display: "flex", alignItems: "flex-start", fontSize: 12, color: gray.normal7 }}>
                <div>
                  {intl.formatMessage({ defaultMessage: "Principal+" })}
                  <Tooltip
                    overlay={intl.formatMessage({
                      defaultMessage: "Before the cycle starts, the principal can be redeemed in the Pending state."
                    })}
                  >
                    <u
                      css={{
                        borderBottom: "1px dotted",
                        borderColor: gray.normal7,
                        color: gray.normal7,
                        textDecoration: "none"
                      }}
                    >
                      {intl.formatMessage({ defaultMessage: "Est. yield" })}
                    </u>
                  </Tooltip>
                </div>

                <Tooltip
                  overlay={intl.formatMessage({
                    defaultMessage:
                      "In the active state, the yield is the theoretical yield calculated based on the theoretical APR.The actual yield is subject to the system display after expiration."
                  })}
                  css={{ marginLeft: 5 }}
                >
                  <Union css={{ color: gray.normal3 }} />
                </Tooltip>
              </div>
              <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>
                {isCurrentPosition &&
                  market?.status === PORTFOLIO_STATUS.ACTIVE &&
                  principalAndInterest &&
                  principalAndInterest}
                {isCurrentPosition &&
                  market?.status === PORTFOLIO_STATUS.PENDING &&
                  formatNumberDisplay(position?.[1]?.hex)}
                {!isCurrentPosition && formatNumberDisplay(_userInvest.capital)} {market?.assets}
              </div>
              <div css={{ display: "flex" }}>
                {/* <Button
                  css={{ marginRight: 10, fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
                  type="primary"
                >
                  {intl.formatMessage({ defaultMessage: "Withdraw all" })}
                </Button> */}
                {isCurrentPosition && market?.status === PORTFOLIO_STATUS.PENDING && (
                  <Button
                    css={{
                      fontSize: 12,
                      height: 30,
                      padding: "0 12px",
                      borderRadius: 4
                    }}
                    type="primary"
                    onClick={() => redeemDirect(positionIdx)}
                    loading={redeemLoading}
                  >
                    {intl.formatMessage({ defaultMessage: "Redeem" })}
                  </Button>
                )}
              </div>
            </WithdrawDiv>
            <RewardDiv>
              <div css={{ display: "flex", alignItems: "center" }}>
                <span css={{ marginRight: 5, color: gray.normal7, fontSize: 12 }}>
                  {intl.formatMessage({ defaultMessage: "WTF Reward" })}
                </span>
              </div>
              <div css={{ color: primary.deep, margin: "8px 0 6px 0" }}>
                {tranchesPendingReward ? formatNumberDisplay(tranchesPendingReward.toString()) : "-"} WTF
              </div>
              <div css={{ display: "flex" }}>
                {/* <Button
                  css={{ marginRight: 10, fontSize: 12, height: 30, padding: "0 12px", borderRadius: 4 }}
                  type="primary"
                >
                  {intl.formatMessage({ defaultMessage: "Claim" })}
                </Button> */}
              </div>
            </RewardDiv>
            <NoteDiv>
              <div css={{ marginRight: 4 }}>
                <Union css={{ color: primary.deep, transform: "translateY(2px)" }} />
              </div>
              <div css={{ color: gray.normal7, fontSize: 12 }}>
                {intl.formatMessage({
                  defaultMessage: `Upon maturity, you can choose to withdraw all the principal + yield. Alternatively you can choose to deposit to the next cycle - and choose the amount of re-deposit and tranche you re-deposit to.`
                })}
              </div>
            </NoteDiv>
          </Wrapper>
        )}
      </Container>
    );
  }
);

export default injectIntl(MyPositionItem);
