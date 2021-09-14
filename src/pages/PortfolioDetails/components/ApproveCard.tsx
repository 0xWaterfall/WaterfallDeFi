/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { memo, useMemo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Form, Input, notification } from "antd";
import Button from "components/Button/Button";
import Separator from "components/Separator/Separator";
import { useState } from "react";
import {
  compareNum,
  formatBalance,
  formatNumberDisplay,
  formatNumberSeparator,
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
import { useAppDispatch } from "store";
import { setConnectWalletModalShow } from "store/showStatus";
const RowDiv = styled.div`
  font-size: 20px;
  line-height: 27px;
  color: ${({ theme }) => theme.gray.normal7};
  display: flex;
  margin-bottom: 35px;
  justify-content: space-between;
  & > div:nth-of-type(2) {
    font-size: 24px;
    line-height: 33px;
  }
`;
const Container = styled.div`
  position: relative;
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
  padding: 77px 81px;

  & input {
    color: ${({ theme }) => theme.primary.normal};
    font-size: 24px;
    line-height: 33px;
  }
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
  margin-top: 56px;
  & button {
    width: 100%;
  }
  @media screen and (min-width: 1024px) {
    & button {
      max-width: 300px;
    }
  }
`;
const BlockDiv = styled.div`
  background-color: #ffffff7a;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
`;
const ValidateText = styled.div`
  font-size: 12px;
  line-height: 125%;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.tags.redText};
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
};

const ApproveCard = memo<TProps>(
  ({ intl, isRe, assets, remaining, myBalance, enabled, data, selectTrancheIdx, isSoldOut }) => {
    const dispatch = useAppDispatch();
    const { tags } = useTheme();
    const [balanceInput, setBalanceInput] = useState(0);
    const [approved, setApproved] = useState(false);
    const [depositLoading, setDepositLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);
    const { account } = useWeb3React();
    const { onCheckApprove } = useCheckApprove(data.depositAssetAddress, data.address);
    const { onApprove } = useApprove(data.depositAssetAddress, data.address);
    const { onInvestDirect } = useInvestDirect();
    const { onInvest } = useInvest();
    useEffect(() => {
      const checkApproved = async (account: string) => {
        const approved = await onCheckApprove();
        setApproved(approved ? true : false);
      };
      if (account) checkApproved(account);
    }, [account]);
    useEffect(() => {
      setBalanceInput(0);
    }, [enabled]);
    const handleApprove = async () => {
      setApproveLoading(true);
      try {
        await onApprove();
        successNotification("Approve Success", "");
        setApproved(true);
      } catch (e) {
        console.error(e);
      } finally {
        setApproveLoading(false);
      }
    };
    const validateText = useMemo(() => {
      const _myBalance = myBalance.replace(/\,/g, "");
      const _remaining = remaining.replace(/\,/g, "");
      const _balanceInput = balanceInput;
      if (compareNum(_balanceInput, _myBalance, true)) {
        return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
      }
      if (compareNum(_balanceInput, _remaining, true)) {
        return intl.formatMessage({ defaultMessage: "Maximum deposit amount = {remaining}" }, { remaining: remaining });
      }
    }, [myBalance, remaining, balanceInput]);

    const handleDeposit = async () => {
      if (!validateText) return;
      if (balanceInput <= 0) return;
      if (selectTrancheIdx === undefined) return;

      setDepositLoading(true);
      const amount = balanceInput.toString();
      try {
        const success = !isRe
          ? await onInvestDirect(amount, selectTrancheIdx.toString())
          : await onInvest(amount, selectTrancheIdx.toString());
        if (success) {
          setBalanceInput(0);
          successNotification("Deposit Success", "");
        } else {
          successNotification("Deposit Fail", "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setDepositLoading(false);
      }
    };
    const handleMaxInput = () => {
      const _myBalance = myBalance.replace(/\,/g, "");
      const _remaining = remaining.replace(/\,/g, "");
      const _balanceInput = balanceInput;
      let input = 0;
      if (compareNum(_remaining, _myBalance)) {
        // if (_myBalance <= _remaining) {
        input = parseInt(_myBalance);
      } else if (compareNum(_myBalance, _remaining, true)) {
        // } else if (_myBalance > _remaining) {
        input = parseInt(_remaining);
      }
      if (input) setBalanceInput(input);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      let input = parseInt(value);
      if (isNaN(input)) input = 0;
      setBalanceInput(input);
    };

    return (
      <Container css={{ ...(isRe ? { padding: 24 } : {}) }}>
        {/* {!enabled && <BlockDiv />} */}
        {/* {isSoldOut && <BlockDiv />} */}
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Wallet Balance" })}</div>
          <div>
            {formatNumberSeparator(myBalance)} {assets}
          </div>
        </RowDiv>
        <RowDiv>
          <div>{intl.formatMessage({ defaultMessage: "Remaining" })}</div>
          <div>{formatNumberSeparator(remaining)}</div>
        </RowDiv>
        <Separator />
        <RowDiv>
          <div>{assets}</div>
        </RowDiv>
        {approved && (
          <div>
            <div>
              <Input
                style={validateText ? { borderColor: tags.redText } : {}}
                placeholder=""
                value={balanceInput}
                onChange={handleInputChange}
                suffix={<Max onClick={handleMaxInput}>{intl.formatMessage({ defaultMessage: "Max" })}</Max>}
                disabled={!enabled || isSoldOut}
              />
            </div>
            <ValidateText>{validateText}</ValidateText>
          </div>
        )}
        {account ? (
          approved ? (
            <ButtonDiv>
              <Button
                type="primary"
                css={{ height: 56 }}
                onClick={handleDeposit}
                loading={depositLoading}
                disabled={!enabled || !balanceInput}
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
      </Container>
    );
  }
);

export default injectIntl(ApproveCard);
