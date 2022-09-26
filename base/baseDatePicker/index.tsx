import { DatePicker, DatePickerProps } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';
import React from 'react';

type BaseDatePickerProps = DatePickerProps & {
  /** 禁用半年以前的，默认 true */
  disabledBeforeHalfYear?: boolean;
  /** 禁用将来，默认 true */
  disabledFuture?: boolean;
};

export default function BaseDatePicker ({ disabledBeforeHalfYear = true, disabledFuture = true, ...props }: BaseDatePickerProps) {
  props.disabledDate ??= (date: moment.Moment) => {
    if (disabledBeforeHalfYear && date.isBefore(moment().add(-0.5, 'year'))) {
      return true;
    }

    if (disabledFuture && date.isAfter(moment())) {
      return true;
    }

    return false;
  };

  return <DatePicker {...props} />;
}

type BaseRangePickerProps = RangePickerProps & {
  /** 禁用半年以前的，默认 true */
  disabledBeforeHalfYear?: boolean;
  /** 禁用将来，默认 true */
  disabledFuture?: boolean;
};

BaseDatePicker.RangePicker = function ({ disabledBeforeHalfYear = true, disabledFuture = true, ...props }: BaseRangePickerProps) {
  props.disabledDate ??= (date: moment.Moment) => {
    if (disabledBeforeHalfYear && date.isBefore(moment().add(-0.5, 'year'))) {
      return true;
    }

    if (disabledFuture && date.isAfter(moment())) {
      return true;
    }

    return false;
  };
  return <DatePicker.RangePicker {...props} />;
};

BaseDatePicker.defaultOneMonthValue = [moment().add(-1, 'month'), moment()] as [moment.Moment, moment.Moment];
