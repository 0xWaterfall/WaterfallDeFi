/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useTheme } from "@emotion/react";
import Modal from "components/Modal/Modal";
import DepositItem from "pages/PortfolioDetails/components/DepositItem";
import { Market } from "types";

type TProps = WrappedComponentProps & {
  visible?: boolean;
  onCancel?: (e: boolean) => void;
  data: Market;
  balance: string;
};

const Claim = memo<TProps>(({ intl, visible, onCancel, data, balance }) => {
  const { primary, fonts, white, gray } = useTheme();

  return (
    <Modal visible={visible} width={1000} onCancel={onCancel?.bind(null, false)} bodyStyle={{ padding: "20px 34px" }}>
      <title css={{ color: gray.normal, fontWeight: 600, fontSize: 20, marginBottom: 32, textAlign: "center" }}>
        {intl.formatMessage({ defaultMessage: "Roll-deposit" })}
      </title>
      <DepositItem isRe={true} data={data} redepositBalance={balance} />
    </Modal>
  );
});

export default injectIntl(Claim);
