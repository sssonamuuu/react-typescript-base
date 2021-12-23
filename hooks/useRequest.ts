import { useCallback, useEffect, useRef, useState } from 'react';
import Incorrect from 'classes/Incorrect';
import { errorCode } from 'datas/enums';

interface UseRequestOption<U, T> {
  /** 请求参数 */
  params?: U;
  /** 是否手动触发run */
  manual?: boolean;
  /** 默认 true */
  defaultLoading?: boolean;
  /** 同于同个请求不同参数的情况 */
  fetchKey?(param: U): string | number;
  defaultValue?: T;
}

export interface FetchesItemProps<U, T> {
  data: T;
  params: U;
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

interface FetchesProps<U, T> {
  [key: string]: undefined | FetchesItemProps<U, T>;
}

const DEFALUT_KEY = '__FETCH_DEFAULT__';

/**
 * 1. 如果使用了 `fetcheKey`
 *    - 外层的 `data` 和 `error` 无效，需使用 `fetches[key]` 下的  `data` 和 `error`
 *    - 只要有一个 `loading` 则外层的 `loading` 为 `true`，单个 `loading` 使用 `fetches[key]`
 * 2. 未使用 `fetcheKey`
 *    - 直接使用 外层的 `loading` `data` 和 `error`
 */
export default function useRequest<U, T> (
  fn: (param: U) => Promise<T>,
  { params, manual = false, fetchKey, defaultLoading = true, defaultValue = {} as T }: UseRequestOption<U, T> = {},
) {
  const fetchesRef = useRef<FetchesProps<U, T>>({
    [DEFALUT_KEY]: {
      loading: defaultLoading,
      cancelled: false,
      data: defaultValue,
      error: null,
      params: {} as U,
      placeholder: defaultLoading ? new Incorrect(errorCode.loading.code) : null,
    },
  });
  const [fetches, setFetches] = useState({ ...fetchesRef.current });

  const cancel = useCallback((key: string | number) => {
    fetchesRef.current[key] = {
      loading: false,
      cancelled: true,
      params: fetchesRef.current[key]?.params ?? {} as U,
      error: fetchesRef.current[key]?.error ?? null,
      data: fetchesRef.current[key]?.data ?? {} as T,
      placeholder: fetchesRef.current[key]?.placeholder ?? null,
    };
    setFetches({ ...fetchesRef.current });
  }, [fetches]);

  const setData = useCallback((data: T, key: string | number = DEFALUT_KEY) => {
    fetchesRef.current[key] = {
      ...fetchesRef.current[key] as any,
      data,
    };
    setFetches({ ...fetchesRef.current });
  }, [fetches]);

  const setPlaceholder = useCallback((placeholder: any, key: string | number = DEFALUT_KEY) => {
    const error = placeholder ? Incorrect.formatTryCatchError(placeholder) : null;
    fetchesRef.current[key] = {
      ...fetchesRef.current[key] as any,
      error,
      placeholder: error,
    };
    setFetches({ ...fetchesRef.current });
  }, [fetches]);

  const run = useCallback((runParams?: U): Promise<T> => {
    const currentParams = runParams ?? params ?? {} as U;
    const key = fetchKey?.(currentParams) ?? DEFALUT_KEY;
    fetchesRef.current[key] = {
      loading: true,
      cancelled: false,
      error: null,
      params: currentParams,
      data: fetchesRef.current[key]?.data ?? {} as T,
      placeholder: new Incorrect(errorCode.loading.code),
    };
    setFetches({ ...fetchesRef.current });
    return fn(currentParams)
      .then(data => {
        if (!fetchesRef.current[key]?.cancelled) {
          fetchesRef.current[key] = {
            data,
            loading: false,
            error: null,
            params: currentParams,
            cancelled: fetchesRef.current[key]?.cancelled ?? false,
            placeholder: null,
          };
          /** 延迟执行，避免外部的 promise 后执行 */
          setTimeout(() => setFetches({ ...fetchesRef.current }), 0);
        }
        return data;
      }).catch(e => {
        if (!fetchesRef.current[key]?.cancelled) {
          const error = Incorrect.formatTryCatchError(e);
          fetchesRef.current[key] = {
            data: fetchesRef.current[key]?.data ?? {} as T,
            loading: false,
            cancelled: false,
            params: currentParams,
            error,
            placeholder: error,
          };
          /** 延迟执行，避免外部的 promise 后执行 */
          setTimeout(() => setFetches({ ...fetchesRef.current }), 0);
        }
        throw e;
      });
  }, [fetches]);

  useEffect(() => {
    !manual && run(params ?? {} as U);
    return () => Object.keys(fetchesRef.current).forEach(key => cancel(key));
  }, []);

  return {
    ...fetches[DEFALUT_KEY]!,
    cancel,
    fetches,
    run,
    setData,
    setPlaceholder,
    loading: Object.keys(fetches).some(key => fetches[key]?.loading),
  };
}
