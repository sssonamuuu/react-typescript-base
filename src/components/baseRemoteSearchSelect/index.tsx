import React, { useEffect, useRef, useState } from 'react';
import { SelectProps, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { SelectValue } from 'antd/lib/select';

export interface BaseRemoteSearchSelectProps<T> extends
  Omit<SelectProps<T>, 'children' | 'options' | 'filterOption' | 'showSearch' | 'onSearch'> {
  remoteLoadData?(value?: string): Promise<SelectProps<T>['options']>;
}

export default function BaseRemoteSearchSelect <T extends SelectValue = SelectValue> ({ remoteLoadData, ...props }: BaseRemoteSearchSelectProps<T>) {
  const [searching, setSearchIng] = useState(false);
  const [options, setOptions] = useState<SelectProps<T>['options']>([]);
  const timmer = useRef<number>();
  const fetchId = useRef(0);

  function loadData (value?: string) {
    clearTimeout(timmer.current);

    if (searching) {
      timmer.current = setTimeout(loadData, 500, value);
      return;
    }
    fetchId.current += 1;
    const current = fetchId.current;
    setOptions([]);
    setSearchIng(true);

    remoteLoadData?.(value).then(res => {
      current === fetchId.current && setOptions(res);
      setSearchIng(false);
    });
  }

  useEffect(() => {
    loadData();
    return () => {
      clearTimeout(timmer.current);
    };
  }, [remoteLoadData]);

  return (
    <Select
      {...props}
      filterOption={false}
      showSearch
      suffixIcon={searching ? <LoadingOutlined /> : void 0}
      notFoundContent={searching ? <Spin size="small" /> : void 0}
      options={options}
      onSearch={loadData} />
  );
}
