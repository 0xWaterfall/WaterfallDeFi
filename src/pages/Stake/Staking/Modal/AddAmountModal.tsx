/** @jsxImportSource @emotion/react */

import { MetaMask } from "assets/images";
import Modal from "components/Modal/Modal";
import React, { memo, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

type TProps = WrappedComponentProps & {
  visible?: boolean;
  onCancel?: (e: boolean) => void;
};

const AddAmountModal = memo<TProps>(({ visible, onCancel, intl }) => {
  return <Modal visible={visible} width={400} onCancel={onCancel?.bind(null, true)}></Modal>;
});

export default injectIntl(AddAmountModal);
