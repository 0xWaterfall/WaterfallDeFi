/** @jsxImportSource @emotion/react */

import React from "react";
import { Drawer as ANTDDrawer, DrawerProps } from "antd";
import { useTheme } from "@emotion/react";

type TProps = Overwrite<DrawerProps, { onClose: (e: boolean) => void }>;

const Drawer: React.FC<TProps> = ({ maskStyle, bodyStyle, onClose, ...props }) => {
  const { gray } = useTheme();
  return (
    <ANTDDrawer
      maskStyle={{
        backgroundColor: gray.normal5,
        ...maskStyle
      }}
      bodyStyle={{ padding: 0, ...bodyStyle }}
      onClose={onClose.bind(null, false)}
      {...props}
    />
  );
};
export default Drawer;
