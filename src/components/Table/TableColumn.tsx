/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
interface ITableColumnStyledComponentProps {
  minWidth?: number;
}
const TableColumn = styled.li<ITableColumnStyledComponentProps>`
  flex: 1;
  display: table-cell;
  align-items: center;
  /* justify-content: center; */
  padding: 0 36px;
  white-space: nowrap;
  padding: 20px 10px;
  min-width: ${({ minWidth }) => minWidth ?? 120}px;
  /* font-family: ${({ theme }) => theme.fonts.Nunito}; */
  color: ${({ theme }) => theme.gray.normal85};
  vertical-align: middle;

  font-size: 16px;
  line-height: 22px;
`;

export default TableColumn;
