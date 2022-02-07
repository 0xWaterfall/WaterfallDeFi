/** @jsxImportSource @emotion/react */

import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useTheme } from "@emotion/react";
import Modal from "components/Modal/Modal";
import DepositItem from "pages/PortfolioDetails/components/DepositItem";
import { Market } from "types";
import BigNumber from "bignumber.js";
import { useMulticurrencyDepositableTokens, useMulticurrencyTrancheInvest } from "hooks";

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

    const deposited: BigNumber[] = [];

    const tokens: { addr: string; strategy: string; percent: any }[] = data.isMulticurrency
      ? useMulticurrencyDepositableTokens(data.address, data.assets.length)
      : [];

    const trancheInvest = data.isMulticurrency
      ? useMulticurrencyTrancheInvest(data.address, data.cycle, data.depositAssetAddresses, data.tranches.length)
      : [];

    data.assets.forEach((a, i) =>
      deposited.push(
        trancheInvest.reduce((acc: BigNumber, next) => acc.plus(new BigNumber(next[i].toString())), new BigNumber(0))
      )
    );

    const maxDeposits = tokens.map((t, i) => Number(data.totalTranchesTarget) * Number(tokens[i].percent));

    const remainingDepositable = new BigNumber(maxDeposits[data.assets.indexOf(selectedDepositAsset)]).minus(
      deposited[data.assets.indexOf(selectedDepositAsset)]
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
          selectedDepositAsset={selectedDepositAsset}
          redepositBalance={balance}
          remainingDepositable={remainingDepositable}
          depositMultipleSimultaneous={depositMultipleSimultaneous}
          remainingDepositableSimul={remainingDepositableSimul}
        />
      </Modal>
    );
  }
);

export default injectIntl(Claim);
