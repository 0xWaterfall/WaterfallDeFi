/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";

const Table = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  overflow-x: auto;
  background-color: ${({ theme }) => theme.primary.lightBrown};
  filter: ${({ theme }) => theme.filter.primary};
`;
interface ITableRowStyledComponentProps {
  height?: number;
}
const TableRow = styled.ul<ITableRowStyledComponentProps>`
  /* padding: 0 47px; */
  height: ${({ height }) => height ?? 56}px;
  color: ${({ theme }) => theme.gray.normal5};
  background-color: ${({ theme }) => theme.white.normal};
  display: flex;
  margin-bottom: 4px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
  &:first-of-type {
    cursor: initial;
  }
`;

interface ITableColumnStyledComponentProps {
  minWidth?: number;
}

const TableColumn = styled.li<ITableColumnStyledComponentProps>`
  flex: 1;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  padding: 0 36px;
  background-color: ${({ theme }) => theme.white.normal};
  white-space: nowrap;
  min-width: ${({ minWidth }) => minWidth ?? 120}px;
`;

export { Table, TableRow, TableColumn };
