import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SelectProps, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { SelectValue } from 'antd/lib/select';
import debounce from 'lodash/debounce';

export interface BaseRemoteSearchSelectProps<T> extends
  Omit<SelectProps<T>, 'children' | 'options' | 'filterOption' | 'showSearch' | 'onSearch' | 'onChange'> {
  remoteLoadData?(search?: string): Promise<SelectProps<T>['options']>;
  /** 异步加载数据在条件不足时，禁用显示文案 */
  remotePendding?: string;
  onChange? (value?: T): void;
}

export default function BaseRemoteSearchSelect <T extends SelectValue = SelectValue> ({ remoteLoadData, remotePendding, value, onChange, ...props }: BaseRemoteSearchSelectProps<T>) {
  const [searching, setSearching] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [options, setOptions] = useState<SelectProps<T>['options']>([]);
  const timmer = useRef<NodeJS.Timeout>();
  const search = useRef('');
  const fetchId = useRef(0);

  useEffect(() => {
    search.current = '';
    setCurrentValue(value);
  }, [value]);

  const loadData = useMemo(() => debounce(() => {
    fetchId.current += 1;
    const current = fetchId.current;
    setOptions([]);
    setSearching(true);

    remoteLoadData?.(search.current).then(res => {
      if (current === fetchId.current) {
        setOptions(res);
        setSearching(false);
      }
    });
  }, 800), [remoteLoadData]);

  useEffect(() => {
    setSearching(false);
    fetchId.current = 0;
    setCurrentValue(void 0);
    onChange?.(void 0);
    search.current = '';
    !remotePendding && loadData();
    return () => {
      clearTimeout(timmer.current!);
    };
  }, [remotePendding, remoteLoadData]);

  function onSearch (value: string) {
    search.current = value;
    loadData();
  }

  function _onChange (value: T) {
    setCurrentValue(value);
    onChange?.(value);
  }

  if (remotePendding) {
    return <Select<any> {...props} value={remotePendding} disabled />;
  }

  return (
    <Select
      filterOption={false}
      showSearch
      suffixIcon={searching ? <LoadingOutlined /> : void 0}
      notFoundContent={searching ? <Spin size="small" /> : void 0}
      options={options}
      onSearch={onSearch}
      {...props}
      value={currentValue}
      onChange={_onChange} />

  );
}
