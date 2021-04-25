import React, { PropsWithChildren } from 'react';
import { RouteProps } from 'routers';
import { navigation, history } from 'utils/navigation';

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

export default function BaseLink<T extends keyof RouteProps> ({ children, className = '', type = 'push', query, route, url, onClick }: PropsWithChildren<BaseLinkProps<T>>) {
  return (
    <a
      className={className}
      onClick={() => {
        route ? navigation[type](route, query) : url ? history[type](url, query) : void 0;
        onClick?.();
      }}>
      {children}
    </a>
  );
}
