import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import { InputProps, TextAreaProps } from 'antd/lib/input';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { onKeyDownIfEnter } from 'utils/keyboardEvent';

interface BaseInputProps extends Omit<InputProps, 'onChange'> {
  /** 默认 off */
  autoComplete?: 'on' | 'off';
  value?: string;
  /**
   * numberText: number类型的字符串，仅作用于限制number类型文本输入
   * number: onchange会转换成 number 类型的数据 如001会返回 1
   */
  valueType?: 'numberText' | 'number' | 'phone';
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
  onEnter?(value?: string): void;
  onChange?(value?: string): void;
  /** 仅在search下生效 */
  loading?: boolean;
}

export default function BaseInput ({ value, onChange, valueType, decimal = 0, search = false, onEnter, autoComplete = 'off', loading = false, trim = true, negative, ...props }: BaseInputProps) {
  const ref = useRef<Input>(null);
  const lastValue = useRef(value);
  const [currentValue, setCurrentValue] = useState(lastValue.current);

  useEffect(() => setCurrentValue(value), [value]);

  function calcValue (value: string = '') {
    switch (valueType) {
      case 'number':
      case 'numberText':
        return value.match(new RegExp(`${negative ? '-?\\d*' : '\\d+'}${decimal ? `(\\.\\d{0,${decimal}})?` : ''}`))?.[0] ?? '';
      case 'phone':
        return value.match(/1\d{0,10}/)?.[0] ?? '';
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

  function resetValue (val: string) {
    let value = trim ? val.trim() : val;

    if (valueType === 'number') {
      value = value && !isNaN(Number(value)) ? `${Number(value)}` : '';
    }

    return value;
  }

  function onKeyDown () {
    ref.current?.blur();
    const val = resetValue(currentValue || '');
    setCurrentValue(val);
    setTimeout(() => onEnter?.(val), 0);
  }

  return (
    <Input
      ref={ref}
      autoComplete={autoComplete}
      spellCheck={false}
      suffix={search ? loading ? <LoadingOutlined /> : <SearchOutlined onClick={() => onEnter?.(currentValue)} /> : void 0}
      onKeyDown={e => onKeyDownIfEnter(e, onKeyDown)}
      onBlur={e => setCurrentValue(resetValue(e.target.value))}
      {...props}
      {...autoComplete === 'off' ? {
        /** 添加只读，在聚焦时再设置为可填 ，处理chrome自动填充问题 */
        readOnly: props.readOnly ?? true,
        /** 防止本身设置的 readonly 属性 */
        onFocus: e => e.target.readOnly = props.readOnly ?? false,
      } : {}}
      value={currentValue}
      onChange={onChangeHandle} />
  );
}

BaseInput.Group = Input.Group;

interface BaseTextAreaProps extends Omit<TextAreaProps, 'onChange'> {
  /** 默认Ture */
  trim?: boolean;
  onChange?(value?: string): void;
}

function BaseTextArea ({ value, trim = true, onChange, ...props }: BaseTextAreaProps) {
  const lastValue = useRef(value);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => setCurrentValue(value), [value]);

  useEffect(() => {
    lastValue.current !== currentValue && onChange?.(currentValue as string);
    lastValue.current = currentValue;
  }, [currentValue]);

  return (
    <Input.TextArea
      {...props}
      value={currentValue}
      onChange={e => setCurrentValue(e.target.value)}
      onBlur={e => setCurrentValue(trim ? e.target.value.trim() : e.target.value)} />
  );
}

BaseInput.TextArea = BaseTextArea;
