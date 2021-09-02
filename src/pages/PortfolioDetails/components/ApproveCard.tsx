/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Input, notification } from "antd";
import Button from "components/Button/Button";
import Separator from "components/Separator/Separator";
import { useState } from "react";
import { compareNum, formatBalance, formatNumberSeparator } from "utils/formatNumbers";
import { useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Market } from "types";
import { NotificationApi } from "antd/lib/notification";

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
type TProps = WrappedComponentProps & {
  isRe?: boolean;
  assets: string;
  remaining: string;
  myBalance: string;
  enabled: boolean;
  data: Market;
  selectTrancheIdx?: number;
  fetchMarketData: Function;
};

const ApproveCard = memo<TProps>(
  ({ intl, isRe, assets, remaining, myBalance, enabled, data, selectTrancheIdx, fetchMarketData }) => {
    const [balanceInput, setBalanceInput] = useState(0);
    const [approved, setApproved] = useState(false);
    const [validateText, setValidateText] = useState("");
    const [depositLoading, setDepositLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);
    const { active, account, chainId, ...p } = useWeb3React<Web3Provider>();
    const web3 = new Web3(Web3.givenProvider);
    const contractBUSD = new web3.eth.Contract(data.depositAssetAbi as AbiItem[], data.depositAssetAddress);
    const contractTrancheMaster = new web3.eth.Contract(data.abi as AbiItem[], data.address);
    useEffect(() => {
      const checkApproved = async () => {
        const allowance = await contractBUSD.methods.allowance(account, "0x" + data.address).call();
        console.log(allowance); // > 0
        setApproved(allowance > 0 ? true : false);
      };
      if (account) checkApproved();
    }, [account]);
    useEffect(() => {
      setBalanceInput(0);
    }, [enabled]);
    const openNotification = (title: string, desc: string) => {
      notification["success"]({
        message: title,
        description: desc
      });
    };
    const handleApprove = () => {
      setApproveLoading(true);
      const approve = async () => {
        console.log("start approve");
        try {
          const result = await contractBUSD.methods
            .approve("0x" + data.address, web3.utils.toWei("999999999", "ether"))
            .send({ from: account });
          console.log("start approve2");
          console.log(result);
          if (result.status) {
            setApproved(true);
            openNotification("Approve Success", "");
          }
        } catch (e) {
          console.log(e);
        } finally {
          setApproveLoading(false);
        }
      };
      approve();
    };
    const handleDeposit = () => {
      if (!validateInput()) return;
      const deposit = async () => {
        if (balanceInput <= 0) return;
        if (selectTrancheIdx === undefined) return;

        setDepositLoading(true);
        const amount = web3.utils.toWei(balanceInput.toString(), "ether");
        console.log("amount", amount);
        console.log("invest tranche", selectTrancheIdx);
        // // //deposit
        // const deposit = await contractTrancheMaster.methods.deposit(amount).send({ from: account });
        // console.log(deposit);

        // invest
        try {
          const invest = await contractTrancheMaster.methods
            .investDirect(amount, selectTrancheIdx, amount)
            .send({ from: account });
          console.log(invest);
          fetchMarketData();
          setBalanceInput(0);
          if (invest.status) {
            openNotification("Deposit Success", "");
          }
        } catch (e) {
          console.log(e);
        } finally {
          setDepositLoading(false);
        }

        // if (invest.status) {
        // }
      };
      deposit();
    };
    const handleDeposit100 = () => {
      const deposit = async () => {
        const amount = web3.utils.toWei("100", "ether");
        console.log("amount", amount);
        console.log("invest tranche", selectTrancheIdx);
        // //deposit
        const deposit = await contractTrancheMaster.methods.deposit(amount).send({ from: account });
        console.log(deposit);
      };
      deposit();
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
      if (input == 0) setValidateText("");
      setBalanceInput(input);
    };
    const validateInput = () => {
      // console.log(myBalance);
      const _myBalance = myBalance.replace(/\,/g, "");
      const _remaining = remaining.replace(/\,/g, "");
      const _balanceInput = balanceInput;
      console.log("AAA");
      console.log(_myBalance);
      console.log(_remaining);
      console.log(_balanceInput);
      // console.log("_myBalance", _myBalance);
      if (compareNum(_balanceInput, _myBalance, true)) {
        // if (_balanceInput > _myBalance) {
        console.log("Insufficient balance");
        setValidateText("Insufficient Balance");
        return false;
      }
      if (compareNum(_balanceInput, _remaining, true)) {
        // if (_balanceInput > _remaining) {
        console.log(`Maximum deposit amount = ${remaining}`);
        setValidateText(`Maximum deposit amount = ${remaining}`);
        return false;
      }

      setValidateText("");
      return true;
    };
    return (
      <Container css={{ ...(isRe ? { padding: 24 } : {}) }}>
        {!enabled && <BlockDiv />}
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
                placeholder=""
                value={balanceInput}
                onChange={handleInputChange}
                suffix={<Max onClick={handleMaxInput}>{intl.formatMessage({ defaultMessage: "Max" })}</Max>}
              />
            </div>
            <div>{validateText}</div>
          </div>
        )}
        {approved ? (
          <ButtonDiv>
            <Button type="primary" css={{ height: 56 }} onClick={handleDeposit} loading={depositLoading}>
              {intl.formatMessage({ defaultMessage: "Deposit" })}
            </Button>
          </ButtonDiv>
        ) : (
          <ButtonDiv>
            <Button type="primary" css={{ height: 56 }} onClick={handleApprove} loading={approveLoading}>
              {intl.formatMessage({ defaultMessage: "Approve" })}
            </Button>
          </ButtonDiv>
        )}
        {/* <ButtonDiv>
        <Button type="primary" css={{ height: 56 }} onClick={handleDeposit100}>
          {intl.formatMessage({ defaultMessage: "Deposit 100" })}
        </Button>
      </ButtonDiv> */}
      </Container>
    );
  }
);

export default injectIntl(ApproveCard);
