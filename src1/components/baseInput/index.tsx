import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';

interface BaseInputProps extends Omit<InputProps, 'onChange'> {
  value?: string;
  valueType?: 'number' | '';
  /**
   * 是否去掉首尾空格，默认：`true`
   */
  /**
   * 如果是 number decimal 表示小数精度
   */
  decimal?: number;
  /** 是否可以使用负数 */
  negative?: boolean;
  trim?: boolean;
  search?: boolean;
  onSearch?(value?: string): void;
  onChange?(value?: string): void;
  /** 仅在search下生效 */
  loading?: boolean;
}

export default function BaseInput ({ value, onChange, valueType, decimal = 0, search = false, onSearch, loading = false, trim = true, negative, ...props }: BaseInputProps) {
  const lastValue = useRef(value);
  const [currentValue, setCurrentValue] = useState(lastValue.current);

  useEffect(() => setCurrentValue(value), [value]);

  function calcValue (value: string = '') {
    switch (valueType) {
      case 'number':
        const matches = value.match(new RegExp(`${negative ? '-?\\d*' : '\\d+'}${decimal ? `(\\.\\d{0,${decimal}})?` : ''}`));
        return matches?.[0] ?? '';
      default: return value;
    }
  }

  useEffect(() => {
    lastValue.current !== currentValue && onChange?.(currentValue);
    lastValue.current = currentValue;
  }, [currentValue]);

  function onChangeHandle (e: ChangeEvent<HTMLInputElement>) {
    setCurrentValue(calcValue(e.target.value));
  }

  return (
    <Input
      autoComplete="off"
      spellCheck={false}
      suffix={search ? loading ? <LoadingOutlined /> : <SearchOutlined onClick={() => onSearch?.(currentValue)} /> : void 0}
      onKeyDown={e => e.keyCode === 13 && onSearch?.(currentValue)}
      onFocus={e => e.target.readOnly = false}
      onBlur={e => {
        let value = trim ? e.target.value.trim() : e.target.value;

        if (valueType === 'number') {
          value = value && !isNaN(Number(value)) ? `${Number(value)}` : '';
        }

        setCurrentValue(value);
      }}
      {...props}
      value={currentValue}
      onChange={onChangeHandle} />
  );
}

BaseInput.Group = Input.Group;
BaseInput.TextArea = Input.TextArea;
