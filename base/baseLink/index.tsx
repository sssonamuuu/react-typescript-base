import React, { PropsWithChildren } from 'react';
import { RouteProps } from 'routers';
import { navigation } from 'utils/navigation';

interface BaseLinkProps<T extends keyof RouteProps> {
  className?: string;
  route: T;
  /** 给 query 使用 */
  query?: RouteProps[T]['$query'];
  type?: 'push' | 'replace' | 'link' | 'open';
  style?: React.CSSProperties;
  onClick?(): void;
}

/** 使用 route+query，非前后端分离页面使用 url+params */
export default function BaseLink<T extends keyof RouteProps> ({
  children,
  className = '',
  type = 'push',
  query,
  route,
  onClick,
  style,
}: PropsWithChildren<BaseLinkProps<T>>) {
  return (
    <a
      // 添加连接让其可以右键打开
      href={navigation.formatUrl(route, query)}
      className={className}
      style={style}
      onClick={e => {
        /** 阻止默认事件，避免点击默认的href跳转 */
        e.preventDefault();
        e.nativeEvent.preventDefault();
        navigation[type](route, query);
        onClick?.();
      }}>
      {children}
    </a>
  );
}
