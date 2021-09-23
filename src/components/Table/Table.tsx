/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";

const Table = styled.div`
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
`;

interface ITableRowStyledComponentProps {
  height?: number;
}
const TableRow = styled.ul<ITableRowStyledComponentProps>`
  height: ${({ height }) => height ?? 90}px;
  color: ${({ theme }) => theme.gray.normal7};
  display: flex;
  &:last-child {
    margin-bottom: 0;
  }
  &:first-of-type {
    cursor: initial;
  }

  @media screen and (max-width: 768px) {
    display: grid;
    gap: 17px;
    grid-auto-flow: row;
    height: auto;
  }
`;

interface ITableColumnStyledComponentProps {
  minWidth?: number;
  content?: string;
}

const TableColumn = styled.li<ITableColumnStyledComponentProps>`
  display: flex;
  align-items: center;
  /* justify-content: center; */
  padding: 0 20px;
  white-space: nowrap;
  flex: 1;
  min-width: ${({ minWidth }) => minWidth ?? 120}px;
  width: ${({ minWidth }) => minWidth ?? 120}px;

  @media screen and (max-width: 768px) {
    padding: 0;
    width: 100%;
    align-items: flex-start;
    justify-content: flex-end;
  }
`;

const TableHeaderColumn = styled(TableColumn)`
  :first-of-type {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  :last-child {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  background-color: ${({ theme }) => theme.primary.lightBrown};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export { Table, TableRow, TableColumn, TableHeaderColumn };
