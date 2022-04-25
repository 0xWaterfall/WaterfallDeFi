/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useMemo, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "components/Button/Button";
import Separator from "components/Separator/Separator";
import { useState } from "react";
import { compareNum, formatNumberSeparator } from "utils/formatNumbers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Market, Tranche } from "types";
import useCheckApprove, { useCheckApproveAll } from "../hooks/useCheckApprove";
import useApprove, { useMultiApprove } from "../hooks/useApprove";
import { successNotification } from "utils/notification";
import useInvestDirect from "../hooks/useInvestDirect";
import useInvest from "../hooks/useInvest";
import useInvestDirectMCSimul from "../hooks/useInvestDirectMCSimul";
import useInvestMCSimul from "../hooks/useInvestMCSimul";
import { useTheme } from "@emotion/react";
import { Union } from "assets/images";
import { useAppDispatch } from "store";
import { setConfirmModal, setConnectWalletModalShow } from "store/showStatus";
import Input from "components/Input/Input";
import { useBalance, useMulticurrencyTrancheBalance, useTrancheBalance } from "hooks";
// import { useTrancheBalance } from "hooks/useSelectors";
import numeral from "numeral";
import { useWrapAVAXContract } from "hooks/useContract";
import { parseEther } from "ethers/lib/utils";

import BigNumber from "bignumber.js";

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
  selectedDepositAsset: string;
  remaining: string;
  remainingExact: string;
  enabled: boolean;
  data: Market;
  selectTrancheIdx?: number;
  isSoldOut: boolean;
  selectTranche: Tranche | undefined;
  depositMultipleSimultaneous: boolean;
  remainingSimul: { remaining: string; remainingExact: string; depositableOrInTranche: string }[];
  setSelectedDepositAsset: React.Dispatch<React.SetStateAction<string>>;
  setDepositMultipleSimultaneous: React.Dispatch<React.SetStateAction<boolean>>;
};

const ApproveCard = memo<TProps>(
  ({
    intl,
    isRe,
    selectedDepositAsset,
    remaining,
    remainingExact,
    enabled,
    data,
    selectTrancheIdx,
    isSoldOut,
    selectTranche,
    depositMultipleSimultaneous,
    remainingSimul,
    setSelectedDepositAsset,
    setDepositMultipleSimultaneous
  }) => {
    const { tags } = useTheme();
    //user inputs
    const [balanceInput, setBalanceInput] = useState<string>("0");
    const [balanceInputSimul, setBalanceInputSimul] = useState<string[]>([]);
    //state flags
    const [approved, setApproved] = useState<boolean>(false);
    const [depositLoading, setDepositLoading] = useState<boolean>(false);
    const [approveLoading, setApproveLoading] = useState<boolean>(false);
    //web3
    const { account } = useWeb3React<Web3Provider>();
    const wrapAvaxContract = useWrapAVAXContract();
    const dispatch = useAppDispatch();
    //deposit hooks
    const depositAddress = !data.isMulticurrency
      ? data.depositAssetAddress
      : data.depositAssetAddresses[data.assets.indexOf(selectedDepositAsset)];
    const { onCheckApprove } = depositAddress
      ? useCheckApprove(depositAddress, data.address)
      : { onCheckApprove: () => false };
    const { onCheckApproveAll } = useCheckApproveAll(data.depositAssetAddresses, data.address);
    const { onApprove } = depositAddress ? useApprove(depositAddress, data.address) : { onApprove: () => false };
    const { onMultiApprove } = useMultiApprove(data.depositAssetAddresses, data.address);
    const { onInvestDirect } = useInvestDirect(
      data.address,
      data.isMulticurrency ? data.assets.indexOf(selectedDepositAsset) : -1,
      data.assets.length,
      data.assets[0] === "USDC"
    );
    const { onInvest } = useInvest(
      data.address,
      data.isMulticurrency ? data.assets.indexOf(selectedDepositAsset) : -1,
      data.assets.length,
      data.assets[0] === "USDC"
    );
    const { onInvestDirectMCSimul } = useInvestDirectMCSimul(data.address);
    const { onInvestMCSimul } = useInvestMCSimul(data.address);

    //balance hooks
    const { balance: balanceWallet, fetchBalance, actualBalance: actualBalanceWallet } = useBalance(depositAddress);
    const multicurrencyBalances = data.depositAssetAddresses.map((address) => useBalance(address));
    const { balance: balanceRe } = useTrancheBalance(data.address, data.isAvax);
    const multicurrencyBalanceRes = data.depositAssetAddresses.map((address, i) =>
      useMulticurrencyTrancheBalance(address, i, data.assets.length)
    );
    const balance =
      isRe === undefined ? numeral(balanceWallet).format("0,0.[0000]") : numeral(balanceRe).format("0,0.[0000]");
    const multicurrencyBalance = data.isMulticurrency
      ? isRe === undefined
        ? numeral(multicurrencyBalances[data.assets.indexOf(selectedDepositAsset)].balance).format("0,0.[0000]")
        : numeral(multicurrencyBalanceRes[data.assets.indexOf(selectedDepositAsset)].balance).format("0,0.[0000]")
      : "";
    const tokenButtonColors = useMemo(
      () =>
        data.assets.map((a) => {
          switch (a) {
            case "BUSD":
              return "#F0B90B";
            case "WAVAX":
              return "#E84142";
            default:
              return "#1579FF";
          }
        }),
      []
    );

    //validation texts
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
    //use effects
    useEffect(() => {
      const checkApproved = async (account: string) => {
        const approved = !depositMultipleSimultaneous ? await onCheckApprove() : await onCheckApproveAll();
        setApproved(approved ? true : false);
      };
      if (account) checkApproved(account);
    }, [account, depositMultipleSimultaneous]);

    useEffect(() => {
      setBalanceInput("0");
      setBalanceInputSimul(data.assets.map(() => "0"));
    }, [enabled]);

    //handlers
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
        !depositMultipleSimultaneous ? await onApprove() : await onMultiApprove();
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
      const _remaining = remainingExact.replace(/\,/g, "");
      const _balanceInput = balanceInput;
      const _balance = !data.isMulticurrency ? balance : multicurrencyBalance;
      if (compareNum(_balanceInput, _balance, true)) {
        if (!data.wrapAvax) return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
      }
      if (compareNum(_balanceInput, _remaining, true)) {
        return intl.formatMessage({ defaultMessage: "Maximum deposit amount = {remaining}" }, { remaining: remaining });
      }
    }, [balance, multicurrencyBalance, remaining, remainingExact, balanceInput]);

    const validateTextSimul = useMemo(() => {
      if (depositMultipleSimultaneous) {
        const _remainings = remainingSimul.map((r) => r.remainingExact.replace(/\,/g, ""));
        const _balanceInputs = balanceInputSimul;
        const _balances = multicurrencyBalances;
        const _sum: BigNumber = balanceInputSimul.reduce(
          (acc, next) => acc.plus(new BigNumber(next)),
          new BigNumber(0)
        );
        const validateTexts = _balanceInputs.map((b, i) => {
          if (compareNum(b, _balances[i].balance, true)) {
            return intl.formatMessage({ defaultMessage: "Insufficient Balance" });
          }
          if (compareNum(b, _remainings[i], true)) {
            return intl.formatMessage(
              { defaultMessage: "Maximum deposit amount = {remaining}" },
              { remaining: remaining }
            );
          }
          if (
            remainingSimul[i].depositableOrInTranche === "inTranche" &&
            compareNum(_sum.toString(), _remainings[i], true)
          ) {
            return intl.formatMessage({ defaultMessage: "Total deposit amount exceeds tranche allowance" });
          }
        });
        return validateTexts;
      } else return [];
    }, [depositMultipleSimultaneous, remainingSimul, balanceInputSimul, multicurrencyBalances]);

    const handleWrapAvax = async () => {
      setDepositLoading(true);
      const amount = balanceInput.toString();
      if (data.wrapAvax && Number(balance) < Number(amount)) {
        //^ breaking this case will never happen but just for safety
        await wrapAvaxContract.deposit({ value: parseEther((Number(amount) - Number(balance)).toString()) });
        setDepositLoading(false);
      }
    };

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
          pendingMessage:
            intl.formatMessage({ defaultMessage: "Depositing " }) + " " + balanceInput + " " + selectedDepositAsset
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
        !data.isMulticurrency
          ? fetchBalance()
          : multicurrencyBalances[data.assets.indexOf(selectedDepositAsset)].fetchBalance();
        // if (account) dispatch(getTrancheBalance({ account }));
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

    const handleDepositSimul = async () => {
      const _invalids: boolean[] = validateTextSimul && validateTextSimul.map((v) => (v ? v.length > 0 : false));
      if (_invalids.some((v) => v)) return;
      const _invalids2: boolean[] = balanceInputSimul.map((b) => Number(b) < 0);
      if (_invalids2.some((v) => v)) return;
      if (selectTrancheIdx === undefined) return;

      setDepositLoading(true);
      dispatch(
        setConfirmModal({
          isOpen: true,
          txn: undefined,
          status: "PENDING",
          pendingMessage: balanceInputSimul
            .map(
              (b) => intl.formatMessage({ defaultMessage: "Depositing " }) + " " + b + " " + selectedDepositAsset + ", "
            )
            .join()
        })
      );
      const _amount = balanceInputSimul; //feels like .toString() is unnecessary if it's already typed? - 0xA
      try {
        const success = !isRe
          ? await onInvestDirectMCSimul(_amount, selectTrancheIdx.toString())
          : await onInvestMCSimul(_amount, selectTrancheIdx.toString());
        if (success) {
          successNotification("Deposit Success", "");
        } else {
          successNotification("Deposit Fail", "");
        }
        setDepositLoading(false);
        setBalanceInputSimul([]);
        multicurrencyBalances[data.assets.indexOf(selectedDepositAsset)].fetchBalance();
      } catch (e) {
        dispatch(
          setConfirmModal({
            isOpen: true,
            txn: undefined,
            status: "REJECTED",
            pendingMessage: intl.formatMessage({ defaultMessage: "Deposit Fail " })
          })
        );
        console.error(e);
      } finally {
        setDepositLoading(false);
      }
    };

    const handleMaxInput = () => {
      const _balance = !data.isMulticurrency
        ? actualBalanceWallet.replace(/\,/g, "")
        : multicurrencyBalance.replace(/\,/g, "");
      const _remaining = remainingExact.replace(/\,/g, "");
      if (data.wrapAvax) {
        if (_remaining) setBalanceInput(_remaining);
      } else {
        if (compareNum(_remaining, _balance)) {
          if (_balance) setBalanceInput(!data.isMulticurrency ? actualBalanceWallet : multicurrencyBalance);
        } else if (compareNum(_balance, _remaining, true)) {
          if (_remaining) setBalanceInput(_remaining);
        }
      }
    };

    const handleMaxInputSimul = (index: number) => {
      const _balance = multicurrencyBalances[index].balance.replace(/\,/g, "");
      const _remaining = remainingSimul[index].remaining.replace(/\,/g, "");
      const balanceInputSimulCopy = [...balanceInputSimul];
      if (compareNum(_remaining, _balance)) {
        if (_balance) {
          balanceInputSimulCopy[index] = _balance;
          setBalanceInputSimul(balanceInputSimulCopy);
        }
      } else if (compareNum(_balance, _remaining, true)) {
        if (_remaining) {
          if (remainingSimul[index].depositableOrInTranche === "inTranche") {
            const _sum: BigNumber = balanceInputSimulCopy.reduce(
              (acc, next, i) => (i !== index ? acc.plus(new BigNumber(next)) : acc),
              new BigNumber(0)
            );
            const _remainingInTranche = new BigNumber(_remaining).minus(_sum).toString();
            balanceInputSimulCopy[index] = _remainingInTranche;
            setBalanceInputSimul(balanceInputSimulCopy);
          } else {
            balanceInputSimulCopy[index] = _remaining;
            setBalanceInputSimul(balanceInputSimulCopy);
          }
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
      const { value } = e.target;
      if (value.match("^[0-9]*[.]?[0-9]*$") != null) {
        const d = value.split(".");
        if (d.length === 2 && d[1].length > (data.assets[0] !== "USDC" ? 18 : 6)) {
          return;
        }
        const _input1 = d[0].length > 1 ? d[0].replace(/^0+/, "") : d[0];
        const _decimal = value.includes(".") ? "." : "";
        const _input2 = d[1]?.length > 0 ? d[1] : "";
        if (index !== undefined) {
          const balanceInputSimulCopy = [...balanceInputSimul];
          balanceInputSimulCopy[index] = _input1 + _decimal + _input2;
          setBalanceInputSimul(balanceInputSimulCopy);
        } else {
          setBalanceInput(_input1 + _decimal + _input2);
        }
      }
    };

    const HandleDepositButton = () => (
      <ButtonDiv>
        <Button
          type="primary"
          css={{ height: 56 }}
          onClick={() => (!depositMultipleSimultaneous ? handleDeposit() : handleDepositSimul())}
          loading={depositLoading}
          disabled={!enabled || isSoldOut || !balanceInput || data?.isRetired}
        >
          {intl.formatMessage({ defaultMessage: "Deposit" })}
        </Button>
      </ButtonDiv>
    );

    return (
      <Container css={{ ...(isRe ? { padding: 24 } : {}) }}>
        {!depositMultipleSimultaneous ? (
          <>
            <RowDiv>
              <div>
                {isRe
                  ? intl.formatMessage({ defaultMessage: "Total Roll-deposit Amount" })
                  : intl.formatMessage({ defaultMessage: "Wallet Balance" })}
                :
              </div>
              <div>
                {formatNumberSeparator(!data.isMulticurrency ? balance : multicurrencyBalance)} {selectedDepositAsset}
              </div>
            </RowDiv>
            <RowDiv>
              <div>{intl.formatMessage({ defaultMessage: "Remaining" })}:</div>
              <div>
                {formatNumberSeparator(remaining)} {selectedDepositAsset}
              </div>
            </RowDiv>
            {data.wrapAvax &&
            balanceInput &&
            Number(balanceInput) > 0 &&
            Number(balanceInput.toString()) - Number(balance) > 0 ? (
              <RowDiv>
                <div>{intl.formatMessage({ defaultMessage: "AVAX Wrapped On Deposit:" })}</div>
                <div>
                  {formatNumberSeparator((Number(balanceInput.toString()) - Number(balance)).toString())} AVAX to WAVAX
                </div>
              </RowDiv>
            ) : null}
            <Separator />
            <RowDiv>
              {data.isMulticurrency ? (
                <div css={{ display: "flex" }}>
                  {data.assets.map((a, i) => (
                    <Button
                      key={a}
                      css={{
                        color: tokenButtonColors[i],
                        fontWeight: 400,
                        marginRight: 15
                      }}
                      disabled={selectedDepositAsset === a}
                      onClick={() => setSelectedDepositAsset(a)}
                    >
                      {a}
                    </Button>
                  ))}
                  <Button css={{ color: "#1579FF" }} onClick={() => setDepositMultipleSimultaneous(true)}>
                    Multi
                  </Button>
                </div>
              ) : (
                <div></div>
              )}
              <div css={{ color: tokenButtonColors[data.assets.indexOf(selectedDepositAsset)] }}>
                {selectedDepositAsset}
              </div>
            </RowDiv>
            <div>
              <Input
                // type="number"
                style={!depositLoading && validateText ? { borderColor: tags.redText } : {}}
                placeholder=""
                // step={0.1}
                // min={0}
                value={balanceInput}
                onChange={handleInputChange}
                suffix={<Max onClick={handleMaxInput}>{intl.formatMessage({ defaultMessage: "MAX" })}</Max>}
                disabled={!enabled || isSoldOut}
              />
            </div>
            <ValidateText>{!depositLoading && validateText}</ValidateText>
            {data.wrapAvax && Number(balanceInput.toString()) - Number(balance) > 0 ? (
              <ValidateText>
                Please make sure you have enough AVAX to wrap, or else the transaction will fail!
              </ValidateText>
            ) : null}
          </>
        ) : null}

        {data.isMulticurrency && depositMultipleSimultaneous
          ? data.assets.map((asset, index) => (
              <div key={asset}>
                <div css={{ marginTop: index !== 0 ? 50 : 0 }}>
                  <RowDiv>
                    <div>
                      {isRe
                        ? intl.formatMessage({ defaultMessage: "Total Roll-deposit Amount" })
                        : intl.formatMessage({ defaultMessage: "Wallet Balance" })}
                      :
                    </div>
                    <div>
                      {formatNumberSeparator(numeral(multicurrencyBalances[index].balance).format("0,0.[0000]"))}{" "}
                      {asset}
                    </div>
                  </RowDiv>
                  <RowDiv>
                    <div>{intl.formatMessage({ defaultMessage: "Remaining" })}:</div>
                    <div>
                      {formatNumberSeparator(remainingSimul[index].remaining)} {asset}
                    </div>
                  </RowDiv>
                  <RowDiv>
                    <div>{asset}</div>
                  </RowDiv>
                  <Input
                    style={!depositLoading && validateText ? { borderColor: tags.redText } : {}}
                    placeholder=""
                    value={balanceInputSimul[index]}
                    onChange={(e) => {
                      handleInputChange(e, index);
                    }}
                    suffix={
                      <Max onClick={() => handleMaxInputSimul(index)}>
                        {intl.formatMessage({ defaultMessage: "MAX" })}
                      </Max>
                    }
                    disabled={!enabled || isSoldOut} //xyzzy
                  />
                </div>
                <ValidateText>{!depositLoading && validateTextSimul[index]}</ValidateText>
              </div>
            ))
          : null}

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
            !data.wrapAvax ? (
              <HandleDepositButton />
            ) : !(Number(balanceInput.toString()) - Number(balance) > 0) ? (
              <HandleDepositButton />
            ) : (
              <ButtonDiv>
                <Button
                  type="primary"
                  css={{ height: 56 }}
                  onClick={handleWrapAvax}
                  loading={depositLoading} //reusing this flag
                  disabled={data?.isRetired}
                >
                  {intl.formatMessage({ defaultMessage: "Wrap AVAX" })}
                </Button>
              </ButtonDiv>
            )
          ) : (
            <ButtonDiv>
              <Button
                type="primary"
                css={{ height: 56 }}
                onClick={handleApprove}
                loading={approveLoading}
                disabled={data?.isRetired}
              >
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
            {selectTrancheIdx === 0 || (data.trancheCount === 3 && selectTrancheIdx === 1)
              ? "Withdrawal Fee: All principal + yield of the current cycle * "
              : "Withdrawal Fee: All yield of the current cycle * "}
            <span>{selectTranche && selectTranche.fee + "%"}</span>
          </RedemptionFee>
        )}
      </Container>
    );
  }
);

export default injectIntl(ApproveCard);
