/** @jsxImportSource @emotion/react */

import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useTheme } from "@emotion/react";
import Modal from "components/Modal/Modal";
// import DepositItem from "pages/PortfolioDetails/components/DepositItem";
import { Market } from "types";
import Increase from "pages/Stake/Action/Increase";
import Stakings from "config/staking";

type TProps = WrappedComponentProps & {
  visible?: boolean;
  onCancel?: (e: boolean) => void;
  data: Market;
  balance: string;
  claimReward?: (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => Promise<void>;
};

const Claim = memo<TProps>(({ intl, visible, onCancel, data, balance, claimReward }) => {
  const { primary, fonts, white, gray } = useTheme();
  const stakingConfig = Stakings[0];
  return (
    <Modal visible={visible} width={1000} onCancel={onCancel?.bind(null, false)} bodyStyle={{ padding: "20px 34px" }}>
      <title css={{ color: gray.normal, fontWeight: 600, fontSize: 20, marginBottom: 32, textAlign: "center" }}>
        {intl.formatMessage({ defaultMessage: "Claim" })}
      </title>
      <Increase
        stakingConfig={stakingConfig}
        fromMasterChef={true}
        wtfRewardsBalance={balance}
        claimReward={claimReward}
      />
    </Modal>
  );
});

export default injectIntl(Claim);
