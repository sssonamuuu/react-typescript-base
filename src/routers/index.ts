import { ComponentType } from 'react';
import asyncLoadComponent from 'utils/asyncLoadComponent';
import Layout from 'layouts/default';
import { XxxDetailPageQuery } from 'pages/xxx/detail';

export interface RouteItemProps {
  path: string | string[];

  component?: ComponentType<any>;

  /** 会更新document title */
  title: string;

  layout?: ComponentType<any>;

  /** 用于指定部分不在菜单上的路由指定当前菜单 */
  activeMenusPath?: string;
}

/** $query 这里不使用，仅用于ts签名获取 */
function generatorRoute <T> ({ ...params }: RouteItemProps): RouteItemProps & { $query: T } {
  return { ...params, $query: {} as T };
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

export const isPathParamRoute = (path: string) => /\/:/.test(path);

export type RouteProps = typeof routes;

export interface RouteItemWithNameProps extends RouteItemProps { $name: keyof RouteProps }

export const routesArr: RouteItemWithNameProps[] = Object.entries(routes).map(([key, value]) => ({ ...value, $name: key as keyof RouteProps }));
/** 以 url(全小写，带首/) 为 key，方便通过url查找查找 (不包含带有pathparam的地址) */
export const routesMap: { [key: string]: RouteItemWithNameProps } = {};

export const pathKeyRoutes: (RouteItemWithNameProps & { path: string })[] = [];

routesArr.forEach(route => {
  const paths = Array.isArray(route.path) ? route.path : [route.path];

  paths.forEach(path => {
    isPathParamRoute(path) ? pathKeyRoutes.push({ ...route, path }) : routesMap[path.toLowerCase()] = route;
  });
});
