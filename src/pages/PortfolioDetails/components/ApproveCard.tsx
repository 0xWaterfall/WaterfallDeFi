/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { memo, useMemo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Form, notification } from "antd";
import Button from "components/Button/Button";
import Separator from "components/Separator/Separator";
import { useState } from "react";
import {
  compareNum,
  formatAPY,
  formatBalance,
  formatNumberDisplay,
  formatNumberSeparator,
  formatRedemptionFee,
  getRemaining
} from "utils/formatNumbers";
import { useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Market, Tranche } from "types";
import { NotificationApi } from "antd/lib/notification";
import useCheckApprove from "../hooks/useCheckApprove";
import useApprove from "../hooks/useApprove";
import { successNotification } from "utils/notification";
import useInvestDirect from "../hooks/useInvestDirect";
import useInvest from "../hooks/useInvest";
import { useTheme } from "@emotion/react";
import { Union } from "assets/images";
import { useAppDispatch } from "store";
import { setConfirmModal, setConnectWalletModalShow } from "store/showStatus";
import Input from "components/Input/Input";
import { useBalance, useTrancheBalance } from "hooks";
// import { useTrancheBalance } from "hooks/useSelectors";
import numeral from "numeral";
import { getTrancheBalance } from "store/position";
const RowDiv = styled.div`
  font-size: 20px;
  line-height: 27px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  display: flex;
  margin-bottom: 35px;
  justify-content: space-between;
  & > div:nth-of-type(2) {
    font-size: 24px;
    line-height: 33px;
    text-align: end;
  }
`;
const Container = styled.div`
  position: relative;
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.block)};
  padding: 34px 24px;

  @media screen and (max-width: 675px) {
    padding: 24px;
  }
`;

const Max = styled.div`
  color: ${({ theme }) => theme.primary.normal};
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  display: flex;
  align-items: center;
  width: 45px;
  height: 27px;
  cursor: pointer;
`;
const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  & button {
    width: 100%;
  }
  @media screen and (min-width: 1024px) {
    & button {
      max-width: 300px;
    }
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
const RedemptionFee = styled.div`
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal7)};
  margin-top: 10px;
  text-align: center;
  & > span {
    color: ${({ theme }) => theme.primary.deep};
  }
`;
const ImportantNotes = styled.div`
  margin-top: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.dark.header)};
  padding: 20px;
  display: flex;
  min-height: 140px;

  & > div:nth-of-type(1) {
    color: ${({ theme }) => theme.primary.deep};
    padding-top: 2px;
    margin-right: 10px;
  }
  & > div:nth-of-type(2) > div:nth-of-type(1) {
    color: ${({ theme }) => theme.primary.deep};
    margin-bottom: 10px;
  }
  & > div:nth-of-type(2) > div:nth-of-type(2) {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  }
`;
type TProps = WrappedComponentProps & {
  isRe?: boolean;
  assets: string;
  remaining: string;
  myBalance: string;
  enabled: boolean;
  data: Market;
  selectTrancheIdx?: number;
  isSoldOut: boolean;
  selectTranche: Tranche | undefined;
};

const ApproveCard = memo<TProps>(
  ({ intl, isRe, assets, remaining, myBalance, enabled, data, selectTrancheIdx, isSoldOut, selectTranche }) => {
    const { tags } = useTheme();
    const [balanceInput, setBalanceInput] = useState("0");
    const [approved, setApproved] = useState(false);
    const [depositLoading, setDepositLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);
    const { account } = useWeb3React<Web3Provider>();
    const { onCheckApprove } = useCheckApprove(data.depositAssetAddress, data.address);
    const { onApprove } = useApprove(data.depositAssetAddress, data.address);
    const { onInvestDirect } = useInvestDirect(data.address);
    const { onInvest } = useInvest(data.address);
    const dispatch = useAppDispatch();
    const { balance: balanceWallet, fetchBalance } = useBalance(data.depositAssetAddress);
    const { balance: balanceRe } = useTrancheBalance(data.address);
    const balance =
      isRe === undefined ? numeral(balanceWallet).format("0,0.[0000]") : numeral(balanceRe).format("0,0.[0000]");
    const notes = [
      intl.formatMessage({
        defaultMessage:
          "When depositing senior, you will get a guaranteed fixed rate. However, your deposit will be locked in the portfolio until this maturity date is reached."
      }),
      intl.formatMessage({
        defaultMessage:
          "When depositing mezzanine, you will get a guaranteed fixed rate. However, your deposit will be locked in the portfolio until this maturity date is reached."
      }),
      intl.formatMessage({
        defaultMessage:
          "When you deposit Junior, you will get a variable rate. However, depending on market changes and the total APR of your portfolio, your effective APR may be lower. Make sure you fully understand the risks."
      })
    ];

    useEffect(() => {
      const checkApproved = async (account: string) => {
        const approved = await onCheckApprove();
        setApproved(approved ? true : false);
      };
      if (account) checkApproved(account);
    }, [account]);
    useEffect(() => {
      setBalanceInput("0");
    }, [enabled]);
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
    const validateText = useMemo(() => {
      const _balance = balance.replace(/\,/g, "");
      const _remaining = remaining.replace(/\,/g, "");
      const _balanceInput = balanceInput;
      if (compareNum(_balanceInput, _balance, true)) {
        return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
      }
      if (compareNum(_balanceInput, _remaining, true)) {
        return intl.formatMessage({ defaultMessage: "Maximum deposit amount = {remaining}" }, { remaining: remaining });
      }
    }, [balance, remaining, balanceInput]);

    const handleDeposit = async () => {
      if (validateText !== undefined && validateText.length > 0) return;
      if (Number(balanceInput) <= 0) return;
      if (selectTrancheIdx === undefined) return;

      setDepositLoading(true);
      dispatch(
        setConfirmModal({
          isOpen: true,
          txn: undefined,
          status: "PENDING",
          pendingMessage: intl.formatMessage({ defaultMessage: "Depositing " }) + " " + balanceInput + " " + assets
        })
      );
      const amount = balanceInput.toString();
      try {
        const success = !isRe
          ? await onInvestDirect(amount, selectTrancheIdx.toString())
          : await onInvest(amount, selectTrancheIdx.toString());
        if (success) {
          successNotification("Deposit Success", "");
        } else {
          successNotification("Deposit Fail", "");
        }
        setDepositLoading(false);
        setBalanceInput("0");
        fetchBalance();
        if (account) dispatch(getTrancheBalance({ account }));
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
    const handleMaxInput = () => {
      const _balance = balance.replace(/\,/g, "");
      const _remaining = remaining.replace(/\,/g, "");
      const _balanceInput = balanceInput;
      let input = 0;
      if (compareNum(_remaining, _balance)) {
        // if (_balance <= _remaining) {
        input = parseFloat(_balance);
      } else if (compareNum(_balance, _remaining, true)) {
        // } else if (_balance > _remaining) {
        input = parseFloat(_remaining);
      }
      if (input) setBalanceInput(input.toString());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const d = value.split(".");
      if (d.length === 2 && d[1].length === 5) {
        return;
      }
      let input = Number(value);
      // console.log(input);
      if (isNaN(input)) input = 0;
      setBalanceInput(input.toString());
    };
    return (
      <Container css={{ ...(isRe ? { padding: 24 } : {}) }}>
        {/* {!enabled && <BlockDiv />} */}
        {/* {isSoldOut && <BlockDiv />} */}
        <RowDiv>
          <div>
            {isRe
              ? intl.formatMessage({ defaultMessage: "Total Roll-deposit Amount" })
              : intl.formatMessage({ defaultMessage: "Wallet Balance" })}
            :
          </div>
          <div>
            {formatNumberSeparator(balance)} {assets}
          </div>
        </RowDiv>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Remaining" })}:</div>
          <div>
            {formatNumberSeparator(remaining)} {assets}
          </div>
        </RowDiv>
        <Separator />
        <RowDiv>
          <div>{assets}</div>
        </RowDiv>

        <div>
          <Input
            type="number"
            style={!depositLoading && validateText ? { borderColor: tags.redText } : {}}
            placeholder=""
            step={0.1}
            min={0}
            value={balanceInput}
            onChange={handleInputChange}
            suffix={<Max onClick={handleMaxInput}>{intl.formatMessage({ defaultMessage: "MAX" })}</Max>}
            disabled={!enabled || isSoldOut}
          />
        </div>
        <ValidateText>{!depositLoading && validateText}</ValidateText>

        {selectTranche && (
          <ImportantNotes>
            <div>
              <Union />
            </div>
            <div>
              <div>{intl.formatMessage({ defaultMessage: "Important Notes" })}</div>
              <div>{selectTrancheIdx !== undefined && notes[selectTrancheIdx]}</div>
            </div>
          </ImportantNotes>
        )}

        {account ? (
          approved ? (
            <ButtonDiv>
              <Button
                type="primary"
                css={{ height: 56 }}
                onClick={handleDeposit}
                loading={depositLoading}
                disabled={!enabled || isSoldOut || !balanceInput}
              >
                {intl.formatMessage({ defaultMessage: "Deposit" })}
              </Button>
            </ButtonDiv>
          ) : (
            <ButtonDiv>
              <Button type="primary" css={{ height: 56 }} onClick={handleApprove} loading={approveLoading}>
                {intl.formatMessage({ defaultMessage: "Approve" })}
              </Button>
            </ButtonDiv>
          )
        ) : (
          <ButtonDiv>
            <Button
              type="primary"
              css={{ height: 56 }}
              onClick={() => {
                dispatch(setConnectWalletModalShow(true));
              }}
            >
              {intl.formatMessage({ defaultMessage: "Connect wallet" })}
            </Button>
          </ButtonDiv>
        )}
        {enabled && (
          <RedemptionFee>
            Withdrawal fee: ( Principal + all yield of the current cycle ) x{" "}
            <span>{selectTranche && selectTranche.fee + "%"}</span>
          </RedemptionFee>
        )}
      </Container>
    );
  }
);

export default injectIntl(ApproveCard);
