import { useState, useEffect, useCallback } from 'react';
import Incorrect from 'classes/Incorrect';

interface UseRequestOption<U> {
  /** 是否手动触发run */
  manual?: boolean;
  /** 同于同个请求不同参数的情况 */
  fetchKey?(param: U): string | number;
}

interface FetchesProps<T> {
  data: T;
  loading: boolean;
  cancelled: boolean;
  error: Incorrect | null;
}

/**
 * 1. 如果使用了 `fetcheKey`
 *    - 外层的 `data` 和 `error` 无效，需使用 `fetches[key]` 下的  `data` 和 `error`
 *    - 只要有一个 `loading` 则外层的 `loading` 为 `true`，单个 `loading` 使用 `fetches[key]`
 * 2. 未使用 `fetcheKey`
 *    - 直接使用 外层的 `loading` `data` 和 `error`
 */
export default function useRequest<U, T> (
  fn: (params: U) => Promise<T>, params?: U,
  {
    fetchKey,
    manual = false,
  }: UseRequestOption<U> = {},
) {
  const DEFAULT_KEY = '__DEFAULT_KEY__';

  const [fetches, setFetches] = useState<{ [key: string]: FetchesProps<T> }>({});

  const cancel = useCallback((key: string | number = DEFAULT_KEY) => setFetches({ ...fetches, [key]: { ...fetches[key], cancelled: true, loading: false } }), [fetches]);

  const run = useCallback((params: U) => {
    const key = fetchKey ? fetchKey(params) : DEFAULT_KEY;

    if (fetches[key].loading) {
      return;
    }

    setFetches({ ...fetches, [key]: { ...fetches[key], error: null, loading: true, cancelled: false } });

    fn(params)
      .then(res => !fetches[key].cancelled && setFetches({ ...fetches, [key]: { ...fetches[key], data: res } }))
      .catch(e => setFetches({ ...fetches, [key]: { ...fetches[key], error: e } }))
      .finally(() => setFetches({ ...fetches, [key]: { ...fetches[key], loading: false } }));
  }, [fetches]);

  useEffect(() => {
    !manual && run(params!);
    return () => Object.keys(fetches).forEach(key => cancel(key));
  }, []);

  return {
    fetches,
    loading: Object.values(fetches).some(Boolean),
    error: fetchKey ? null : fetches[DEFAULT_KEY].error,
    data: fetchKey ? null : fetches[DEFAULT_KEY].data,
    run,
    cancel,
  };
}
