/** @jsxImportSource @emotion/react */

// import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useWeb3React } from "@web3-react/core";
import Button from "components/Button/Button";
import { useBalance } from "hooks";
import numeral from "numeral";
import useUnstake from "pages/Stake/hooks/useUnstake";
import { memo, useCallback, useMemo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { StakingConfig } from "types";
import { successNotification } from "utils/notification";
import { Web3Provider } from "@ethersproject/providers";
import { useGetLockingWTF } from "../hooks/useGetLockingWTF";

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
  margin-bottom: 12px;
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
  margin-top: 158px;
`;
// const ValidateText = styled.div`
//   font-size: 12px;
//   line-height: 125%;
//   letter-spacing: -0.015em;
//   color: ${({ theme }) => theme.tags.redText};
//   margin-top: 4px;
//   min-height: 15px;
// `;

// const MAX = styled.div`
//   font-size: 14px;
//   line-height: 125%;
//   color: ${({ theme }) => theme.primary.deep};
//   cursor: pointer;
// `;

type TProps = WrappedComponentProps & {
  stakingConfig: StakingConfig;
};
const Unstake = memo<TProps>(({ intl, stakingConfig }) => {
  // const { tags } = useTheme();
  const { account } = useWeb3React<Web3Provider>();
  const { balance: VeWTFBalance } = useBalance(stakingConfig.earningTokenAddress);
  const { total: lockingWTF, expiryTimestamp } = useGetLockingWTF(account);

  const [balanceInput, setBalanceInput] = useState("0");
  const [loading, setLoading] = useState(false);
  const { unstake } = useUnstake();

  const isExpired = useMemo(() => {
    const timeNow = Math.floor(Date.now() / 1000);
    if (expiryTimestamp === "0") return false;
    return Number(expiryTimestamp) <= timeNow;
  }, [expiryTimestamp]);
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   if (value.match("^[0-9]*[.]?[0-9]*$") != null) {
  //     const d = value.split(".");
  //     if (d.length === 2 && d[1].length > 18) {
  //       return;
  //     }

  //     const _input1 = d[0].length > 1 ? d[0].replace(/^0+/, "") : d[0];
  //     const _decimal = value.includes(".") ? "." : "";
  //     const _input2 = d[1]?.length > 0 ? d[1] : "";
  //     setBalanceInput(_input1 + _decimal + _input2);
  //   }
  // };
  // const handleMaxInput = () => {
  //   const _balance = VeWTFBalance.replace(/\,/g, "");
  //   // const _remaining = remaining.replace(/\,/g, "");
  //   const input = parseFloat(_balance);

  //   if (input) setBalanceInput(input.toString());
  // };
  // const validateText = useMemo(() => {
  //   const _balance = VeWTFBalance.replace(/\,/g, "");
  //   const _balanceInput = balanceInput;
  //   if (compareNum(_balanceInput, _balance, true)) {
  //     return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
  //   }
  // }, [VeWTFBalance, balanceInput]);
  const handleUnlock = useCallback(async () => {
    // if (validateText !== undefined && validateText.length > 0) return;
    if (!account) return;
    // if (Number(balanceInput) <= 0) return;

    setLoading(true);
    try {
      await unstake(account);
      // fetchBalance();

      setBalanceInput("0");
      successNotification("Unstake Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [account]);
  return (
    <Wrapper>
      <div>
        <Label>
          <p>
            {intl.formatMessage({ defaultMessage: "Available unlock" })}:{" "}
            <span>{VeWTFBalance ? numeral(VeWTFBalance).format("0,0.[0000]") : "-"}</span>
          </p>
          {/* <MAX onClick={handleMaxInput}>{intl.formatMessage({ defaultMessage: "MAX" })}</MAX> */}
        </Label>
        {/* <StakeInput
          suffixText="WTF"
          type="number"
          step={0.1}
          min={0}
          value={balanceInput}
          onChange={handleInputChange}
          style={validateText ? { borderColor: tags.redText } : {}}
        />
        {validateText && <ValidateText>{validateText}</ValidateText>} */}

        <Label css={{ marginTop: 24 }}>
          <p>{intl.formatMessage({ defaultMessage: "Burning veWTF" })}</p>
          <span>{VeWTFBalance}</span>
        </Label>
        <Label>
          <p>{intl.formatMessage({ defaultMessage: "Receiving WTF" })}</p>
          <span>{lockingWTF}</span>
        </Label>
      </div>
      <ButtonWrapper type="primary" onClick={handleUnlock} loading={loading} disabled={!isExpired}>
        {intl.formatMessage({ defaultMessage: "Unlock" })}
      </ButtonWrapper>
    </Wrapper>
  );
});

export default injectIntl(Unstake);
