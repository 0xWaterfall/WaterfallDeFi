/** @jsxImportSource @emotion/react */

import Tabs, { TabPane } from "components/Tabs/Tabs";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
// import MyPositions from "./MyPositions";
import Deposit from "./Deposit";
import { Market } from "types";
import SparePositions from "pages/SparePositions";

type TProps = WrappedComponentProps & {
  data: Market;
  selectedDepositAsset: string;
  setSelectedDepositAsset: React.Dispatch<React.SetStateAction<string>>;
  depositMultipleSimultaneous: boolean;
  setDepositMultipleSimultaneous: React.Dispatch<React.SetStateAction<boolean>>;
};

const ContentCD = memo<TProps>(
  ({
    intl,
    data,
    selectedDepositAsset,
    setSelectedDepositAsset,
    depositMultipleSimultaneous,
    setDepositMultipleSimultaneous
  }) => {
    const [activeKey, setActiveKey] = useState<"DEPOSIT" | "POSITIONS">("DEPOSIT");
    const TabTypes = [
      {
        key: "DEPOSIT",
        text: intl.formatMessage({ defaultMessage: "Deposit" }),
        component: (
          <Deposit
            data={data}
            selectedDepositAsset={selectedDepositAsset}
            setSelectedDepositAsset={setSelectedDepositAsset}
            depositMultipleSimultaneous={depositMultipleSimultaneous}
            setDepositMultipleSimultaneous={setDepositMultipleSimultaneous}
          />
        )
      },
      {
        key: "POSITIONS",
        text: intl.formatMessage({ defaultMessage: "My Positions" }),

        component: <SparePositions />
      }
    ];
    return (
      <Tabs
        activeKey={activeKey}
        onChange={(e) => {
          setActiveKey(e as typeof activeKey);
        }}
      >
        {TabTypes.map(({ key, text, component }) => (
          <TabPane tab={text} key={key}>
            {key === activeKey && component}
          </TabPane>
        ))}
      </Tabs>
    );
  }
);

export default injectIntl(ContentCD);
