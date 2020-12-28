import React from 'react';

import { Dayjs } from 'dayjs';

import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker, { PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import generateCalendar from 'antd/lib/calendar/generateCalendar';
import 'antd/es/date-picker/style';

export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {}

export const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => <DatePicker {...props} picker="time" mode={void 0} ref={ref} />);

TimePicker.displayName = 'TimePicker';

export const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);
