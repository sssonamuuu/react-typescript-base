import * as React from 'react';
import Placeholder from 'components/Placeholder';

/**
 * 异步加载组件，并在加载中以及加载失败返回一个占位组件
 *
 * - `Route` 配置的 `component` 可以直接使用使用
 * @example asyncLoadComponent(() => import('pages/Home'))
 *
 * - 当然也可以添加 `webpackChunkName` 注释增加 `webpack` 分块编译输出的文件名
 * @example asyncLoadComponent(() => import(\/* webpackChunkName: "page-home" *\/ 'pages/Home'))
 */
export default function asyncLoadComponent (fn: () => Promise<{ default: React.ComponentType }>) {
  return (props: any) => {
    const [component, setComponent] = React.useState(<Placeholder />);

    React.useEffect(() => {
      fn().then(res => setComponent(React.createElement(res.default, props))).catch(() => setComponent(<Placeholder />));
    }, []);

    return component;
  };
}
