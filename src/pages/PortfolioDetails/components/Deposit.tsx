/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Mountain } from "assets/images";
import { Row, Col } from "antd";
import TranchesCard from "./TranchesCard";
import ApproveCard from "./ApproveCard";
import { useTheme } from "@emotion/react";

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
  width: calc(100% - 20px);
  height: calc(33% - 12px);
`;
const Box2 = styled.div`
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
  width: calc(100% - 20px);
  height: 100%;
  @media screen and (max-width: 768px) {
    margin: 20px 0px;
    height: auto;
  }
`;

const TranchesCol = styled(Col)`
  height: 600px;
  & > div:nth-of-type(2) {
    margin: 20px 0;
  }
`;
const Deposit = memo<TProps>(({ intl }) => {
  const { primary } = useTheme();
  return (
    <div>
      <NextTimeWrapper>
        <Mountain />
        <Text1>{intl.formatMessage({ defaultMessage: "Next Cycle" })}: 2021/08/07</Text1>
        <Text2>{intl.formatMessage({ defaultMessage: "Active Cycle" })}: 2021/07/01-2021/07/08</Text2>
      </NextTimeWrapper>
      <Row>
        <TranchesCol md={8} xs={23} offset={1}>
          <Box>
            <TranchesCard type="Junior" />
          </Box>
          <Box>
            <TranchesCard type="Mezzanine" />
          </Box>
          <Box>
            <TranchesCard type="Senior" />
          </Box>
        </TranchesCol>
        <Col md={14} xs={23} offset={1}>
          <Box2>
            <ApproveCard />
          </Box2>
        </Col>
      </Row>
    </div>
  );
});

export default injectIntl(Deposit);
