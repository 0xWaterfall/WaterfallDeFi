/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Union } from "assets/images";
import Button from "components/Button/Button";
import DatePicker from "components/DatePicker/DatePicker";
import StakeInput from "components/Input/StakeInput";
import SelectTimeLimit, { Block } from "components/SelectTimeLimit/SelectTimeLimit";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import React, { memo, useCallback, useMemo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div`
  padding: 32px 50px;
  background: ${({ theme }) => theme.white.normal5};
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.02));
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.gray.normal85};
  @media screen and (max-width: 768px) {
    padding: 32px;
  }
`;

const Title = styled.div`
  font-size: 24px;
  line-height: 125%;
`;

const Line = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.gray.normal08};
  margin: 20px 0;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  p {
    color: ${({ theme }) => theme.gray.normal7};
    font-size: 16px;
    line-height: 125%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
  }

  div {
    font-size: 14px;
    line-height: 18px;
    display: grid;
    gap: 5px;
    grid-auto-flow: column;
    align-items: center;
  }
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 55px;
`;

type TProps = WrappedComponentProps;

const LockUp = memo<TProps>(({ intl }) => {
  const [isDatePickerShow, setDatePickerShow] = useState(false);

  const [selectedValue, setSelectedValue] = useState<{ value: number; unit?: OpUnitType }>();

  const [datePickerValue, setDatePickerValue] = useState<Dayjs>();

  const newExpireDate = useMemo(() => {
    if (isDatePickerShow) {
      return datePickerValue;
    } else if (selectedValue) {
      return dayjs().add(selectedValue.value, selectedValue.unit);
    }
  }, [selectedValue, datePickerValue, isDatePickerShow]);

  const onConfirm = useCallback(() => {
    console.log(newExpireDate?.unix());
  }, [newExpireDate]);

  return (
    <Wrapper>
      <Title>{intl.formatMessage({ defaultMessage: "Lock-up" })}</Title>
      <Line />
      <Label>
        <p>{intl.formatMessage({ defaultMessage: "WTF balance" })}</p>
        <span>0 Ve-WTF</span>
      </Label>
      <StakeInput
        suffixText="WTF"
        onMAX={() => {
          console.log(1);
        }}
      />
      <Label css={{ margin: "16px 0 10px" }}>
        <p>{intl.formatMessage({ defaultMessage: "Choose a period" })}</p>
      </Label>

      <SelectTimeLimit
        onSelected={(e) => {
          setSelectedValue(e);
          setDatePickerShow(false);
        }}
        css={{ marginBottom: 17 }}
        reset={isDatePickerShow}
        suffixRender={
          <Block
            data-actived={isDatePickerShow}
            onClick={() => {
              setDatePickerShow(true);
            }}
          >
            {intl.formatMessage({ defaultMessage: "Custom" })}
          </Block>
        }
      />

      {isDatePickerShow && (
        <DatePicker
          style={{ marginBottom: 19 }}
          value={datePickerValue as moment.Moment | undefined}
          onChange={(e) => {
            setDatePickerValue(e as Dayjs);
          }}
        />
      )}

      <Label>
        <div>
          {intl.formatMessage({ defaultMessage: "Pending Rewards" })}
          <Union />
        </div>
        <span>0</span>
      </Label>

      <Label>
        <div>{intl.formatMessage({ defaultMessage: "Recevied Ve-WTF" })}</div>
        <span>100,000</span>
      </Label>

      <Label>
        <div>{intl.formatMessage({ defaultMessage: "Expire date" })}</div>
        <p>{newExpireDate ? newExpireDate?.format("YYYY-MM-DD") : "--"}</p>
      </Label>

      <ButtonWrapper type="primaryLine" onClick={onConfirm}>
        {intl.formatMessage({ defaultMessage: "Lock & Stake Ve-WTF" })}
      </ButtonWrapper>
    </Wrapper>
  );
});

export default injectIntl(LockUp);