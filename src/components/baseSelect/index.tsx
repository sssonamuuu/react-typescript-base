import { Select, SelectProps } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React, { useMemo } from 'react';

interface BaseSelectProps<T> extends Omit<SelectProps<T>, 'children'> {
  /** 是否有全部选项，默认有， undefined | null 都认为是选中全部，如果选择全部返回值为 null */
  all?: boolean;
}

export default function BaseSelect <T extends SelectValue = SelectValue> ({ value, all = true, options = [], ...props }: BaseSelectProps<T>) {
  const memoOptions = useMemo(() => all ? [{ value: null, label: '全部' } as any].concat(options) : options, [all, options]);
  return <Select {...props} options={memoOptions} value={all && value === void 0 ? null : value as any} />;
}
