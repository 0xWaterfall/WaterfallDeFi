/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useWeb3React } from "@web3-react/core";
import Button from "components/Button/Button";
import StakeInput from "components/Input/StakeInput";
import { useBalance } from "hooks";
import numeral from "numeral";
import useUnstake from "pages/Stake/hooks/useUnstake";
import React, { memo, useCallback, useMemo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { StakingConfig } from "types";
import { compareNum } from "utils/formatNumbers";
import { successNotification } from "utils/notification";
import { Web3Provider } from "@ethersproject/providers";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  div {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    font-size: 14px;
    line-height: 125%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
  }
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 158px;
`;
const ValidateText = styled.div`
  font-size: 12px;
  line-height: 125%;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.tags.redText};
  margin-top: 4px;
  min-height: 15px;
`;

type TProps = WrappedComponentProps & {
  stakingConfig: StakingConfig;
};
const Unstake = memo<TProps>(({ intl, stakingConfig }) => {
  const { tags } = useTheme();
  const { account } = useWeb3React<Web3Provider>();
  const { balance: VeWTFBalance } = useBalance(stakingConfig.earningTokenAddress);
  const [balanceInput, setBalanceInput] = useState("0");
  const [loading, setLoading] = useState(false);
  const { unstake } = useUnstake();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const d = value.split(".");
    if (d.length === 2 && d[1].length === 5) {
      return;
    }
    let input = Number(value);
    if (isNaN(input)) input = 0;
    setBalanceInput(input.toString());
  };
  const handleMaxInput = () => {
    const _balance = VeWTFBalance.replace(/\,/g, "");
    // const _remaining = remaining.replace(/\,/g, "");
    const input = parseFloat(_balance);

    if (input) setBalanceInput(input.toString());
  };
  const validateText = useMemo(() => {
    const _balance = VeWTFBalance.replace(/\,/g, "");
    const _balanceInput = balanceInput;
    if (compareNum(_balanceInput, _balance, true)) {
      return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
    }
  }, [VeWTFBalance, balanceInput]);
  const handleUnlock = useCallback(async () => {
    if (validateText !== undefined && validateText.length > 0) return;
    if (!account) return;
    if (Number(balanceInput) <= 0) return;

    setLoading(true);
    try {
      await unstake(account, balanceInput);
      // fetchBalance();

      setBalanceInput("0");
      successNotification("Lock & Stake Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [balanceInput, account]);
  return (
    <Wrapper>
      <div>
        <Label>
          <p>{intl.formatMessage({ defaultMessage: "Available unlock" })}</p>
          <span>{VeWTFBalance ? numeral(VeWTFBalance).format("0,0.[0000]") : "-"} Ve-WTF</span>
        </Label>
        <StakeInput
          suffixText="WTF"
          type="number"
          step={0.1}
          min={0}
          onMAX={handleMaxInput}
          value={balanceInput}
          onChange={handleInputChange}
          style={validateText ? { borderColor: tags.redText } : {}}
        />
        {validateText && <ValidateText>{validateText}</ValidateText>}
        <Label css={{ marginTop: 25 }}>
          <div>{intl.formatMessage({ defaultMessage: "Recevied  WTF" })}</div>
          <span>0</span>
        </Label>
        <Label>
          <div>{intl.formatMessage({ defaultMessage: "Burn Ve- WTF" })}</div>
          <span>0</span>
        </Label>
      </div>
      <ButtonWrapper type="primary" onClick={handleUnlock} loading={loading}>
        {intl.formatMessage({ defaultMessage: "Unlock" })}
      </ButtonWrapper>
    </Wrapper>
  );
});

export default injectIntl(Unstake);
