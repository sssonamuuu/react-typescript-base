import React, { useEffect, useRef, useState } from 'react';
import { SelectProps, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { SelectValue } from 'antd/lib/select';

export interface BaseRemoteSearchSelectProps<T> extends
  Omit<SelectProps<T>, 'children' | 'options' | 'filterOption' | 'showSearch' | 'onSearch' | 'onChange'> {
  remoteLoadData?(search?: string): Promise<SelectProps<T>['options']>;
  onChange? (value?: T): void;
}

export default function BaseRemoteSearchSelect <T extends SelectValue = SelectValue> ({ remoteLoadData, value, onChange, ...props }: BaseRemoteSearchSelectProps<T>) {
  const [searching, setSearching] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [options, setOptions] = useState<SelectProps<T>['options']>([]);
  const timmer = useRef<number>();
  const fetchId = useRef(0);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  function loadData (search?: string) {
    clearTimeout(timmer.current);

    if (searching) {
      timmer.current = setTimeout(loadData, 500, search);
      return;
    }
    fetchId.current += 1;
    const current = fetchId.current;
    setOptions([]);
    setSearching(true);

    remoteLoadData?.(search).then(res => {
      current === fetchId.current && setOptions(res);
      setSearching(false);
    });
  }

  useEffect(() => {
    setSearching(false);
    fetchId.current = 0;
    loadData();
    setCurrentValue(void 0);
    onChange?.(value);
    return () => {
      clearTimeout(timmer.current);
    };
  }, [remoteLoadData]);

  function _onChange (value: T) {
    setCurrentValue(value);
    onChange?.(value);
  }

  return (
    <Select
      filterOption={false}
      showSearch
      suffixIcon={searching ? <LoadingOutlined /> : void 0}
      notFoundContent={searching ? <Spin size="small" /> : void 0}
      options={options}
      onSearch={loadData}
      {...props}
      value={currentValue}
      onChange={_onChange} />

  );
}
