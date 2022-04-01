/** @jsxImportSource @emotion/react */

import Modal from "components/Modal/Modal";
import React, { memo, useCallback } from "react";
import styled from "@emotion/styled";
import { CoimpletedIcon, PendingIcon, RejectedIcon, SubmittedIcon } from "assets/images";
import Button from "components/Button/Button";
import { useNetwork, useTransactionModal } from "hooks/useSelectors";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useAppDispatch } from "store";
import { setConfirmModal } from "store/showStatus";
import { Spin } from "styles";
import { BASE_AVAX_SCAN_URL, BASE_BSC_SCAN_URL } from "config";

type TProps = WrappedComponentProps;

const Wrapper = styled.div`
  padding: 105px 106px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 390px;
`;

const Block = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;

  h1 {
    font-size: 18px;
    color: 1px solid ${({ theme }) => theme.gray.normal85};
    margin-bottom: 17px;
  }
  p {
    font-size: 14px;
    color: 1px solid ${({ theme }) => theme.gray.normal85};
    margin-bottom: 16px;
  }
  & > span {
    font-weight: 400;
    font-size: 12px;
    color: ${({ theme }) => theme.gray.normal5};
  }
  a {
    border-bottom: 1px solid ${({ theme }) => theme.primary.deep};
    line-height: 1;
    margin-bottom: 20px;
  }
  button {
    width: 100%;
    height: 44px;
  }
`;

const TransactionModal = memo<TProps>(({ intl }) => {
  const network = useNetwork();
  const payload = useTransactionModal();
  const dispatch = useAppDispatch();

  const handle = useCallback(() => {
    dispatch(setConfirmModal(undefined));
  }, []);

  return (
    <Modal visible={payload?.isOpen} width={428} style={{ top: "25%" }} bodyStyle={{ padding: 0 }} onCancel={handle}>
      {payload?.status === "PENDING" && (
        <Wrapper>
          <PendingIcon
            css={{
              animationName: Spin,
              animationDuration: "1s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite"
            }}
          />
          <Block>
            <h1>{intl.formatMessage({ defaultMessage: "Waiting For Confirmation" })}</h1>
            <p>{payload.pendingMessage}</p>
            <span>{intl.formatMessage({ defaultMessage: "Confirm this transaction in your wallet" })}</span>
          </Block>
        </Wrapper>
      )}

      {payload?.status === "SUBMITTED" && (
        <Wrapper>
          <SubmittedIcon />
          <Block>
            <h1>{intl.formatMessage({ defaultMessage: "Transaction Submitted" })}</h1>
            <a
              href={`${network === "bnb" ? BASE_BSC_SCAN_URL : BASE_AVAX_SCAN_URL}/tx/${payload?.txn}`}
              target="_blank"
              rel="noreferrer"
            >
              {intl.formatMessage({ defaultMessage: "View on Snowtrace" })}
            </a>
            <Button type="primary" onClick={handle}>
              {intl.formatMessage({ defaultMessage: "Close" })}
            </Button>
          </Block>
        </Wrapper>
      )}

      {payload?.status === "COMPLETED" && (
        <Wrapper>
          <CoimpletedIcon />
          <Block>
            <h1>{intl.formatMessage({ defaultMessage: "Transaction Completed" })}</h1>
            <a
              href={`${network === "bnb" ? BASE_BSC_SCAN_URL : BASE_AVAX_SCAN_URL}/tx/${payload?.txn}`}
              target="_blank"
              rel="noreferrer"
            >
              {intl.formatMessage({ defaultMessage: "View on Snowtrace" })}
            </a>
            <Button type="primary" onClick={handle}>
              {intl.formatMessage({ defaultMessage: "Close" })}
            </Button>
          </Block>
        </Wrapper>
      )}

      {payload?.status === "REJECTED" && (
        <Wrapper>
          <RejectedIcon />
          <Block>
            <h1>{intl.formatMessage({ defaultMessage: "Transaction Rejected" })}</h1>
            <Button type="primaryLine" onClick={handle} css={{ marginTop: 20 }}>
              {intl.formatMessage({ defaultMessage: "Dismiss" })}
            </Button>
          </Block>
        </Wrapper>
      )}
    </Modal>
  );
});

export default injectIntl(TransactionModal);
