import { useHistory as useRcHistory } from 'react-router-dom';
import qs from 'qs';
import { useMemo } from 'react';

type FormatType = 'number' | 'string' | 'boolean';

type Query<T extends { [key: string]: FormatType }> = { [K in keyof T]?: T[K] extends 'string' ? string : T[K] extends 'number' ? number : never };

function formatUrl (url: string, data: any) {
  const dataStr = qs.stringify(data);
  return `${url}${url.includes('?') ? '&' : dataStr ? '?' : ''}${dataStr}`;
}

export default function useHistory <T extends { [key: string]: FormatType }> (param?: T) {
  const history = useRcHistory();

  const query = useMemo(() => qs.parse(history.location.search.replace(/^\?/, '')), [history]);

  /** 根据 param 类型 格式化 参数 */
  Object.entries<FormatType>((param || {}) as any).forEach(([key, value]) => {
    if (value === 'number') {
      const number = Number(query[key]);
      query[key] = isNaN(number) ? void 0 : number as unknown as any;
    } else if (value === 'boolean') {
      query[key] = query[key] === 'true' ? true : false as any;
    }
  });

  return {
    ...history,
    query: query as any as Query<T>,
    link: (url: string, data: any = {}) => location.href = formatUrl(url, data),
    open: (url: string, data: any = {}) => window.open(formatUrl(url, data), '_blank'),
    push: (url: string, data: any = {}) => history.push(formatUrl(url, data)),
    replace: (url: string, data: any = {}) => history.replace(formatUrl(url, data)),
  };
}
