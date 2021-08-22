/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Input } from "antd";
import Button from "components/Button/Button";
import Separator from "components/Separator/Separator";
type TProps = WrappedComponentProps;
const RowDiv = styled.div`
  font-size: 20px;
  line-height: 27px;
  color: ${({ theme }) => theme.gray.normal7};
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  & > div:nth-of-type(2) {
    font-size: 24px;
    line-height: 33px;
  }
`;
const Container = styled.div`
  position: relative;
  border: ${({ theme }) => theme.table.border};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
  padding: 77px 81px;

  & input {
    color: ${({ theme }) => theme.primary.normal};
    font-size: 24px;
    line-height: 33px;
  }
  @media screen and (max-width: 675px) {
    padding: 24px;
  }
`;
const Max = styled.div`
  color: ${({ theme }) => theme.primary.normal};
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  display: flex;
  align-items: center;
  width: 45px;
  height: 27px;
  cursor: pointer;
`;
const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  & button {
    width: 100%;
  }
  @media screen and (min-width: 1024px) {
    & button {
      max-width: 300px;
    }
  }
`;
const ApproveCard = memo<TProps>(({ intl }) => {
  return (
    <Container>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Wallet Balance" })}</div>
        <div>10,000 USDC</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Remaining" })}</div>
        <div>--</div>
      </RowDiv>
      <Separator />
      <RowDiv>
        <div>USDC</div>
      </RowDiv>
      <div>
        <Input placeholder="" defaultValue={0} suffix={<Max>{intl.formatMessage({ defaultMessage: "Max" })}</Max>} />
      </div>
      <ButtonDiv>
        <Button type="primary">{intl.formatMessage({ defaultMessage: "Close Deposit" })}</Button>
      </ButtonDiv>
    </Container>
  );
});

export default injectIntl(ApproveCard);
