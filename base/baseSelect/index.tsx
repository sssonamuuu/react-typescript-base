import globalStyle from 'index.less';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Input, Select, SelectProps } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React, { useEffect, useRef, useState } from 'react';

export type OptionType<T> = SelectProps<T>['options'];

export interface BaseSelectProps<T> extends Omit<SelectProps<T>, 'children'> {
  /**
   * 是否有全部选项，默认有， undefined | null 都认为是选中全部，如果选择全部返回值为 null
   *
   * string 指定 全部的默认文本， 默认全部
   */
  all?: boolean | string;
  /** 加载异步数据，如果存在该字段，忽略 `options` */
  remoteLoadData?(): Promise<OptionType<T>>;
  /** 加载异步数据的文本提示 */
  remoteLoadingText?: string;
  /** 加载异步数据失败的文本提示 */
  remoteErrorText?: string;
  /** 异步加载数据在条件不足时，禁用显示文案 */
  remotePendding?: string;
  /** 异步加载的依赖，如果变化需要重新加载 */
  remoteDepends?: any;
}

export default function BaseSelect <T extends SelectValue = SelectValue> ({
  value,
  all = true,
  options = [],
  remoteLoadData,
  remotePendding,
  remoteLoadingText = '数据加载中，请稍后...',
  remoteErrorText = '加载失败，请重试',
  remoteDepends,
  ...props
}: BaseSelectProps<T>) {
  const [status, setStatus] = useState<'loading'| 'loaded'| 'error'>(remoteLoadData ? 'loading' : 'loaded');
  const [remoteData, setRemoteData] = useState<OptionType<T>>([]);
  const remoteDependsRef = useRef(remoteDepends);

  function loadData () {
    if (remoteLoadData) {
      setStatus('loading');
      remoteLoadData?.().then(res => {
        setRemoteData(res);
        setStatus('loaded');
      }).catch(() => setStatus('error'));
    } else {
      setRemoteData(options);
      setStatus('loaded');
    }
  }

  useEffect(() => {
    !remotePendding && loadData();
  }, []);

  useEffect(() => {
    if (JSON.stringify(remoteDependsRef.current) !== JSON.stringify(remoteDepends)) {
      remoteDependsRef.current = remoteDepends;
      props.onChange?.(void 0 as any, void 0 as any);
      !remotePendding && loadData();
    }
  }, [remotePendding, remoteDepends]);

  useEffect(() => {
    !remoteLoadData && `${options}` !== `${remoteData}` && setRemoteData(options);
  }, [options]);

  if (remotePendding) {
    return <Select<any> {...props} value={remotePendding} disabled />;
  }

  if (status !== 'loaded') {
    return (
      <Input
        disabled
        placeholder={status === 'loading' ? remoteLoadingText : remoteErrorText}
        style={props.style}
        addonAfter={status === 'error' ? <SyncOutlined className={globalStyle.cup} onClick={loadData} /> : void 0}
        suffix={status === 'loading' ? <LoadingOutlined /> : void 0} />
    );
  }

  return (
    <Select
      {...props}
      options={all ? [{ value: null, label: typeof all === 'string' ? all : '全部' } as any].concat(remoteData) : remoteData}
      value={all && value === void 0 ? null : value as any} />
  );
}
