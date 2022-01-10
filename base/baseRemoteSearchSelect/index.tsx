import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SelectProps, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { SelectValue } from 'antd/lib/select';
import debounce from 'lodash/debounce';
export interface BaseRemoteSearchSelectProps<T, R> extends
  Omit<SelectProps<T>, 'children' | 'options' | 'filterOption' | 'onClear' | 'suffixIcon' | 'showSearch' | 'onSearch' | 'onChange' | 'notFoundContent'> {
  remoteLoadData?(search?: string): Promise<R[]>;
  /** 默认 label */
  remoteDataLabel?: keyof R;
  /** 默认 value */
  remoteDataValue?: keyof R;
  /** 异步加载数据在条件不足时，禁用显示文案 */
  remotePendding?: string;
  onChange?(value: T, item: R): void;
  onChange? (value?: T, item?: R): void;
  /** 异步加载的依赖，如果变化需要重新加载 */
  remoteDepends?: any;
  /** 默认查询字符串，用于回显查询 */
  defaultSearchString?: string;
}

export default function BaseRemoteSearchSelect <R extends object = {}, T extends SelectValue = SelectValue> ({
  remoteLoadData,
  remotePendding,
  remoteDataLabel = 'label' as any,
  remoteDataValue = 'value' as any,
  remoteDepends,
  value,
  onChange,
  defaultSearchString = '',
  ...props
}: BaseRemoteSearchSelectProps<T, R>) {
  const [searching, setSearching] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [options, setOptions] = useState<R[]>([]);
  const timmer = useRef<NodeJS.Timeout>();
  const remoteDependsRef = useRef(remoteDepends);
  const [defaultOptions, setDefaultOptions] = useState<R[]>([]);
  const searchRef = useRef('');
  const isFirst = useRef(true);
  const fetchId = useRef(0);
  const showOptions = useMemo<{ label: string; value: string; props: R }[]>(() => {
    if (searching) {
      return [];
    }
    const optionsMap = options.reduce<{ [key: string]: boolean }>((p, c) => ({ ...p, [c[remoteDataValue] as any]: true }), {});
    const res: R[] = [...options];
    defaultOptions.forEach(item => {
      if (
        !optionsMap[item[remoteDataValue] as any] &&
        (
          !searchRef.current && item[remoteDataValue as any] === value ||
          `${item[remoteDataLabel as any] || ''}`.includes(searchRef.current)
        )
      ) {
        res.push(item);
      }
    });
    return res.map(item => ({ label: item[remoteDataLabel] ?? item[remoteDataValue] as any, value: item[remoteDataValue] as any, props: item }));
  }, [searching, defaultOptions, options, value]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const loadData = debounce((search: string) => {
    searchRef.current = search;
    fetchId.current += 1;
    const current = fetchId.current;
    setOptions([]);
    setSearching(true);
    remoteLoadData?.(search).then(res => {
      if (current === fetchId.current) {
        setOptions(res);
        setSearching(false);
      }
    }).catch(() => {
      setSearching(false);
    });
  }, 800);

  function _onChange (value?: T, option?: any) {
    if (value !== currentValue) {
      setCurrentValue(value);
      onChange?.(value, option?.props);
    }
  }

  useEffect(() => {
    if (isFirst.current) {
      !remotePendding && loadData('');
      defaultSearchString && remoteLoadData?.(defaultSearchString).then(res => setDefaultOptions(res));
      isFirst.current = false;
    } else if (JSON.stringify(remoteDependsRef.current) !== JSON.stringify(remoteDepends)) {
      setSearching(false);
      fetchId.current = 0;
      setCurrentValue(void 0);
      setOptions([]);
      _onChange?.(void 0);
      !remotePendding && loadData('');
      remoteDependsRef.current = remoteDepends;
    }
    return () => {
      clearTimeout(timmer.current!);
    };
  }, [remotePendding, remoteDepends]);

  if (remotePendding) {
    return <Select<any> {...props} value={remotePendding} disabled />;
  }

  return (
    <Select
      filterOption={false}
      showSearch
      onClear={() => loadData('')}
      suffixIcon={searching ? <LoadingOutlined /> : void 0}
      notFoundContent={searching ? <Spin size="small" style={{ margin: '10px auto', display: 'block' }} /> : void 0}
      options={showOptions}
      onSearch={loadData}
      {...props}
      value={currentValue}
      onChange={_onChange} />
  );
}
