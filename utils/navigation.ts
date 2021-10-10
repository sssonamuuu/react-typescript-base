/**
 * 未知类型 使用 history.push/replace/link/open
 * 已知类型 使用 navigation.push/replace/link/open
 */

import { isPathParamRoute, pathKeyRoutes, RouteItemWithNameProps, RouteProps, routes, routesMap } from 'routers';
import { createBrowserHistory } from 'history';
import qs from 'qs';
import { useEffect } from 'react';
import { getSingleOrArrayFirst } from './dataTypeTools';

/** 查找当前的路由配置 */
function findCurrentRoute (url: string = location.pathname): RouteItemWithNameProps | undefined {
  const pathname = url?.split('?')[0] || '';
  return routesMap[pathname.toLowerCase()] || pathKeyRoutes.find(route => new RegExp(`^${route.path.replace(/\/:[^/]+/g, '/([^/]+)')}$`, 'i').test(pathname));
}

const history = createBrowserHistory();

export function useLocationChange (fn: () => void) {
  useEffect(() => {
    fn();
    history.listen(() => fn());
  }, []);
}

function formatUrl <K extends keyof RouteProps> (name: K, query?: any) {
  /** 如果 通过 name 查不到则直接取 name 作为 url */
  let url = getSingleOrArrayFirst(routes[name]?.path) ?? name;

  const currentRoute = findCurrentRoute(url);

  /** pathparam 都转换过，path 必定是 string */
  if (typeof currentRoute?.path === 'string' && isPathParamRoute(currentRoute.path)) {
    url = currentRoute.path.split('/').map(item => item.startsWith(':') ? query?.[item.slice(1)] : item).join('/');
  }

  if (query && Object.keys(query).length) {
    url += (url.includes('?') ? '&' : '?') + qs.stringify(query);
  }
  return url;
}

export function getRoutePath <K extends keyof RouteProps> (name: K): string {
  return getSingleOrArrayFirst(routes[name]?.path)!;
}

function getQuery <T> (format?: Partial<Record<keyof T, 'string' | 'number' | 'boolean'>>): Partial<T> {
  const query = qs.parse(location.search.replace(/^\?/, '')) as unknown as T;
  const currentRoute = findCurrentRoute();

  /** pathparam 都转换过，path必定是 string */
  if (typeof currentRoute?.path === 'string' && isPathParamRoute(currentRoute.path)) {
    const localPathArr = location.pathname.split('/');
    currentRoute.path.split('/').forEach((item, index) => item.startsWith(':') && (query[item.slice(1)] = localPathArr[index]));
  }

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

interface NavigationFn {
  <K extends keyof RouteProps> (name: K, query?: RouteProps[K]['$query']): void;
}

const link: NavigationFn = (name, query) => {
  location.href = formatUrl(name, query);
};

const open: NavigationFn = (name, query) => {
  window.open(formatUrl(name, query));
};

const push: NavigationFn = (name, query) => {
  const url = formatUrl(name, query);
  findCurrentRoute(url) ? history.push(url) : location.href = url;
};

const replace: NavigationFn = (name, query) => {
  const url = formatUrl(name, query);
  findCurrentRoute(url) ? history.replace(url) : location.href = url;
};

export const navigation = {
  history,
  getQuery,
  link,
  push,
  replace,
  open,
  formatUrl,
  back: history.goBack,
  findCurrentRoute,
};

