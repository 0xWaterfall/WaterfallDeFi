/** @jsxImportSource @emotion/react */

import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useTheme } from "@emotion/react";
import Modal from "components/Modal/Modal";
// import DepositItem from "pages/PortfolioDetails/components/DepositItem";
import { Market } from "types";
import Increase from "pages/Stake/Action/Increase";
import Stakings from "config/staking";
import { useStakingPool } from "hooks/useStaking";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useTotalSupply } from "hooks";
import numeral from "numeral";
import styled from "@emotion/styled";

type TProps = WrappedComponentProps & {
  visible?: boolean;
  onCancel?: (e: boolean) => void;
  data: Market;
  balance: string;
  claimReward?: (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => Promise<void>;
};

const Claim = memo<TProps>(({ intl, visible, onCancel, data, balance, claimReward }) => {
  const { primary, fonts, white, gray, dark, useColorModeValue } = useTheme();
  const stakingConfig = Stakings[0];
  const { account } = useWeb3React<Web3Provider>();
  const { rewardPerBlock } = useStakingPool(
    stakingConfig?.rewardTokenAddress || "",
    stakingConfig?.earningTokenAddress || "",
    account
  );

  const VeWTFTotalSupply = useTotalSupply(stakingConfig.earningTokenAddress);

  const _VeWTFTotalSupply = numeral(VeWTFTotalSupply).value() || 0;
  return (
    <Modal
      visible={visible}
      width={1000}
      onCancel={onCancel?.bind(null, false)}
      bodyStyle={{ padding: "20px 34px", backgroundColor: useColorModeValue(gray.normal85, dark.basic) }}
    >
      <title
        css={{
          color: useColorModeValue(gray.normal, white.normal),
          fontWeight: 600,
          fontSize: 20,
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        {intl.formatMessage({ defaultMessage: "Claim" })}
      </title>
      <Increase
        stakingConfig={stakingConfig}
        fromMasterChef={true}
        wtfRewardsBalance={balance}
        claimReward={claimReward}
        rewardPerBlock={rewardPerBlock}
        totalVeWTF={_VeWTFTotalSupply.toString()}
      />
    </Modal>
  );
});

export default injectIntl(Claim);
