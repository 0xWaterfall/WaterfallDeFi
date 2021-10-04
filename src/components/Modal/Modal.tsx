/** @jsxImportSource @emotion/react */

import React from "react";
import { Modal as ANTDModal, ModalProps } from "antd";
import { Close } from "assets/images";
import styled from "@emotion/styled";

const ModalWrapper = styled(ANTDModal)`
  .ant-modal-content {
    border-radius: 12px;
  }
  .ant-modal-body {
    padding: 16px 16px 20px;
  }
  .ant-modal-close-x {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

type TProps = ModalProps;
const Modal: React.FC<TProps> = ({ ...props }) => {
  return <ModalWrapper closeIcon={<Close />} {...props} title={null} footer={null} />;
};
export default Modal;
