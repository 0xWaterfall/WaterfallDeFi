/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";

const TableWrapper = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  overflow-x: auto;
  background-color: transparent;
  filter: ${({ theme }) => theme.filter.primary};
`;

export default TableWrapper;
