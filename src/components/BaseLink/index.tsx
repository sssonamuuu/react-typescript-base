import React, { PropsWithChildren } from 'react';
import { RouteProps } from 'routers';
import { navigation, history, formatUrl, getRoutePath } from 'utils/navigation';

interface BaseLinkProps<T extends keyof RouteProps> {
  className?: string;
  route?: T;
  /** 给 query 使用 */
  query?: RouteProps[T]['$query'];
  url?: string;
  /** 给url使用 */
  params?: string;
  type?: 'push' | 'replace' | 'link' | 'open';
  onClick?(): void;
}

export default function BaseLink<T extends keyof RouteProps> ({ children, className = '', type = 'push', query, params, route, url, onClick }: PropsWithChildren<BaseLinkProps<T>>) {
  return (
    <a
      // 添加连接让其可以右键打开
      href={formatUrl(route ? getRoutePath(route) : url || '', query || params)}
      className={className}
      onClick={e => {
        /** 阻止默认事件，避免点击默认的href跳转 */
        e.preventDefault();
        e.nativeEvent.preventDefault();
        route ? navigation[type](route, query) : url ? history[type](url, params) : void 0;
        onClick?.();
      }}>
      {children}
    </a>
  );
}
