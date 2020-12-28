import { ComponentType } from 'react';
import { RouteProps } from 'react-router-dom';
import asyncLoadComponent from 'utils/asyncLoadComponent';

interface RouteConfig {
  layout?: ComponentType<any>;
  routes: Array<RouteProps & {
    title: string;
    /** 当前路由的活跃菜单 path */
    activeMenuPath?: string;
  }>;
}

const routes: RouteConfig[] = [
  {
    layout: void 0,
    routes: [
      {
        title: '登录',
        path: '/login',
        component: asyncLoadComponent(() => import(/* webpackChunkName: "page-login" */ 'pages/login')),
      },
    ],
  },
  {
    layout: asyncLoadComponent(() => import(/* webpackChunkName: "layout-default" */ 'layouts/default')),
    routes: [
      {
        title: '首页',
        path: '/',
        component: asyncLoadComponent(() => import(/* webpackChunkName: "page-home" */ 'pages/home')),
      },
      {
        title: 'xxx',
        path: '/xxx',
        component: asyncLoadComponent(() => import(/* webpackChunkName: "page-xxx-list" */ 'pages/xxx/list')),
      },
      {
        title: 'xxx-detail',
        path: '/xxx-detail',
        component: asyncLoadComponent(() => import(/* webpackChunkName: "page-xxx-detail" */ 'pages/xxx/detail')),
        activeMenuPath: '/xxx',
      },
    ],
  },
];

export default routes;
