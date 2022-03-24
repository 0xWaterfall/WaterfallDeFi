/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import Button from "components/Button/Button";
import StakeInput from "components/Input/StakeInput";
import React, { memo, useEffect, useMemo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useCheckApprove from "pages/PortfolioDetails/hooks/useCheckApprove";
import { FarmInterface } from "../hooks/useFarms";
import { useBalance } from "hooks";
import useApprove from "pages/PortfolioDetails/hooks/useApprove";
import { successNotification } from "utils/notification";
import { setConfirmModal, setConnectWalletModalShow } from "store/showStatus";
import { useAppDispatch } from "store";
import useStake from "../hooks/useStake";
import useLPStaked from "../hooks/useLPStaked";
import { compareNum } from "utils/formatNumbers";
import { useTheme } from "@emotion/react";
import useUnstake from "../hooks/useUnstake";

const Wrapper = styled.div`
  padding: 0 42px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.block5)};
  border-radius: 24px;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  @media screen and (max-width: 876px) {
    padding-bottom: 24px;
    margin-bottom: 24px;
  }
`;

const Tabs = styled.div`
  padding: 32px 0 20px;
  display: grid;
  gap: 20px;
  grid-auto-flow: column;
  width: fit-content;
  div {
    font-size: 24px;
    line-height: 125%;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
    cursor: pointer;
    &[data-actived="true"],
    :hover {
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
    }
  }
`;

const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.useColorModeValue(theme.gray.normal04, theme.white.normal1)};
  padding-top: 32px;
`;

const Label = styled.div`
  font-size: 14px;
  line-height: 125%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
`;
const Label2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    font-size: 14px;
    line-height: 125%;
    display: grid;
    gap: 5px;
    grid-auto-flow: column;
    align-items: center;
  }
  span {
    font-size: 16px;
  }

  div {
    font-size: 16px;
  }
`;
const ValidateText = styled.div`
  font-size: 12px;
  line-height: 125%;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.tags.redText};
  margin-top: 4px;
  min-height: 15px;
`;

const Balance = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 125%;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  margin: 12px 0;
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
  margin-top: 86px;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  background: transparent;
  :hover,
  :focus {
    background: transparent;
  }
`;
const ButtonWrapper2 = styled(Button)`
  width: 100%;
  margin-top: 40px;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  background: transparent;
  :hover,
  :focus {
    background: transparent;
  }
`;
const MAX = styled.div`
  font-size: 14px;
  line-height: 125%;
  color: ${({ theme }) => theme.primary.deep};
  cursor: pointer;
`;
type TProps = WrappedComponentProps & {
  farm: FarmInterface;
};
const StakeAction = memo<TProps>(({ intl, farm }) => {
  const { tags } = useTheme();
  const TABS = [
    { key: "STAKE", text: intl.formatMessage({ defaultMessage: "Stake" }) },
    { key: "UNSTAKE", text: intl.formatMessage({ defaultMessage: "Unstake" }) },
    { key: "ADDLIQUIDITY", text: intl.formatMessage({ defaultMessage: "Add Liquidity" }) }
  ];

  const dispatch = useAppDispatch();
  const { account } = useWeb3React<Web3Provider>();
  const [balanceInput, setBalanceInput] = useState("0");
  const [approved, setApproved] = useState(false);
  const { balance: lpTokenBalance, actualBalance: lpTokenActualBalance } = useBalance(farm?.lpTokenAddress);
  const [depositLoading, setDepositLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const { onCheckApprove } = useCheckApprove(farm?.lpTokenAddress, farm?.lpRewardAddress);
  const { onApprove } = useApprove(farm?.lpTokenAddress, farm?.lpRewardAddress);
  const { onStake } = useStake(farm?.lpRewardAddress);
  const { onUnstake } = useUnstake(farm?.lpRewardAddress);
  const stakedBalance = useLPStaked(farm?.lpRewardAddress);

  const [actived, setActived] = useState("STAKE");
  useEffect(() => {
    const checkApproved = async (account: string) => {
      const approved = await onCheckApprove();
      setApproved(approved ? true : false);
    };
    if (account) checkApproved(account);
  }, [account]);
  const validateText = useMemo(() => {
    let inputBalance = "";
    if (actived === "STAKE") inputBalance = lpTokenActualBalance;
    if (actived === "UNSTAKE") inputBalance = stakedBalance;

    const _balance = inputBalance.replace(/\,/g, "");
    const _balanceInput = balanceInput;
    if (compareNum(_balanceInput, _balance, true)) {
      return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
    }
  }, [lpTokenActualBalance, balanceInput, stakedBalance, actived]);
  const handleDeposit = async () => {
    if (Number(balanceInput) <= 0) return;

    setDepositLoading(true);
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: undefined,
        status: "PENDING",
        pendingMessage: intl.formatMessage({ defaultMessage: "Depositing " }) + " " + balanceInput + " " + farm.name
      })
    );
    const amount = balanceInput.toString();
    try {
      const success = await onStake(amount);
      if (success) {
        successNotification("Deposit Success", "");
      } else {
        successNotification("Deposit Fail", "");
      }
      setDepositLoading(false);
      setBalanceInput("0");
      // fetchBalance();
    } catch (e) {
      dispatch(
        setConfirmModal({
          isOpen: true,
          txn: undefined,
          status: "REJECTED",
          pendingMessage: intl.formatMessage({ defaultMessage: "Deposit Fail " })
        })
      );
      // successNotification("Deposit Fail", "");
      console.error(e);
    } finally {
      setDepositLoading(false);
    }
  };
  const handleUnstake = async () => {
    if (Number(balanceInput) <= 0) return;

    setUnstakeLoading(true);
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: undefined,
        status: "PENDING",
        pendingMessage: intl.formatMessage({ defaultMessage: "Unstaking " }) + " " + balanceInput + " " + farm.name
      })
    );
    const amount = balanceInput.toString();
    try {
      const success = await onUnstake(amount);
      if (success) {
        successNotification("Unstake Success", "");
      } else {
        successNotification("Unstake Fail", "");
      }
      setUnstakeLoading(false);
      setBalanceInput("0");
      // fetchBalance();
    } catch (e) {
      dispatch(
        setConfirmModal({
          isOpen: true,
          txn: undefined,
          status: "REJECTED",
          pendingMessage: intl.formatMessage({ defaultMessage: "Unstake Fail " })
        })
      );
      // successNotification("Deposit Fail", "");
      console.error(e);
    } finally {
      setUnstakeLoading(false);
    }
  };
  const handleApprove = async () => {
    setApproveLoading(true);
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: undefined,
        status: "PENDING",
        pendingMessage: intl.formatMessage({ defaultMessage: "Approving " })
      })
    );
    try {
      await onApprove();
      successNotification("Approve Success", "");
      setApproved(true);
    } catch (e) {
      console.error(e);

      dispatch(
        setConfirmModal({
          isOpen: true,
          txn: undefined,
          status: "REJECTED",
          pendingMessage: intl.formatMessage({ defaultMessage: "Approve Fail " })
        })
      );
    } finally {
      setApproveLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.match("^[0-9]*[.]?[0-9]*$") != null) {
      const d = value.split(".");
      if (d.length === 2 && d[1].length > 18) {
        return;
      }

      const _input1 = d[0].length > 1 ? d[0].replace(/^0+/, "") : d[0];
      const _decimal = value.includes(".") ? "." : "";
      const _input2 = d[1]?.length > 0 ? d[1] : "";
      setBalanceInput(_input1 + _decimal + _input2);
    }
  };
  const handleMaxInput = () => {
    let inputBalance = "";
    if (actived === "STAKE") inputBalance = lpTokenActualBalance;
    if (actived === "UNSTAKE") inputBalance = stakedBalance;

    const _balance = inputBalance.replace(/\,/g, "");
    const input = parseFloat(_balance);
    if (input) setBalanceInput(input.toString());
  };
  return (
    <Wrapper>
      <Tabs>
        {TABS.map((p) => (
          <div key={p.key} data-actived={actived === p.key} onClick={setActived.bind(null, p.key)}>
            {p.text}
          </div>
        ))}
      </Tabs>
      <Container>
        {actived !== "ADDLIQUIDITY" && (
          <>
            <Label>
              <p>
                {actived === "STAKE" ? "" : "Staked "}
                {farm?.name} {intl.formatMessage({ defaultMessage: "balance" })}
              </p>
            </Label>
            <Label2>
              <p>
                <Balance>{actived === "STAKE" ? lpTokenBalance : stakedBalance}</Balance>
              </p>
              <MAX onClick={handleMaxInput}>{intl.formatMessage({ defaultMessage: "MAX" })}</MAX>
            </Label2>

            <StakeInput
              suffixText={farm?.name}
              value={balanceInput}
              onChange={handleInputChange}
              disabled={!approved}
              style={validateText ? { borderColor: tags.redText } : {}}
            />
            <ValidateText>{validateText && validateText}</ValidateText>
            {!account && (
              <ButtonWrapper
                type="primaryLine"
                onClick={() => {
                  dispatch(setConnectWalletModalShow(true));
                }}
              >
                {intl.formatMessage({ defaultMessage: "Connect wallet" })}
              </ButtonWrapper>
            )}
            {account && !approved && (
              <ButtonWrapper type="primaryLine" onClick={handleApprove} loading={approveLoading}>
                {intl.formatMessage({ defaultMessage: "Approve" })}
              </ButtonWrapper>
            )}
            {account && approved && actived === "STAKE" && (
              <ButtonWrapper type="primaryLine" onClick={handleDeposit} loading={depositLoading}>
                {intl.formatMessage({ defaultMessage: "Deposit" })}
              </ButtonWrapper>
            )}
            {account && approved && actived === "UNSTAKE" && (
              <ButtonWrapper type="primaryLine" onClick={handleUnstake} loading={unstakeLoading}>
                {intl.formatMessage({ defaultMessage: "Unstake" })}
              </ButtonWrapper>
            )}
          </>
        )}

        {actived === "ADDLIQUIDITY" && (
          <>
            <Label>
              <p>{intl.formatMessage({ defaultMessage: "Provide Liquidity and receive LP tokens for farming" })}</p>
            </Label>
            <ButtonWrapper2
              type="primaryLine"
              onClick={() => {
                window.open(farm.lpURL, "_blank")?.focus();
              }}
            >
              {farm.lpButtonTitle}
            </ButtonWrapper2>

            <ButtonWrapper2
              type="primaryLine"
              onClick={() => {
                window
                  .open(
                    "https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide/waterfall-farming",
                    "_blank"
                  )
                  ?.focus();
              }}
            >
              {intl.formatMessage({ defaultMessage: "What is LP and How to LP?" })}
            </ButtonWrapper2>
          </>
        )}
      </Container>
    </Wrapper>
  );
});

export default injectIntl(StakeAction);
