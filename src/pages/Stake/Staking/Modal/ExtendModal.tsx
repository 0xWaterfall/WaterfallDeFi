/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { MetaMask } from "assets/images";
import Button from "components/Button/Button";
import DatePicker from "components/DatePicker/DatePicker";
import StakeInput from "components/Input/StakeInput";
import Modal from "components/Modal/Modal";
import SelectTimeLimit from "components/SelectTimeLimit/SelectTimeLimit";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 125%;
  color: ${({ theme }) => theme.gray.normal85};
  padding: 0 32px;
  margin-bottom: 24px;
`;

const ModalWrapper = styled(Modal)`
  .ant-modal-content {
    border-radius: 24px;
  }
  .ant-modal-body {
    padding: 32px 0;
    color: ${({ theme }) => theme.gray.normal7};
  }
  .ant-modal-close-x {
    width: auto;
    height: auto;
    padding: 37px 32px;
  }
`;

const StakingBlock = styled.div`
  padding: 16px 32px;
  background: ${({ theme }) => theme.primary.lightBrown};
  display: flex;
  justify-content: space-between;
  margin-bottom: 26px;
  p {
    font-weight: bold;
    font-size: 20px;
    line-height: 125%;
    color: ${({ theme }) => theme.gray.normal85};
    margin-bottom: 6px;
  }
  span {
    font-size: 14px;
    line-height: 125%;
  }
`;

const Container = styled.div`
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  p {
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.gray.normal85};
    line-height: 21px;
  }
  span {
    font-size: 14px;
  }
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
`;

const ButtonWrapper = styled(Button)`
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 25px;
`;

type TProps = WrappedComponentProps & {
  visible?: boolean;
  onCancel?: (e: boolean) => void;
};

const ExtendModal = memo<TProps>(({ visible, onCancel, intl }) => {
  const [selectedValue, setSelectedValue] = useState<{ value: number; unit?: OpUnitType }>();

  const [datePickerValue, setDatePickerValue] = useState<Dayjs>();

  const newExpireDate = useMemo(() => {
    if (datePickerValue) {
      return datePickerValue;
    }
    if (selectedValue) {
      return dayjs().add(selectedValue.value, selectedValue.unit);
    }
  }, [selectedValue, datePickerValue]);

  const onConfirm = useCallback(() => {
    console.log(newExpireDate?.unix());
  }, [newExpireDate]);

  return (
    <ModalWrapper visible={visible} width={400} onCancel={onCancel?.bind(null, false)}>
      <Title>{intl.formatMessage({ defaultMessage: "Extend" })}</Title>
      <StakingBlock>
        <span>{intl.formatMessage({ defaultMessage: "Staking（Ve-WTF)" })}</span>
        <div>
          <p>1,000,000</p>
          <span>$ 2345.12</span>
        </div>
      </StakingBlock>
      <Container>
        <Label css={{ marginBottom: 15 }}>
          <p>{intl.formatMessage({ defaultMessage: "Period" })}</p>
        </Label>
        <SelectTimeLimit
          onSelected={(e) => {
            setSelectedValue(e);
            setDatePickerValue(undefined);
          }}
          css={{ marginBottom: 20 }}
          reset={Boolean(datePickerValue)}
        />
        <DatePicker
          value={datePickerValue as moment.Moment | undefined}
          onChange={(e) => {
            setDatePickerValue(e as Dayjs);
          }}
        />
        <Label css={{ marginTop: 10 }}>
          <span>
            {intl.formatMessage({
              defaultMessage: "Will extend the lockup period based on your original staking date."
            })}
          </span>
        </Label>
        <Label css={{ marginTop: 26 }}>
          <span>{intl.formatMessage({ defaultMessage: "New expire date" })}</span>
          <span>{newExpireDate ? newExpireDate.format("YYYY-MM-DD") : "--"}</span>
        </Label>
        <Label css={{ marginTop: 20 }}>
          <span>{intl.formatMessage({ defaultMessage: "New Ratio" })}</span>
          <p>100%</p>
        </Label>
        <ButtonWrapper type="primary" onClick={onConfirm}>
          {intl.formatMessage({ defaultMessage: "Confirm" })}
        </ButtonWrapper>
      </Container>
    </ModalWrapper>
  );
});

export default injectIntl(ExtendModal);
