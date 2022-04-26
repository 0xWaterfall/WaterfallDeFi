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
        </Label>

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
