/** @jsxImportSource @emotion/react */

import Modal from "components/Modal/Modal";
import React, { memo, useCallback } from "react";
import styled from "@emotion/styled";
import { TxConfirmImg } from "assets/images";
import Button from "components/Button/Button";
import { useConfirmModal } from "hooks/useSelectors";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useAppDispatch } from "store";
import { setConfirmModal } from "store/showStatus";

type TProps = WrappedComponentProps;

const Wrapper = styled.div`
  padding: 105px 105px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-weight: 500;
    font-size: 16px;
    color: 1px solid ${({ theme }) => theme.gray.normal85};
    margin-top: 50px;
  }
  a {
    border-bottom: 1px solid ${({ theme }) => theme.primary.deep};
    line-height: 1;
    margin: 13px 0 20px;
  }
  button {
    width: 100%;
  }
`;

const TxConfirm = memo<TProps>(({ intl }) => {
  const r = useConfirmModal();
  const dispatch = useAppDispatch();

  const handle = useCallback(() => {
    dispatch(setConfirmModal(undefined));
  }, []);
  return (
    <Modal visible={r?.isOpen} width={428} style={{ top: "25%" }} onCancel={handle}>
      <Wrapper>
        <TxConfirmImg />
        <h1>{intl.formatMessage({ defaultMessage: "Completed" })}</h1>
        <a href={r?.tx} target="_blank" rel="noreferrer">
          {intl.formatMessage({ defaultMessage: "View on Bscscan" })}
        </a>
        <Button type="primary" onClick={handle}>
          {intl.formatMessage({ defaultMessage: "Close" })}
        </Button>
      </Wrapper>
    </Modal>
  );
});

export default injectIntl(TxConfirm);
