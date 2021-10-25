/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { DatePicker as AntdDatePicker, DatePickerProps } from "antd";
import { PickerPanelDateProps } from "antd/lib/calendar/generateCalendar";
import { PickerProps } from "antd/lib/date-picker/generatePicker";
import { DateIcon } from "assets/images";
import dayjs, { Dayjs } from "dayjs";
import { memo } from "react";

const DatePickerWrapper = styled(AntdDatePicker)`
  &.ant-picker {
    height: 48px;
    padding: 7px 16px;
    border-radius: 8px;
    border-color: ${({ theme }) => theme.gray.normal2};
    color: ${({ theme }) => theme.gray.normal85};
    box-shadow: none;
    background: transparent;
    :hover {
      border-color: ${({ theme }) => theme.primary.deep};
      box-shadow: none;
    }
    input {
      color: ${({ theme }) => theme.gray.normal85};
      font-size: 16px;
    }
    .ant-picker-suffix {
      color: ${({ theme }) => theme.gray.normal5};
    }
  }
  &.ant-picker-focused {
    border-color: ${({ theme }) => theme.primary.deep};
  }
`;

type TProps = PickerPanelDateProps<moment.Moment> & DatePickerProps;

const DatePicker = memo<TProps>(({ ...props }) => {
  return (
    <DatePickerWrapper
      suffixIcon={<DateIcon />}
      placeholder=""
      disabledDate={(e) => {
        return e.isBefore(dayjs() as moment.MomentInput);
      }}
      showToday={false}
      allowClear={false}
      {...props}
    />
  );
});

export default DatePicker;
