import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import { InputProps, TextAreaProps } from 'antd/lib/input';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import keyboardEventUtils from 'utils/keyboardEventUtils';

interface BaseInputProps extends Omit<InputProps, 'onChange'> {
  /**
   * number: 只能是数字
   * letter: 只能是字母 不区分大小写
   * letter-number: 数字和字母
   * phone: 1开头的11位数字
   * tel: 只能输入数字和中横线 最多输入20位
   * idcard: 只能是数数字和X (小写x默认转大写)) 最多输入18位
   */
  valueType?: 'number' | 'phone' | 'tel' | 'idcard' | 'letter' | 'letter-number';
  /**
   * 仅 valueType === 'number' 生效, 表示小数精度
   */
  decimal?: number;
  /** 仅 valueType === 'number' 生效， 是否可以使用负数 */
  negative?: boolean;
  /**
   * number: 仅 valueType === 'number' 生效，使返回的内容为 number 类型而非 string， 但是前置0会被取消掉，如 001结果为 1;
   * upper: 内容相关字母转大写
   * lower: 内容相关字母小写
   */
  transform?: 'number' | 'upper' | 'lower';
  /** 是否去掉首尾空格，默认：`true` */
  trim?: boolean;
  /** 默认 off */
  autoComplete?: 'on' | 'off';
  value?: string;
  search?: boolean;
  onEnter?(value?: string): void;
  onChange?(value?: string): void;
  /** 仅在search下生效 */
  loading?: boolean;
}

export default function BaseInput ({
  valueType,
  decimal = 0,
  search = false,
  onEnter,
  loading = false,
  trim = true,
  transform,
  negative,
  value,
  onChange,
  autoComplete = 'off',
  ...props
}: BaseInputProps) {
  const ref = useRef<Input>(null);
  const lastValue = useRef(value);
  const [currentValue, setCurrentValue] = useState(lastValue.current);

  useEffect(() => setCurrentValue(value), [value]);

  useEffect(() => {
    lastValue.current !== currentValue && onChange?.(currentValue);
    lastValue.current = currentValue;
  }, [currentValue]);

  function onChangeHandle (e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value || '';

    switch (valueType) {
      case 'number':
        value = value.match(new RegExp(`${negative ? '-?\\d*' : '\\d+'}${decimal ? `(\\.\\d{0,${decimal}})?` : ''}`))?.[0] ?? '';
        break;
      case 'phone':
        value = value.match(/1\d{0,10}/)?.[0] ?? '';
        break;
      case 'tel':
        value = value.match(/[\d-]{0,20}/)?.[0] ?? '';
        break;
      case 'idcard':
        value = value.toUpperCase().match(/[\dx]{0,18}/i)?.[0] ?? '';
        break;
      case 'letter':
        value = value.match(/[a-z]*/i)?.[0] ?? '';
        break;
      case 'letter-number':
        value = value.match(/[a-z0-9]*/i)?.[0] ?? '';
        break;
    }

    value = transform === 'upper' ? value.toUpperCase() : transform === 'lower' ? value.toLowerCase() : value;
    setCurrentValue(value);
  }

  function transformValue (val: string = '') {
    value = trim ? val.trim() : val;

    if (valueType === 'number' && transform === 'number') {
      value = value && !isNaN(Number(value)) ? `${Number(value)}` : '';
    }

    return value;
  }

  function onKeyDown () {
    ref.current?.blur();
    const val = transformValue(currentValue);
    setCurrentValue(val);
    setTimeout(() => onEnter?.(val), 0);
  }

  return (
    <Input
      ref={ref}
      autoComplete={autoComplete}
      spellCheck={false}
      suffix={search ? loading ? <LoadingOutlined /> : <SearchOutlined onClick={() => onEnter?.(currentValue)} /> : void 0}
      onKeyDown={e => keyboardEventUtils.isEnter(e) && onKeyDown()}
      onBlur={e => setCurrentValue(transformValue(e.target.value))}
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
