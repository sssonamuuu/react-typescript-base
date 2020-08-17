import { useState, useEffect, useCallback, useRef } from 'react';
import Incorrect from 'classes/Incorrect';

interface UseRequestOption<U> {
  /** 请求参数 */
  params?: U;
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

type AnyPromisFunction = (arg: any) => Promise<any>;
type GetParam<F extends AnyPromisFunction> = F extends (arg: infer P) => Promise<any> ? P : never;
type GetReturn<F extends AnyPromisFunction> = F extends (arg: any) => Promise<infer R> ? R : never;

/**
 * 1. 如果使用了 `fetcheKey`
 *    - 外层的 `data` 和 `error` 无效，需使用 `fetches[key]` 下的  `data` 和 `error`
 *    - 只要有一个 `loading` 则外层的 `loading` 为 `true`，单个 `loading` 使用 `fetches[key]`
 * 2. 未使用 `fetcheKey`
 *    - 直接使用 外层的 `loading` `data` 和 `error`
 */
export default function useRequest<F extends AnyPromisFunction, U = GetParam<F>, T = GetReturn<F>> (
  fn: F,
  {
    params,
    fetchKey,
    manual = false,
  }: UseRequestOption<U> = {},
) {
  const DEFAULT_KEY = '__DEFAULT_KEY__';

  /** 存储实时变化的值，避免多次请求 fetches 不试试更新问题 */
  const fetchesRef = useRef<{ [key: string]: FetchesProps<T> }>({});
  const [fetches, setFetches] = useState<{ [key: string]: FetchesProps<T> }>({});

  const cancel = useCallback((key: string | number = DEFAULT_KEY) => setFetches({ ...fetches, [key]: { ...fetches[key], cancelled: true, loading: false } }), [fetches]);

  const run = useCallback((params: U) => {
    const key = fetchKey ? fetchKey(params) : DEFAULT_KEY;

    if (fetches[key]?.loading) {
      return;
    }

    setFetches({ ...fetchesRef.current = { ...fetchesRef.current, [key]: { data: fetches[key]?.data, error: null, loading: true, cancelled: false } } });

    fn(params)
      .then(res => setFetches({ ...fetchesRef.current = { ...fetchesRef.current, [key]: { data: res, error: null, loading: false, cancelled: false } } }))
      .catch(e => setFetches({ ...fetchesRef.current = { ...fetchesRef.current, [key]: { data: fetches[key]?.data, error: e, loading: false, cancelled: false } } }));
  }, [fetches]);

  useEffect(() => {
    !manual && run(params!);
    return () => Object.keys(fetches).forEach(key => cancel(key));
  }, []);

  return {
    fetches,
    loading: Object.values(fetches).some(fetch => fetch.loading),
    error: fetches[DEFAULT_KEY]?.error ?? null,
    data: fetches[DEFAULT_KEY]?.data ?? {} as T,
    run,
    cancel,
  };
}
