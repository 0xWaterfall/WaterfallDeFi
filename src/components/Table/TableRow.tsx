/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";

interface ITableRowStyledComponentProps {
  height?: number;
}
const TableRow = styled.ul<ITableRowStyledComponentProps>`
  /* padding: 0 47px; */
  height: ${({ height }) => height ?? 56}px;
  color: ${({ theme }) => theme.gray.normal5};
  background-color: ${({ theme }) => theme.table.rowBackground};
  display: table;
  margin: 10px 0;
  cursor: pointer;
  border: ${({ theme }) => theme.table.border};
  border-style: solid;
  border-radius: ${({ theme }) => theme.table.borderRadius};
  &:last-child {
    margin-bottom: 0;
  }
  &:first-of-type {
    cursor: initial;
  }
`;

export default TableRow;
