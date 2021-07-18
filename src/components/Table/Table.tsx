/** @jsxImportSource @emotion/react */

import React from "react";
import { ClassNames, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

const TableStyled = styled.table`
  width: 100%;
  border-radius: 12px;
  filter: ${({ theme }) => theme.filter.primary};
`;

const TheadStyled = styled.thead`
  padding: 0 47px;
  height: 56px;
  color: ${({ theme }) => theme.gray.normal5};
`;

const ThStyled = styled.th`
  display: flex;
  align-items: "center";
`;

const TbodyStyled = styled.tbody`
  padding: 0 47px;
`;

const TrStyled = styled.tr`
  height: 90px;
`;

const TdStyled = styled.td``;

type TProps = React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;

const Table: React.FC<TProps> = ({ ...props }) => {
  const { white, gray } = useTheme();
  return (
    <TableStyled>
      <TheadStyled>
        <ThStyled>The table header</ThStyled>
      </TheadStyled>
      <TbodyStyled>
        <TrStyled>
          <TdStyled>The table body</TdStyled>
          <TdStyled>with two columns</TdStyled>
        </TrStyled>
      </TbodyStyled>
    </TableStyled>
  );
};
export default Table;
