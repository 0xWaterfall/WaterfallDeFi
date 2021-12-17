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
import { StakingConfig } from "types";
import BigNumber from "bignumber.js";
import { getMultiplier } from "utils/multiplier";
import { from } from "@apollo/client";
import { BIG_TEN } from "utils/bigNumber";
import moment from "moment";
import { totalmem } from "os";
import { isPending } from "@reduxjs/toolkit";
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
    font-size: 14px;
    line-height: 125%;
    display: grid;
    gap: 5px;
    grid-auto-flow: column;
    align-items: center;
  }
  span {
    font-size: 16px;
    line-height: 125%;
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

const MAX = styled.div`
  font-size: 14px;
  line-height: 125%;
  color: ${({ theme }) => theme.primary.deep};
  cursor: pointer;
`;

type TProps = WrappedComponentProps & {
  stakingConfig: StakingConfig;
  fromMasterChef: boolean;
  wtfRewardsBalance?: string;
  claimReward?: (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => Promise<void>;
};
const MAX_LOCK_TIME = 63113904; //2 years
const MIN_LOCK_TIME = 7889238; //3 months
7862400;

const Increase = memo<TProps>(({ intl, stakingConfig, fromMasterChef, wtfRewardsBalance, claimReward }) => {
  const { tags } = useTheme();
  const { account } = useWeb3React<Web3Provider>();

  const [selectedValue, setSelectedValue] = useState<{ value: number; unit?: OpUnitType }>();
  const [datePickerValue, setDatePickerValue] = useState<Dayjs>();
  const [balanceInput, setBalanceInput] = useState("0");
  const { balance: wtfBalance, fetchBalance, actualBalance: actualWtfBalance } = useBalance(WTFAddress[NETWORK]);
  const { increaseLockAmount } = useIncreaseLockAmount();
  const { extendLockTime } = useExtendLockTime();
  const [approved, setApproved] = useState(false);
  const [locked, setLocked] = useState(false);
  const [resetSelect, setResetSelect] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [lockWTFRewardsLoading, setLockWTFRewardsLoading] = useState(false);
  const [increaseLockAmountLoading, setIncreaseLockAmountLoading] = useState(false);
  const [extendLockTimeLoading, setExtendLockTimeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { total: lockingWTF, expiryTimestamp, startTimestamp, fetchLockingWTF } = useGetLockingWTF(account);
  const { lockAndStakeWTF } = useLockAndStakeWTF();
  const { onCheckApprove } = useCheckApprove(WTFAddress[NETWORK], VeWTFAddress[NETWORK]);
  const { onCheckLocked } = useCheckLocked();
  const dispatch = useAppDispatch();
  const { onApprove } = useApprove(WTFAddress[NETWORK], VeWTFAddress[NETWORK]);
  const _wtfRewardsBalance =
    wtfRewardsBalance && wtfRewardsBalance !== "0"
      ? new BigNumber(wtfRewardsBalance).dividedBy(BIG_TEN.pow(18)).toString()
      : "0";
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
  }, [approved, account]);
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
  const isExpired = useMemo(() => {
    const timeNow = Math.floor(Date.now() / 1000);
    if (expiryTimestamp === "0") return false;
    return Number(expiryTimestamp) <= timeNow;
  }, [expiryTimestamp]);
  console.log("isExpired", isExpired);
  const newExpireDate = useMemo(() => {
    if (datePickerValue) {
      return datePickerValue;
    } else if (selectedValue) {
      if (expiryTimestamp === "0") return dayjs().add(selectedValue.value, selectedValue.unit);
      if (expiryTimestamp !== "0")
        return dayjs.unix(Number(expiryTimestamp)).add(selectedValue.value, selectedValue.unit);
    }
  }, [selectedValue, datePickerValue, expiryTimestamp]);

  const duration = useMemo(() => {
    if (!newExpireDate) return;
    const diff =
      expiryTimestamp !== "0"
        ? newExpireDate?.unix() - Number(expiryTimestamp)
        : newExpireDate?.unix() - Math.ceil(new Date().getTime() / 1000);

    // return Math.ceil(diff / 100) * 100;
    return diff;
  }, [newExpireDate]);

  const onExtendLockTime = useCallback(async () => {
    if (!duration) return;
    setExtendLockTimeLoading(true);
    try {
      // await extendLockTime(Number(expiryTimestamp) + Number(duration));
      await extendLockTime(Number(duration));
      fetchBalance();
      successNotification("Extend Lock Time Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setExtendLockTimeLoading(false);
    }
  }, [duration, expiryTimestamp]);

  const onConfirmLockWTFRewards = async () => {
    if (!fromMasterChef) return;
    if (!claimReward) return;
    if (!locked && !duration) return;
    console.log("A", duration, locked);
    const _duration = duration ? duration.toString() : "0";
    setLockWTFRewardsLoading(true);
    try {
      if (!locked) await claimReward(_duration, "0");
      if (locked) {
        //if expired , need to set new duration
        await claimReward("0", _duration);
      }
      // fetchBalance();
      // successNotification("Lock Rewards Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setLockWTFRewardsLoading(false);
    }
  };

  const receivedVeWTF = useMemo(() => {
    // const secondsInYear = 3600 * 24 * 365;
    if (fromMasterChef) {
      if (!wtfRewardsBalance || wtfRewardsBalance === "0") return "-";
      const _wtfRewardsBalance = new BigNumber(wtfRewardsBalance).dividedBy(BIG_TEN.pow(18)).toString();
      if (!locked) {
        if (!duration) return "-";
        const multiplier = getMultiplier(Number(duration || 0));

        return numeral((Number(_wtfRewardsBalance) * duration * multiplier) / 100 / MAX_LOCK_TIME).format("0,0.[0000]");
      }
      if (locked) {
        if (!expiryTimestamp) return "-";
        let total = 0;

        //calculate lockingWTF with extended duration
        if (duration) {
          const multiplier2 = getMultiplier(Number(duration || 0));
          const _balanceInput2 = Number(lockingWTF);
          total += (_balanceInput2 * duration * multiplier2) / 100 / MAX_LOCK_TIME;
        }
        const timeNow = Math.floor(Date.now() / 1000);
        const _duration =
          !duration || duration === 0
            ? Number(expiryTimestamp) - Number(timeNow)
            : Number(expiryTimestamp) - Number(timeNow) + duration;
        const multiplier = getMultiplier(Number(_duration || 0));
        const _balanceInput = Number(_wtfRewardsBalance);
        total += (_balanceInput * _duration * multiplier) / 100 / MAX_LOCK_TIME;
        return numeral(total).format("0,0.[0000]");
      }
    }
    if (!locked) {
      if (balanceInput === "0") return "-";
      if (!duration) return "-";
      const multiplier = getMultiplier(Number(duration || 0));

      return numeral((Number(balanceInput) * duration * multiplier) / 100 / MAX_LOCK_TIME).format("0,0.[0000]");
    }
    if (locked) {
      if (balanceInput === "0" && !duration) return "-";
      const timeNow = Math.floor(Date.now() / 1000);
      // const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(startTimestamp) : duration;
      const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(timeNow) : duration;
      const _balanceInput = balanceInput === "0" ? Number(lockingWTF) : Number(balanceInput);
      const multiplier = getMultiplier(Number(_duration || 0));
      return numeral((_balanceInput * _duration * multiplier) / 100 / MAX_LOCK_TIME).format("0,0.[0000]");
    }
  }, [duration, balanceInput, wtfRewardsBalance, expiryTimestamp, locked]);

  const convertRatio = useMemo(() => {
    console.log(lockingWTF);
    console.log(balanceInput);
    console.log(duration);
    // const secondsInYear = 3600 * 24 * 365;
    if (fromMasterChef) {
      if (!wtfRewardsBalance || wtfRewardsBalance === "0") return "-";
      const _wtfRewardsBalance = new BigNumber(wtfRewardsBalance).dividedBy(BIG_TEN.pow(18)).toString();
      if (!locked) {
        if (!duration) return "-";
        const multiplier = getMultiplier(Number(duration || 0));

        return numeral((Number(_wtfRewardsBalance) * duration * multiplier) / 10000 / MAX_LOCK_TIME).format(
          "0,0.[0000]"
        );
      }
      if (locked) {
        if (!expiryTimestamp) return "-";
        let total = 0;

        //calculate lockingWTF with extended duration
        if (duration) {
          const multiplier2 = getMultiplier(Number(duration || 0));
          const _balanceInput2 = Number(lockingWTF);
          console.log("lockingWTF,", lockingWTF, duration, multiplier2);
          console.log((_balanceInput2 * duration * multiplier2) / 10000 / MAX_LOCK_TIME);
          total += (_balanceInput2 * duration * multiplier2) / 10000 / MAX_LOCK_TIME;
        }
        const timeNow = Math.floor(Date.now() / 1000);
        const _duration =
          !duration || duration === 0
            ? Number(expiryTimestamp) - Number(timeNow)
            : Number(expiryTimestamp) - Number(timeNow) + duration;
        const multiplier = getMultiplier(Number(_duration || 0));
        const _balanceInput = Number(_wtfRewardsBalance);
        console.log("_balanceInput,", _balanceInput, _duration, multiplier);
        total += (_balanceInput * _duration * multiplier) / 10000 / MAX_LOCK_TIME;
        return numeral(total).format("0,0.[0000]");
      }
    }
    if (!locked) {
      if (balanceInput === "0") return "-";
      if (!duration) return "-";
      const multiplier = getMultiplier(Number(duration || 0));

      return numeral((Number(balanceInput) * duration * multiplier) / 10000 / MAX_LOCK_TIME).format("0,0.[0000]");
    }
    if (locked) {
      if (balanceInput === "0" && !duration) return "-";
      const timeNow = Math.floor(Date.now() / 1000);
      // const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(startTimestamp) : duration;
      const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(timeNow) : duration;
      const multiplier = getMultiplier(Number(_duration || 0));
      const _balanceInput = balanceInput === "0" ? Number(lockingWTF) : Number(balanceInput);
      return numeral((_balanceInput * _duration * multiplier) / 10000 / MAX_LOCK_TIME).format("0,0.[0000]");
    }
  }, [duration, balanceInput, wtfRewardsBalance, expiryTimestamp, locked]);

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

    if (locked) {
      //reset extend lock time
      // setSelectedValue(undefined);
      setSelectedValue({ value: 0, unit: "M" });
      setDatePickerValue(undefined);
      setResetSelect(true);
    }
  };
  const resetLockTime = () => {
    setDatePickerValue(undefined);
    setResetSelect(true);
    setSelectedValue(undefined);
  };
  const handleMaxLockTime = () => {
    console.log("max", Number(MAX_LOCK_TIME) - (Number(expiryTimestamp) - Number(startTimestamp)));
    console.log(startTimestamp);
    const timeNow = Math.floor(Date.now() / 1000);
    const _startTimestamp = startTimestamp !== "0" ? startTimestamp : timeNow;
    setDatePickerValue(dayjs.unix(Number(_startTimestamp) + Number(MAX_LOCK_TIME)));
  };
  const handleMaxInput = () => {
    const _balance = actualWtfBalance.replace(/\,/g, "");
    // const _remaining = remaining.replace(/\,/g, "");
    // const input = parseFloat(_balance);

    if (_balance) setBalanceInput(_balance);
  };
  const onConfirm = useCallback(async () => {
    if (validateText !== undefined && validateText.length > 0) return;
    if (Number(balanceInput) <= 0) return;
    if (!duration) return;
    setLoading(true);
    try {
      // await lockAndStakeWTF(balanceInput, duration);
      await lockAndStakeWTF(balanceInput, 3600);
      fetchBalance();
      setLocked(true);
      setBalanceInput("0");
      successNotification("Lock & Stake Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [newExpireDate, balanceInput]);
  const validateText = useMemo(() => {
    const _balance = actualWtfBalance.replace(/\,/g, "");
    const _balanceInput = balanceInput;
    if (compareNum(_balanceInput, _balance, true)) {
      return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
    }
  }, [wtfBalance, balanceInput]);
  const validateTextLockTime = useMemo(() => {
    if (!duration) return;
    const timeNow = Math.floor(Date.now() / 1000);
    // const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(timeNow) : duration;
    const _duration = duration || 0;

    const totalLockTime =
      expiryTimestamp !== "0" ? Number(expiryTimestamp) - Number(startTimestamp) + _duration : _duration;
    console.log("totalLockTime", totalLockTime, startTimestamp, expiryTimestamp, duration);

    const _startTimestamp = startTimestamp !== "0" ? startTimestamp : timeNow;
    const maxLockDate = dayjs.unix(Number(_startTimestamp) + Number(MAX_LOCK_TIME)).format("YYYY-MM-DD HH:mm:ss");
    console.log(maxLockDate);
    if (totalLockTime > MAX_LOCK_TIME)
      return `Maximum lock expiry date = ${maxLockDate} (2 Years from your initial lock date)`;

    if (totalLockTime < MIN_LOCK_TIME) return intl.formatMessage({ defaultMessage: "Minimum Lock Time = 3 Months" });

    if (newExpireDate && expiryTimestamp !== "0" && newExpireDate?.unix() < Number(expiryTimestamp))
      return intl.formatMessage({ defaultMessage: "Extend Lock Time has to be greater than previous expire date." });
  }, [duration, newExpireDate, account]);
  return (
    <Wrapper>
      {!fromMasterChef && (
        <Label>
          <p>
            {intl.formatMessage({ defaultMessage: "WTF Balance" })}: <span>{wtfBalance}</span>
          </p>
          <MAX onClick={handleMaxInput}>{intl.formatMessage({ defaultMessage: "MAX" })}</MAX>
        </Label>
      )}
      {!fromMasterChef && (
        <StakeInput
          type="number"
          step={0.1}
          min={0}
          suffixText="WTF"
          value={balanceInput}
          onChange={handleInputChange}
          style={validateText ? { borderColor: tags.redText } : {}}
        />
      )}
      {fromMasterChef && (
        <Label>
          <p>{intl.formatMessage({ defaultMessage: "WTF Reward" })}</p>
        </Label>
      )}

      {fromMasterChef && (
        <StakeInput
          type="number"
          step={0.1}
          min={0}
          suffixText="WTF"
          value={_wtfRewardsBalance}
          style={validateText ? { borderColor: tags.redText } : {}}
          disabled={fromMasterChef}
        />
      )}
      {validateText && <ValidateText>{validateText}</ValidateText>}

      {account && approved && locked && !isExpired && !fromMasterChef && (
        <ButtonWrapper type="primary" onClick={onIncreaseLockAmount} loading={increaseLockAmountLoading}>
          {intl.formatMessage({ defaultMessage: "Increase Lock Amount" })}
        </ButtonWrapper>
      )}
      <Label css={{ margin: "15px 0 10px" }}>
        <p>
          {intl.formatMessage({ defaultMessage: "Lock will expire in:" })}&nbsp;
          {expiryTimestamp !== "0" &&
            (duration
              ? dayjs.unix(Number(expiryTimestamp) + Number(duration)).format("YYYY-MM-DD HH:mm:ss")
              : dayjs.unix(Number(expiryTimestamp)).format("YYYY-MM-DD HH:mm:ss"))}
          {expiryTimestamp === "0" && newExpireDate?.format("YYYY-MM-DD")}
        </p>
        <div style={{ display: "flex" }}>
          <MAX style={{ marginRight: 10 }} onClick={resetLockTime}>
            {intl.formatMessage({ defaultMessage: "Reset" })}
          </MAX>
          <MAX onClick={handleMaxLockTime}>{intl.formatMessage({ defaultMessage: "MAX" })}</MAX>
        </div>
      </Label>

      <DatePickerWrapper
        style={{ marginBottom: 8 }}
        value={datePickerValue as moment.Moment | undefined}
        onChange={(e) => {
          //
          setDatePickerValue(e as Dayjs);

          if (locked) setBalanceInput("0");
        }}
      />

      <SelectTimeLimitWrapper
        onSelected={(e) => {
          console.log(e);
          setSelectedValue(e);
          setDatePickerValue(undefined);
          setResetSelect(false);

          if (locked) {
            setBalanceInput("0");
          }
        }}
        reset={Boolean(datePickerValue) || resetSelect}
      />
      {validateTextLockTime && <ValidateText>{validateTextLockTime}</ValidateText>}
      {account && approved && locked && !isExpired && !fromMasterChef && (
        <ButtonWrapper type="primary" onClick={onExtendLockTime} loading={extendLockTimeLoading}>
          {intl.formatMessage({ defaultMessage: "Extend Lock Time" })}
        </ButtonWrapper>
      )}
      {account && approved && (!locked || isExpired) && !fromMasterChef && (
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

      <Label css={{ marginTop: 10 }}>
        <p>
          {intl.formatMessage({ defaultMessage: "Convert Ratio" })}
          <Union />
        </p>
        <span>{!validateText && !validateTextLockTime && convertRatio}</span>
      </Label>

      <Label css={{ margin: 0 }}>
        <p>{intl.formatMessage({ defaultMessage: "Recevied veWTF" })}</p>
        <span>{!validateText && !validateTextLockTime && receivedVeWTF}</span>
      </Label>
      {account && approved && fromMasterChef && (
        <ButtonWrapper type="primary" onClick={onConfirmLockWTFRewards} loading={lockWTFRewardsLoading}>
          {intl.formatMessage({ defaultMessage: "Confirm" })}
        </ButtonWrapper>
      )}
    </Wrapper>
  );
});

export default injectIntl(Increase);
