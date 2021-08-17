/** @jsxImportSource @emotion/react */

import React from "react";
import styled from "@emotion/styled";

type TProps = { color?: "red" | "yellow" | "green"; value: String };

const Tag = styled.div`
  border-radius: ${({ theme }) => theme.tags.borderRadius};
  height: 24px;
  line-height: 24px;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  display: inline-flex;
  min-width: 60px;
  justify-content: center;
  &[color="red"] {
    background: ${({ theme }) => theme.tags.redBackground};
    color: ${({ theme }) => theme.tags.redText};
  }

  &[color="yellow"] {
    background: ${({ theme }) => theme.tags.yellowBackground};
    color: ${({ theme }) => theme.tags.yellowText};
  }
  &[color="green"] {
    background: ${({ theme }) => theme.tags.greenBackground};
    color: ${({ theme }) => theme.tags.greenText};
  }
`;
const TagWrapper: React.FC<TProps> = ({ color, value }) => {
  return <Tag color={color}>{value}</Tag>;
};
export default TagWrapper;
