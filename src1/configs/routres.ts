import { RouteProps } from 'react-router-dom';
import asyncLoadComponent from 'utils/asyncLoadComponent';

interface RouteConfig extends RouteProps {
  /** 当前路由的活跃菜单 path */
  activeMenuPath?: string;
}

export const routerWithOutLayout: RouteConfig[] = [
  {
    path: '/login',
    exact: true,
    component: asyncLoadComponent(() => import(/* webpackChunkName: "page-login" */ 'pages/login')),
  },
];

export const routerWithInLayout: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: asyncLoadComponent(() => import(/* webpackChunkName: "page-home" */ 'pages/home')),
  },
  {
    path: '/xxx',
    exact: true,
    component: asyncLoadComponent(() => import(/* webpackChunkName: "page-xxx-list" */ 'pages/xxx/list')),
  },
  {
    path: '/xxx-detail',
    exact: true,
    component: asyncLoadComponent(() => import(/* webpackChunkName: "page-xxx-detail" */ 'pages/xxx/detail')),
    activeMenuPath: '/xxx',
  },
];

