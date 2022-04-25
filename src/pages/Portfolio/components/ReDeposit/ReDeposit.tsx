/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useTheme } from "@emotion/react";
import Modal from "components/Modal/Modal";
import DepositItem from "pages/PortfolioDetails/components/DepositItem";
import { Market } from "types";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";

type TProps = WrappedComponentProps & {
  visible?: boolean;
  onCancel?: (e: boolean) => void;
  data: Market;
  balance: string;
  selectedDepositAssetIndex: number;
  depositMultipleSimultaneous: boolean;
  setSelectedDepositAssetIndex: React.Dispatch<React.SetStateAction<number>>;
  setDepositMultipleSimultaneous: React.Dispatch<React.SetStateAction<boolean>>;
};

const Claim = memo<TProps>(
  ({
    intl,
    visible,
    onCancel,
    data,
    balance,
    selectedDepositAssetIndex,
    depositMultipleSimultaneous,
    setSelectedDepositAssetIndex,
    setDepositMultipleSimultaneous
  }) => {
    const { primary, fonts, white, gray } = useTheme();

    const deposited: BigNumber[] = [];

    const tokens = data.tokens;

    const trancheInvest: { type: "BigNumber"; hex: string }[][] | undefined = data.trancheInvests;

    if (trancheInvest) {
      data.assets.forEach((a, i) =>
        deposited.push(
          trancheInvest
            .reduce((acc: BigNumber, next) => acc.plus(new BigNumber(next[i].hex.toString())), new BigNumber(0))
            .dividedBy(BIG_TEN.pow(18))
        )
      );
    }

    const maxDeposits = tokens.map((t) =>
      new BigNumber(data.totalTranchesTarget).multipliedBy(new BigNumber(t.percent.hex).dividedBy(BIG_TEN.pow(5)))
    );

    const remainingDepositable = new BigNumber(maxDeposits[selectedDepositAssetIndex]).minus(
      deposited[selectedDepositAssetIndex]
    );

    const remainingDepositableSimul = maxDeposits.map((md, i) => new BigNumber(md).minus(deposited[i]));

    return (
      <Modal visible={visible} width={1000} onCancel={onCancel?.bind(null, false)} bodyStyle={{ padding: "20px 34px" }}>
        <title css={{ color: gray.normal, fontWeight: 600, fontSize: 20, marginBottom: 32, textAlign: "center" }}>
          {intl.formatMessage({ defaultMessage: "Roll-deposit" })}
        </title>
        <DepositItem
          isRe={true}
          data={data}
          selectedDepositAssetIndex={selectedDepositAssetIndex}
          redepositBalance={balance}
          remainingDepositable={remainingDepositable}
          depositMultipleSimultaneous={depositMultipleSimultaneous}
          remainingDepositableSimul={remainingDepositableSimul}
          setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
          setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
        />
      </Modal>
    );
  }
);

export default injectIntl(Claim);
