/** @jsxImportSource @emotion/react */

import React from "react";
import { Dropdown as ANTDDropdown, DropDownProps } from "antd";

type TProps = DropDownProps;
const Dropdown: React.FC<TProps> = ({ ...props }) => {
  return <ANTDDropdown {...props} />;
};
export default Dropdown;
