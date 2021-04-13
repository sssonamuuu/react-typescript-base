import React, { ComponentType, createElement, useEffect, useState } from 'react';
import BasePlaceholder from 'components/basePlaceholder';
import Incorrect from 'classes/Incorrect';
import errorCode from 'enumerations/errorCode';

/**
 * 异步加载组件，并在加载中以及加载失败返回一个占位组件
 *
 * - `Route` 配置的 `component` 可以直接使用使用
 * @example asyncLoadComponent(() => import('pages/Home'))
 *
 * - 当然也可以添加 `webpackChunkName` 注释增加 `webpack` 分块编译输出的文件名
 * @example asyncLoadComponent(() => import(\/* webpackChunkName: "page-home" *\/ 'pages/Home'))
 */
export default function asyncLoadComponent (fn: () => Promise<{ default: ComponentType<any> }>) {
  return (props: any) => {
    const [component, setComponent] = useState(<BasePlaceholder status={new Incorrect(errorCode.loading.code, '正在加载页面资源')} />);

    useEffect(() => {
      fn().then(res => setComponent(createElement(res.default, props))).catch(() => setComponent(<BasePlaceholder status={new Incorrect(errorCode.default.code, '页面资源加载失败')} />));
    }, []);

    return component;
  };
}
