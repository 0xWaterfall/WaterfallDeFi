/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Union } from "assets/images";
import Button from "components/Button/Button";
import DatePicker from "components/DatePicker/DatePicker";
import StakeInput from "components/Input/StakeInput";
import SelectTimeLimit, { Block } from "components/SelectTimeLimit/SelectTimeLimit";
import { NETWORK } from "config";
import { VeWTFAddress, WTFAddress } from "config/address";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import { useBalance } from "hooks";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { compareNum } from "utils/formatNumbers";
import { useTheme } from "@emotion/react";
import useLockAndStakeWTF from "pages/Stake/hooks/useLockAndStakeWTF";
import { successNotification } from "utils/notification";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useCheckApprove from "pages/PortfolioDetails/hooks/useCheckApprove";
import useApprove from "pages/PortfolioDetails/hooks/useApprove";
import { useAppDispatch } from "store";
import { setConnectWalletModalShow } from "store/showStatus";
const Wrapper = styled.div`
  padding: 32px 50px;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal5, theme.dark.header)};
  box-shadow: 0px 4px 10px 0px #0000000a;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
  @media screen and (max-width: 768px) {
    padding: 32px;
  }
`;

const Title = styled.div`
  font-size: 24px;
  line-height: 125%;
`;

const Line = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.useColorModeValue(theme.gray.normal08, theme.white.normal08)};
  margin: 20px 0;
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
  background: transparent;
  :hover,
  :focus {
    background: transparent;
  }
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

const LockUp = memo<TProps>(({ intl }) => {
  const [isDatePickerShow, setDatePickerShow] = useState(false);
  const { tags } = useTheme();

  const [selectedValue, setSelectedValue] = useState<{ value: number; unit?: OpUnitType }>();

  const [datePickerValue, setDatePickerValue] = useState<Dayjs>();
  const [balanceInput, setBalanceInput] = useState(0);
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
      console.log(approved);
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
    if (isDatePickerShow) {
      return datePickerValue;
    } else if (selectedValue) {
      return dayjs().add(selectedValue.value, selectedValue.unit);
    }
  }, [selectedValue, datePickerValue, isDatePickerShow]);
  const duration = useMemo(() => {
    if (!newExpireDate) return;
    const diff = newExpireDate?.unix() - Math.ceil(new Date().getTime() / 1000);
    return Math.ceil(diff / 100) * 100;
  }, [newExpireDate]);

  const onConfirm = useCallback(async () => {
    if (validateText !== undefined && validateText.length > 0) return;
    if (balanceInput <= 0) return;
    if (!duration) return;

    setLoading(true);
    try {
      await lockAndStakeWTF(balanceInput, duration);
      fetchBalance();
      setBalanceInput(0);
      successNotification("Lock & Stake Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [newExpireDate, balanceInput]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let input = parseInt(value);
    if (isNaN(input)) input = 0;
    setBalanceInput(input);
  };
  const handleMaxInput = () => {
    const _balance = wtfBalance.replace(/\,/g, "");
    // const _remaining = remaining.replace(/\,/g, "");
    const input = parseInt(_balance);

    if (input) setBalanceInput(input);
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
      <Title>{intl.formatMessage({ defaultMessage: "Lock-up" })}</Title>
      <Line />
      <Label>
        <p>{intl.formatMessage({ defaultMessage: "WTF balance" })}</p>
        <span>{wtfBalance} WTF</span>
      </Label>

      <StakeInput
        suffixText="WTF"
        onMAX={handleMaxInput}
        value={balanceInput}
        onChange={handleInputChange}
        style={validateText ? { borderColor: tags.redText } : {}}
      />
      <ValidateText>{validateText}</ValidateText>

      <Label css={{ margin: "16px 0 10px" }}>
        <p>{intl.formatMessage({ defaultMessage: "Choose a period" })}</p>
      </Label>

      <SelectTimeLimitWrapper
        onSelected={(e) => {
          setSelectedValue(e);
          setDatePickerShow(false);
        }}
        css={{ marginBottom: 17 }}
        reset={isDatePickerShow}
        suffixRender={
          <Block
            data-actived={isDatePickerShow}
            onClick={() => {
              setDatePickerShow(true);
            }}
          >
            {intl.formatMessage({ defaultMessage: "Custom" })}
          </Block>
        }
      />

      {isDatePickerShow && (
        <DatePickerWrapper
          style={{ marginBottom: 19 }}
          value={datePickerValue as moment.Moment | undefined}
          onChange={(e) => {
            setDatePickerValue(e as Dayjs);
          }}
        />
      )}

      <Label>
        <div>
          {intl.formatMessage({ defaultMessage: "Pending Rewards" })}
          <Union />
        </div>
        <span>0</span>
      </Label>

      <Label>
        <div>{intl.formatMessage({ defaultMessage: "Recevied Ve-WTF" })}</div>
        <span>100,000</span>
      </Label>

      <Label>
        <div>{intl.formatMessage({ defaultMessage: "Expire date" })}</div>
        <p>{newExpireDate ? newExpireDate?.format("YYYY-MM-DD") : "--"}</p>
      </Label>

      {/* <ButtonWrapper type="primaryLine" onClick={onConfirm}>
        {intl.formatMessage({ defaultMessage: "Lock & Stake Ve-WTF" })}
      </ButtonWrapper> */}
      {account ? (
        approved ? (
          <ButtonWrapper type="primaryLine" onClick={onConfirm} loading={loading}>
            {intl.formatMessage({ defaultMessage: "Lock & Stake WTF" })}
          </ButtonWrapper>
        ) : (
          <ButtonWrapper type="primaryLine" onClick={handleApprove} loading={approveLoading}>
            {intl.formatMessage({ defaultMessage: "Approve WTF" })}
          </ButtonWrapper>
        )
      ) : (
        <ButtonWrapper
          type="primaryLine"
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

export default injectIntl(LockUp);
