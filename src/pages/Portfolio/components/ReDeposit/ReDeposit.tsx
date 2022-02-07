/** @jsxImportSource @emotion/react */

import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useTheme } from "@emotion/react";
import Modal from "components/Modal/Modal";
import DepositItem from "pages/PortfolioDetails/components/DepositItem";
import { Market } from "types";
import BigNumber from "bignumber.js";

type TProps = WrappedComponentProps & {
  visible?: boolean;
  onCancel?: (e: boolean) => void;
  data: Market;
  balance: string;
  selectedDepositAsset: string;
  depositMultipleSimultaneous: boolean;
};

const Claim = memo<TProps>(
  ({ intl, visible, onCancel, data, balance, selectedDepositAsset, depositMultipleSimultaneous }) => {
    const { primary, fonts, white, gray } = useTheme();

    return (
      <Modal visible={visible} width={1000} onCancel={onCancel?.bind(null, false)} bodyStyle={{ padding: "20px 34px" }}>
        <title css={{ color: gray.normal, fontWeight: 600, fontSize: 20, marginBottom: 32, textAlign: "center" }}>
          {intl.formatMessage({ defaultMessage: "Roll-deposit" })}
        </title>
        <DepositItem
          isRe={true}
          data={data}
          selectedDepositAsset={selectedDepositAsset}
          redepositBalance={balance}
          //TODO: get the remaining depositable amount of selected token in multicurrency!
          remainingDepositable={new BigNumber(0)}
          depositMultipleSimultaneous={depositMultipleSimultaneous}
        />
      </Modal>
    );
  }
);

export default injectIntl(Claim);
