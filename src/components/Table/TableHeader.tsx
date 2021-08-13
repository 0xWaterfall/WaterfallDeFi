/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";

const TableHeader = styled.div`
  width: 100%;
  display: table-row;
  background-color: ${({ theme }) => theme.table.theadBackground};
  filter: ${({ theme }) => theme.filter.primary};
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.gray.normal7};
  & li:first-child {
    border-top-left-radius: ${({ theme }) => theme.table.borderRadius};
    border-bottom-left-radius: ${({ theme }) => theme.table.borderRadius};
  }
  & li:last-child {
    border-top-right-radius: ${({ theme }) => theme.table.borderRadius};
    border-bottom-right-radius: ${({ theme }) => theme.table.borderRadius};
  }
`;

export default TableHeader;
