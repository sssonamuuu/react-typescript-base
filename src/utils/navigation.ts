/**
 * 未知类型 使用 history.push/replace/link/open
 * 已知类型 使用 navigation.push/replace/link/open
 */

import { RouteItemWithNameProps, RouteProps, routes, routesMap } from 'routers';
import { createBrowserHistory, History } from 'history';
import qs from 'qs';
import { useEffect } from 'react';

/** 查找当前的路由配置 */
function findCurrentRoute (pathname: string = location.pathname): RouteItemWithNameProps | undefined {
  return routesMap[pathname.toLowerCase()];
}

export const history = createBrowserHistory() as (History & {
  push (path: string, query?: any): void;
  replace (path: string, query?: any): void;
  link (path: string, query?: any): void;
  open (path: string, query?: any): void;
});

const { push: _push, replace: _replace } = history;

export function formatUrl (path: string, query?: any) {
  return `${path}${query ? '?' : ''}${qs.stringify(query)}`;
}

history.push = function (path: string, query?: any) {
  const url = formatUrl(path, query);
  findCurrentRoute(path) ? _push(url) : location.href = url;
};

history.replace = function (path: string, query?: any) {
  const url = formatUrl(path, query);
  findCurrentRoute(path) ? _replace(url) : location.href = url;
};

history.link = function (path: string, query?: any) {
  location.href = formatUrl(path, query);
};

history.open = function (path: string, query?: any) {
  window.open(formatUrl(path, query));
};

export function getRoutePath <K extends keyof RouteProps> (name: K): string {
  return Array.isArray(routes[name]?.path) ? routes[name].path[0] : routes[name]?.path as string;
}

function link <K extends keyof RouteProps> (name: K, query?: RouteProps[K]['$query']) {
  history.link(getRoutePath(name), query);
}

function push <K extends keyof RouteProps> (name: K, query?: RouteProps[K]['$query']) {
  history.push(getRoutePath(name), query);
}

function replace <K extends keyof RouteProps> (name: K, query?: RouteProps[K]['$query']) {
  history.replace(getRoutePath(name), query);
}

function open <K extends keyof RouteProps> (name: K, query?: RouteProps[K]['$query']) {
  history.open(getRoutePath(name), query);
}

export function useLocationChange (fn: () => void) {
  useEffect(() => {
    fn();
    history.listen(() => fn());
  }, []);
}

function getQuery <T> (format?: Partial<Record<keyof T, 'string' | 'number' | 'boolean'>>): Partial<T> {
  const query = qs.parse(history.location.search.replace(/^\?/, '')) as unknown as T;

  /** 根据 param 类型 格式化 参数 */
  Object.entries(format || {}).forEach(([key, value]) => {
    if (value === 'number') {
      const number = Number(query[key]);
      query[key] = isNaN(number) ? void 0 : number;
    } else if (value === 'boolean') {
      query[key] = query[key] === 'true' ? true : false as any;
    }
  });

  return query;
}

export const navigation = {
  getQuery,
  link,
  push,
  replace,
  open,
  findCurrentRoute,
};

