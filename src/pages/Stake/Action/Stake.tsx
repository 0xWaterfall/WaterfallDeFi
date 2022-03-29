/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Union } from "assets/images";
import Button from "components/Button/Button";
import DatePicker from "components/DatePicker/DatePicker";
import StakeInput from "components/Input/StakeInput";
import SelectTimeLimit from "components/SelectTimeLimit/SelectTimeLimit";
import { NETWORK } from "config";
import { VeWTFAddressBNB, WTFAddressBNB, VeWTFAddressAVAX, WTFAddressAVAX } from "config/address";
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
import { useNetwork } from "hooks/useSelectors";
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
  margin-bottom: 10px;
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
  width: 100%;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 32px;
`;

const DatePickerWrapper = styled(DatePicker)`
  &.ant-picker {
    border-color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal2, theme.white.normal2)};
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
    :hover {
      border-color: ${({ theme }) => theme.primary.deep};
    }
    input {
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
    }
    .ant-picker-suffix {
      color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal5)};
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

const MAX = styled.div`
  font-size: 14px;
  line-height: 125%;
  color: ${({ theme }) => theme.primary.deep};
  cursor: pointer;
`;

type TProps = WrappedComponentProps;

const Stake = memo<TProps>(({ intl }) => {
  const { tags } = useTheme();
  const network = useNetwork();

  const [selectedValue, setSelectedValue] = useState<{ value: number; unit?: OpUnitType }>();

  const [datePickerValue, setDatePickerValue] = useState<Dayjs>();
  const [balanceInput, setBalanceInput] = useState("0");
  const { balance: wtfBalance, fetchBalance } = useBalance(
    network === "bnb" ? WTFAddressBNB[NETWORK] : WTFAddressAVAX[NETWORK]
  );
  const { lockAndStakeWTF } = useLockAndStakeWTF();
  const [approved, setApproved] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { account } = useWeb3React<Web3Provider>();
  const { onCheckApprove } = useCheckApprove(
    network === "bnb" ? WTFAddressBNB[NETWORK] : WTFAddressAVAX[NETWORK],
    network === "bnb" ? VeWTFAddressBNB[NETWORK] : VeWTFAddressAVAX[NETWORK]
  );
  const dispatch = useAppDispatch();
  const { onApprove } = useApprove(
    network === "bnb" ? WTFAddressBNB[NETWORK] : WTFAddressAVAX[NETWORK],
    network === "bnb" ? VeWTFAddressBNB[NETWORK] : VeWTFAddressAVAX[NETWORK]
  );
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
        <p>
          {intl.formatMessage({ defaultMessage: "WTF balance" })}: <span>{wtfBalance}</span>
        </p>
        <MAX onClick={handleMaxInput}>{intl.formatMessage({ defaultMessage: "MAX" })}</MAX>
      </Label>

      <StakeInput
        step={0.1}
        suffixText="WTF"
        value={balanceInput}
        onChange={handleInputChange}
        style={validateText ? { borderColor: tags.redText } : {}}
      />
      {validateText && <ValidateText>{validateText}</ValidateText>}

      <Label css={{ margin: "24px 0 10px" }}>
        <p>{intl.formatMessage({ defaultMessage: "Look for" })}</p>
        <MAX>{intl.formatMessage({ defaultMessage: "MAX" })}</MAX>
      </Label>

      <DatePickerWrapper
        style={{ marginBottom: 16 }}
        value={datePickerValue as moment.Moment | undefined}
        onChange={(e) => {
          setDatePickerValue(e as Dayjs);
        }}
      />

      <SelectTimeLimit
        onSelected={(e) => {
          setSelectedValue(e);
          setDatePickerValue(undefined);
        }}
        css={{ marginBottom: 17 }}
        reset={Boolean(datePickerValue)}
      />

      <Label>
        <p>
          {intl.formatMessage({ defaultMessage: "Convert Ratio" })}
          <Union />
        </p>
        <span>--</span>
      </Label>

      <Label>
        <p>{intl.formatMessage({ defaultMessage: "Recevied veWTF" })}</p>
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
