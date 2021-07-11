/** @jsxImportSource @emotion/react */

import React from "react";
import { Modal as ANTDModal, ModalProps } from "antd";
import { Close } from "assets/images";

type TProps = ModalProps;
const Modal: React.FC<TProps> = ({ className, ...props }) => {
  return (
    <ANTDModal
      css={{
        "&>.ant-modal-content": {
          borderRadius: 12,
          ".ant-modal-close-x": {
            padding: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          ".ant-modal-body": {
            padding: "16px 16px 20px"
          }
        },
        className
      }}
      closeIcon={<Close />}
      {...props}
      title={null}
      footer={null}
    />
  );
};
export default Modal;
