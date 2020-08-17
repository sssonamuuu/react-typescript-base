import * as React from 'react';
import Incorrect from 'classes/Incorrect';
import { errorCode } from 'configs/enumerations';
// import Incorrect from 'classes/Incorrect';
// import { errorCode } from 'configs/enumerations';

interface UseRequestOption<U> {
  /** 请求参数 */
  params?: U;
  /** 是否手动触发run */
  manual?: boolean;
  /** 如果是 manual，默认 false， 否则 默认 true */
  defaultLoading?: boolean;
  /** 同于同个请求不同参数的情况 */
  fetchKey?(param: U): string | number;
}

interface FetchesItemProps<T> {
  data: T;
  /** 多个带 `key` 请求，只要有一个 `loading` 即为 `loading` */
  loading: boolean;
  /** 多个带 `key` 请求，无效，请使用 `fetches[key].loading` */
  cancelled: boolean;
  /** 多个带 `key` 请求，无效，请使用 `fetches[key].loading` */
  error: Incorrect | null;
  /**
   *
   * `loading` 或者 `error` 的状态，给 `BasePlaceholder` 使用
   *
   * 多个带 `key` 请求，无效，请使用 `fetches[key].loading`
   */
  placeholder: Incorrect | null;
}

interface FetchesProps<T> {
  [key: string]: undefined | FetchesItemProps<T>;
}

type AnyPromisFunction = (arg: any) => Promise<any>;
type GetParam<F extends AnyPromisFunction> = F extends (arg: infer P) => Promise<any> ? P : never;
type GetReturn<F extends AnyPromisFunction> = F extends (arg: any) => Promise<infer R> ? R : never;

const DEFALUT_KEY = '__FETCH_DEFAULT__';

/**
 * 1. 如果使用了 `fetcheKey`
 *    - 外层的 `data` 和 `error` 无效，需使用 `fetches[key]` 下的  `data` 和 `error`
 *    - 只要有一个 `loading` 则外层的 `loading` 为 `true`，单个 `loading` 使用 `fetches[key]`
 * 2. 未使用 `fetcheKey`
 *    - 直接使用 外层的 `loading` `data` 和 `error`
 */
export default function useRequest<F extends AnyPromisFunction, U = GetParam<F>, T = GetReturn<F>> (
  fn: F,
  { params, manual = false, fetchKey }: UseRequestOption<U> = {},
) {
  const fetchesRef = React.useRef<FetchesProps<T>>({
    [DEFALUT_KEY]: {
      loading: !manual,
      cancelled: false,
      data: {} as T,
      error: null,
      placeholder: manual ? null : new Incorrect(errorCode.loading.code),
    },
  });
  const [fetches, setFetches] = React.useState({ ...fetchesRef.current });

  const cancel = React.useCallback((key: string | number) => {
    fetchesRef.current[key] = {
      loading: false,
      cancelled: true,
      error: fetchesRef.current[key]?.error ?? null,
      data: fetchesRef.current[key]?.data ?? {} as T,
      placeholder: fetchesRef.current[key]?.placeholder ?? null,
    };
    setFetches({ ...fetchesRef.current });
  }, [fetches]);

  const run = React.useCallback((params: U) => {
    const key = fetchKey?.(params) ?? DEFALUT_KEY;
    fetchesRef.current[key] = {
      loading: true,
      cancelled: false,
      error: null,
      data: fetchesRef.current[key]?.data ?? {} as T,
      placeholder: new Incorrect(errorCode.loading.code),
    };
    setFetches({ ...fetchesRef.current });
    fn(params)
      .then(data => {
        if (fetchesRef.current[key]?.cancelled) {
          return;
        }
        fetchesRef.current[key] = {
          data,
          loading: false,
          error: null,
          cancelled: fetchesRef.current[key]?.cancelled ?? false,
          placeholder: null,
        };
        setFetches({ ...fetchesRef.current });
      }).catch(e => {
        if (fetchesRef.current[key]?.cancelled) {
          return;
        }
        const error = e instanceof Incorrect ? e : new Incorrect(errorCode.default.code);
        fetchesRef.current[key] = {
          data: fetchesRef.current[key]?.data ?? {} as T,
          loading: false,
          cancelled: false,
          error,
          placeholder: error,
        };
        setFetches({ ...fetchesRef.current });
      });
  }, [fetches]);

  React.useEffect(() => {
    !manual && run(params ?? {} as U);
    return () => Object.keys(fetchesRef.current).forEach(key => cancel(key));
  }, []);

  return { ...fetches[DEFALUT_KEY]!, cancel, fetches, run };
}
