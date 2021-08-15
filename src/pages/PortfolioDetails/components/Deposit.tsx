/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Star } from "assets/images";
import { Table, TableColumn, TableRow } from "components/Table/Table";
import { size } from "lodash";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import { Mountain } from "assets/images";
import { Row, Col } from "antd";
import TranchesCard from "./TranchesCard";

type TProps = WrappedComponentProps;
const Text1 = styled.div`
  font-size: 20px;
  line-height: 27px;
  color: ${({ theme }) => theme.primary.deep};
`;
const NextTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
`;

const Text2 = styled.div`
  font-size: 20px;
  line-height: 27px;
  color: ${({ theme }) => theme.gray.normal85};
`;
const Box = styled.div`
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
`;
const Deposit = memo<TProps>(({ intl }) => {
  const { push } = useHistory();

  return (
    <div>
      <NextTimeWrapper>
        <Mountain />
        <Text1>Next time: 2021/08/07</Text1>
        <Text2>Active cycle: 2021/07/01-2021/07/08</Text2>
      </NextTimeWrapper>
      <Row>
        <Col md={8}>
          <Box>
            <TranchesCard color="red" />
          </Box>
          <Box>
            <TranchesCard color="red" />
          </Box>
          <Box>
            <TranchesCard color="red" />
          </Box>
        </Col>
        <Col md={16}>
          <Box css={{ height: "100%" }}></Box>
        </Col>
      </Row>
    </div>
  );
});

export default injectIntl(Deposit);
