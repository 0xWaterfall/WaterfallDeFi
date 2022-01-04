/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Union } from "assets/images";
import Button from "components/Button/Button";
import DatePicker from "components/DatePicker/DatePicker";
import StakeInput from "components/Input/StakeInput";
import SelectTimeLimit from "components/SelectTimeLimit/SelectTimeLimit";
import { NETWORK } from "config";
import { VeWTFAddress, WTFAddress } from "config/address";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import { useBalance } from "hooks";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { compareNum } from "utils/formatNumbers";
import { useTheme } from "@emotion/react";
import useLockAndStakeWTF from "pages/OldStake/hooks/useLockAndStakeWTF";
import { successNotification } from "utils/notification";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useCheckApprove from "pages/PortfolioDetails/hooks/useCheckApprove";
import useApprove from "pages/PortfolioDetails/hooks/useApprove";
import { useAppDispatch } from "store";
import { setConnectWalletModalShow } from "store/showStatus";
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  p {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    font-size: 16px;
    line-height: 125%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
  }

  div {
    font-size: 14px;
    line-height: 18px;
    display: grid;
    gap: 5px;
    grid-auto-flow: column;
    align-items: center;
  }
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 55px;
`;

const DatePickerWrapper = styled(DatePicker)`
  &.ant-picker {
    border-color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal2, theme.white.normal2)};
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    :hover {
      border-color: ${({ theme }) => theme.primary.deep};
    }
    input {
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    }
    .ant-picker-suffix {
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
    }
  }
`;

const SelectTimeLimitWrapper = styled(SelectTimeLimit)`
  div {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    border-color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal2, theme.white.normal2)};
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

type TProps = WrappedComponentProps;

const Stake = memo<TProps>(({ intl }) => {
  const { tags } = useTheme();

  const [selectedValue, setSelectedValue] = useState<{ value: number; unit?: OpUnitType }>();

  const [datePickerValue, setDatePickerValue] = useState<Dayjs>();
  const [balanceInput, setBalanceInput] = useState("0");
  const { balance: wtfBalance, fetchBalance } = useBalance(WTFAddress[NETWORK]);
  const { lockAndStakeWTF } = useLockAndStakeWTF();
  const [approved, setApproved] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { account } = useWeb3React<Web3Provider>();
  const { onCheckApprove } = useCheckApprove(WTFAddress[NETWORK], VeWTFAddress[NETWORK]);
  const dispatch = useAppDispatch();
  const { onApprove } = useApprove(WTFAddress[NETWORK], VeWTFAddress[NETWORK]);
  useEffect(() => {
    const checkApproved = async (account: string) => {
      const approved = await onCheckApprove();
      setApproved(approved ? true : false);
    };
    if (account) checkApproved(account);
  }, [account]);

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
  const newExpireDate = useMemo(() => {
    if (datePickerValue) {
      return datePickerValue;
    } else if (selectedValue) {
      return dayjs().add(selectedValue.value, selectedValue.unit);
    }
  }, [selectedValue, datePickerValue]);

  const duration = useMemo(() => {
    if (!newExpireDate) return;
    const diff = newExpireDate?.unix() - Math.ceil(new Date().getTime() / 1000);
    return Math.ceil(diff / 100) * 100;
  }, [newExpireDate]);

  const onConfirm = useCallback(async () => {
    if (validateText !== undefined && validateText.length > 0) return;
    if (Number(balanceInput) <= 0) return;
    if (!duration) return;

    setLoading(true);
    try {
      await lockAndStakeWTF(balanceInput, duration);
      fetchBalance();

      setBalanceInput("0");
      successNotification("Lock & Stake Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [newExpireDate, balanceInput]);
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
  const handleMaxInput = () => {
    const _balance = wtfBalance.replace(/\,/g, "");
    // const _remaining = remaining.replace(/\,/g, "");
    const input = parseInt(_balance);

    if (input) setBalanceInput(input.toString());
  };
  const validateText = useMemo(() => {
    const _balance = wtfBalance.replace(/\,/g, "");
    const _balanceInput = balanceInput;
    if (compareNum(_balanceInput, _balance, true)) {
      return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
    }
  }, [wtfBalance, balanceInput]);
  return (
    <Wrapper>
      <Label>
        <p>{intl.formatMessage({ defaultMessage: "WTF balance" })}</p>
        <span>{wtfBalance} WTF</span>
      </Label>

      <StakeInput
        step={0.1}
        suffixText="WTF"
        onMAX={handleMaxInput}
        value={balanceInput}
        onChange={handleInputChange}
        style={validateText ? { borderColor: tags.redText } : {}}
      />
      {validateText && <ValidateText>{validateText}</ValidateText>}

      <Label css={{ margin: "15px 0 10px" }}>
        <p>{intl.formatMessage({ defaultMessage: "Look for" })}</p>
      </Label>

      <DatePickerWrapper
        style={{ marginBottom: 8 }}
        value={datePickerValue as moment.Moment | undefined}
        onChange={(e) => {
          setDatePickerValue(e as Dayjs);
        }}
      />

      <SelectTimeLimitWrapper
        onSelected={(e) => {
          setSelectedValue(e);
          setDatePickerValue(undefined);
        }}
        css={{ marginBottom: 17 }}
        reset={Boolean(datePickerValue)}
      />

      <Label>
        <div>
          {intl.formatMessage({ defaultMessage: "Convert Ratio" })}
          <Union />
        </div>
        <span>--</span>
      </Label>

      <Label>
        <div>{intl.formatMessage({ defaultMessage: "Recevied veWTF" })}</div>
        <span>--</span>
      </Label>

      {/* <ButtonWrapper type="primaryLine" onClick={onConfirm}>
        {intl.formatMessage({ defaultMessage: "Lock & Stake veWTF" })}
      </ButtonWrapper> */}
      {account ? (
        approved ? (
          <ButtonWrapper type="primary" onClick={onConfirm} loading={loading}>
            {intl.formatMessage({ defaultMessage: "Stake" })}
          </ButtonWrapper>
        ) : (
          <ButtonWrapper type="primary" onClick={handleApprove} loading={approveLoading}>
            {intl.formatMessage({ defaultMessage: "Approve WTF" })}
          </ButtonWrapper>
        )
      ) : (
        <ButtonWrapper
          type="primary"
          onClick={() => {
            dispatch(setConnectWalletModalShow(true));
          }}
          loading={approveLoading}
        >
          {intl.formatMessage({ defaultMessage: "Connect Wallet" })}
        </ButtonWrapper>
      )}
    </Wrapper>
  );
});

export default injectIntl(Stake);
