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
import useIncreaseLockAmount from "pages/OldStake/hooks/useIncreaseLockAmount";
import useCheckLocked from "pages/OldStake/hooks/useCheckLocked";
import numeral from "numeral";
import { utils } from "ethers";
import useExtendLockTime from "pages/Stake/hooks/useExtendLockTime";
import { useGetLockingWTF } from "pages/OldStake/hooks/useGetLockingWTF";
import { start } from "repl";
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
  width: fit-content;
  height: 44px;
  font-weight: 600;
  font-size: 16px;
  margin: 20px auto 24px;
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

const Line = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal08, theme.white.normal08)};
  margin-bottom: 24px;
`;

type TProps = WrappedComponentProps;

const Increase = memo<TProps>(({ intl }) => {
  const { tags } = useTheme();
  const { account } = useWeb3React<Web3Provider>();

  const [selectedValue, setSelectedValue] = useState<{ value: number; unit?: OpUnitType }>();

  const [datePickerValue, setDatePickerValue] = useState<Dayjs>();
  const [balanceInput, setBalanceInput] = useState("0");
  const { balance: wtfBalance, fetchBalance } = useBalance(WTFAddress[NETWORK]);
  const { increaseLockAmount } = useIncreaseLockAmount();
  const { extendLockTime } = useExtendLockTime();
  const [approved, setApproved] = useState(false);
  const [locked, setLocked] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [increaseLockAmountLoading, setIncreaseLockAmountLoading] = useState(false);
  const [extendLockTimeLoading, setExtendLockTimeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { total: lockingWTF, expiryTimestamp, startTimestamp, fetchLockingWTF } = useGetLockingWTF(account);
  const { lockAndStakeWTF } = useLockAndStakeWTF();
  const { onCheckApprove } = useCheckApprove(WTFAddress[NETWORK], VeWTFAddress[NETWORK]);
  const { onCheckLocked } = useCheckLocked();
  const dispatch = useAppDispatch();
  const { onApprove } = useApprove(WTFAddress[NETWORK], VeWTFAddress[NETWORK]);
  useEffect(() => {
    const checkApproved = async (account: string) => {
      const approved = await onCheckApprove();
      setApproved(approved ? true : false);
    };
    if (account) checkApproved(account);
  }, [account]);
  useEffect(() => {
    if (approved) {
      const checkLocked = async () => {
        const _locked = await onCheckLocked();
        setLocked(_locked);
      };
      checkLocked();
    }
  }, [approved]);
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

  const onIncreaseLockAmount = useCallback(async () => {
    if (validateText !== undefined && validateText.length > 0) return;
    if (Number(balanceInput) <= 0) return;

    setIncreaseLockAmountLoading(true);
    try {
      await increaseLockAmount(balanceInput);
      fetchBalance();
      setBalanceInput("0");
      fetchLockingWTF();
      successNotification("Increase Amount Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setIncreaseLockAmountLoading(false);
    }
  }, [balanceInput]);

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

  const onExtendLockTime = useCallback(async () => {
    if (!duration) return;
    setExtendLockTimeLoading(true);
    try {
      await extendLockTime(Number(expiryTimestamp) + Number(duration));
      fetchBalance();
      successNotification("Extend Lock Time Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setExtendLockTimeLoading(false);
    }
  }, [duration, expiryTimestamp]);

  const receivedVeWTF = useMemo(() => {
    const secondsInYear = 3600 * 24 * 365;
    if (!locked) {
      if (!balanceInput) return "-";
      if (!duration) return "-";

      return numeral((Number(balanceInput) * duration) / secondsInYear).format("0,0.[0000]");
    }
    if (locked) {
      if (!balanceInput && !duration) return "-";
      const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(startTimestamp) : duration;
      const _balanceInput = balanceInput === "0" ? Number(lockingWTF) : Number(balanceInput);
      return numeral((_balanceInput * _duration) / secondsInYear).format("0,0.[0000]");
    }
  }, [duration, balanceInput]);

  const convertRatio = useMemo(() => {
    const secondsInYear = 3600 * 24 * 365;
    if (!locked) {
      if (!balanceInput) return "-";
      if (!duration) return "-";

      return numeral((Number(balanceInput) * duration) / 100 / secondsInYear).format("0,0.[0000]");
    }
    if (locked) {
      if (!balanceInput && !duration) return "-";
      const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(startTimestamp) : duration;
      const _balanceInput = balanceInput === "0" ? Number(lockingWTF) : Number(balanceInput);
      return numeral((_balanceInput * _duration) / 100 / secondsInYear).format("0,0.[0000]");
    }
  }, [duration, balanceInput]);

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

    if (locked) {
      //reset extend lock time
      setSelectedValue({ value: 0, unit: "M" });
      setDatePickerValue(undefined);
    }
  };
  const handleMaxInput = () => {
    const _balance = wtfBalance.replace(/\,/g, "");
    // const _remaining = remaining.replace(/\,/g, "");
    const input = parseFloat(_balance);

    if (input) setBalanceInput(input.toString());
  };
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
        type="number"
        step={0.1}
        min={0}
        suffixText="WTF"
        onMAX={handleMaxInput}
        value={balanceInput}
        onChange={handleInputChange}
        style={validateText ? { borderColor: tags.redText } : {}}
      />
      {validateText && <ValidateText>{validateText}</ValidateText>}

      {account && approved && locked && (
        <ButtonWrapper type="primary" onClick={onIncreaseLockAmount} loading={increaseLockAmountLoading}>
          {intl.formatMessage({ defaultMessage: "Increase lock amount" })}
        </ButtonWrapper>
      )}
      <Label css={{ margin: "15px 0 10px" }}>
        <p>
          {intl.formatMessage({ defaultMessage: "Lock will expire in:" })}&nbsp;
          {expiryTimestamp !== "0" &&
            duration !== 0 &&
            dayjs.unix(Number(expiryTimestamp) + Number(duration)).format("YYYY-MM-DD HH:mm:ss")}
          {expiryTimestamp !== "0" &&
            duration === 0 &&
            dayjs.unix(Number(expiryTimestamp)).format("YYYY-MM-DD HH:mm:ss")}
          {expiryTimestamp === "0" && newExpireDate?.format("YYYY-MM-DD")}
        </p>
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
          console.log(e);
          setDatePickerValue(undefined);

          if (locked) {
            setBalanceInput("0");
          }
        }}
        reset={Boolean(datePickerValue)}
      />

      {account && approved && locked && (
        <ButtonWrapper type="primary" onClick={onExtendLockTime} loading={extendLockTimeLoading}>
          {intl.formatMessage({ defaultMessage: "Extend Lock Time" })}
        </ButtonWrapper>
      )}
      {account && approved && !locked && (
        <ButtonWrapper type="primaryLine" onClick={onConfirm} loading={loading}>
          {intl.formatMessage({ defaultMessage: "Lock & Stake WTF" })}
        </ButtonWrapper>
      )}
      {account && !approved && (
        <ButtonWrapper type="primary" onClick={handleApprove} loading={approveLoading}>
          {intl.formatMessage({ defaultMessage: "Approve WTF" })}
        </ButtonWrapper>
      )}
      {!account && (
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

      <Line />
      <Label>
        <div>
          {intl.formatMessage({ defaultMessage: "Convert Ratio" })}
          <Union />
        </div>
        <span>{convertRatio}</span>
      </Label>

      <Label>
        <div>{intl.formatMessage({ defaultMessage: "Recevied veWTF" })}</div>
        <span>{receivedVeWTF}</span>
      </Label>
    </Wrapper>
  );
});

export default injectIntl(Increase);
