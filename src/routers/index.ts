import { RouteProps } from 'react-router-dom';
import asyncLoadComponent from 'utils/asyncLoadComponent';

interface RouteConfig extends Omit<RouteProps, 'children'> {
  /** 当前路由的活跃菜单 path */
  activeMenuPath?: string;
  /** 如果有children，path不生效，会读取children的内容 */
  path?: string | string[];
  children?: Omit<RouteConfig, 'children'>[];
}

const routes: RouteConfig[] = [
  {
    path: '/login',
    component: asyncLoadComponent(() => import(/* webpackChunkName: "page-login" */ 'pages/login')),
  },
  {
    component: asyncLoadComponent(() => import(/* webpackChunkName: "layout-default" */ 'layouts/default')),
    children: [
      {
        path: '/',
        component: asyncLoadComponent(() => import(/* webpackChunkName: "page-home" */ 'pages/home')),
      },
      {
        path: '/xxx',
        component: asyncLoadComponent(() => import(/* webpackChunkName: "page-xxx-list" */ 'pages/xxx/list')),
      },
      {
        path: '/xxx-detail',
        component: asyncLoadComponent(() => import(/* webpackChunkName: "page-xxx-detail" */ 'pages/xxx/detail')),
        activeMenuPath: '/xxx',
      },
    ],
  },
];

export default routes;
