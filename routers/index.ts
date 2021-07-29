import { ComponentType } from 'react';
import asyncLoadComponent from 'utils/asyncLoadComponent';
import Layout from 'layouts/default';
import { XxxDetailPageQuery } from 'pages/xxx/detail';
import { singleOrArrayToArray } from 'utils/dataTypeTools';

export interface RouteItemProps {
  path: string | string[];

  component?: ComponentType<any>;

  /** 会更新document title */
  title: string;

  layout?: ComponentType<any>;

  /** 用于指定部分不在菜单上的路由指定当前菜单 */
  activeMenusPath?: string;
}

/**
 * $query 这里不使用，仅用于ts签名获取
 *
 * $name 在初始值时会注入
 */
export function generatorRoute <T> (params: RouteItemProps): RouteItemWithNameProps & { $query: T } {
  return { ...params, $query: {} as T, $name: '' as any };
}

export const routes = {
  login: generatorRoute({
    title: '登录',
    path: '/login',
    component: asyncLoadComponent(() => import('pages/login')),
  }),
  index: generatorRoute({
    layout: Layout,
    title: '首页',
    path: '/',
    component: asyncLoadComponent(() => import('pages/home')),
  }),
  list: generatorRoute({
    layout: Layout,
    title: 'xxx',
    path: '/xxx',
    component: asyncLoadComponent(() => import('pages/xxx/list')),
  }),
  detail: generatorRoute<XxxDetailPageQuery>({
    layout: Layout,
    title: 'xxx-detail',
    path: '/xxx-detail',
    component: asyncLoadComponent(() => import('pages/xxx/detail')),
    activeMenusPath: '/xxx',
  }),
};

/** 给 routes 的每一项添加 $name 以便与 generatorRoute 的签名匹配 */
Object.entries(routes).forEach(([key, value]) => value.$name = key as unknown as keyof RouteProps);

export const isPathParamRoute = (path: string) => /\/:/.test(path);

export type RouteProps = typeof routes;

export interface RouteItemWithNameProps extends RouteItemProps { $name: keyof RouteProps }

export const routesArr: RouteItemWithNameProps[] = Object.values(routes);

/** 以 url(全小写，带首/) 为 key，方便通过url查找查找 (不包含带有pathparam的地址 如 /:id) */
export const routesMap: { [key: string]: RouteItemWithNameProps } = {};

/**
 * 所有 pathparam的地址，如果 path 中有两个，会被分解未两个
 *
 * 如： { ...options, path: ['/a/:id', '/b/:id'] }
 *
 * 会被拆分未 { ...options, path: '/a/:id' } 和 { ...options, path: '/b/:id' } 两个路由
 */
export const pathKeyRoutes: (Omit<RouteItemWithNameProps, 'path'> & { path: string })[] = [];

routesArr.forEach(route => {
  singleOrArrayToArray(route.path).forEach(path => {
    isPathParamRoute(path) ? pathKeyRoutes.push({ ...route, path }) : routesMap[path.toLowerCase()] = route;
  });
});
