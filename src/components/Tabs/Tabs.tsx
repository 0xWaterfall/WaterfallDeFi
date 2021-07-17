/** @jsxImportSource @emotion/react */

import React from "react";
import { Tabs as ANTDTabs, TabsProps } from "antd";
const { TabPane } = ANTDTabs;
type TProps = TabsProps;
const Tabs: React.FC<TProps> = ({ className, children, ...props }) => {
  return <ANTDTabs {...props}>{children}</ANTDTabs>;
};
export default Tabs;
export { TabPane };
