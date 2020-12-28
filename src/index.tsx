window.Promise = Promise;

import 'index.less';

import React, { createElement } from 'react';
import ReactDOM from 'react-dom';

import zhCN from 'antd/es/locale/zh_CN';

import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { ANTD_POPUP_CONTAINER } from 'components/basePage';
import routes from 'routers';
import globalConfig from 'configs';

message.config({ prefixCls: `${globalConfig.theme['ant-prefix']}-message` });

const App = () => (
  /**
     * 设置滚动区域
     *
     * 如果是带有 layout 的页面使用 layout 上的 class JS-antd-popup-container
     *
     * 否则为 body 滚动
     *
     */
  <ConfigProvider
    prefixCls={globalConfig.theme['ant-prefix']}
    locale={zhCN}
    getPopupContainer={() => document.querySelector(`.${ANTD_POPUP_CONTAINER}`) || document.body}>
    <BrowserRouter>
      <Switch>
        {/* 这些必须放在最前面，否则会优先渲染 path = '/' 的路由*/}
        {routes.map(route => {
          const paths = route.children ? route.children.reduce<string[]>((p, c) => [...p, ...Array.isArray(c.path) ? c.path : c.path ? [c.path] : []], []) : route.path;
          const children = route.children?.map(child => <Route key={`child.path`} exact path={child.path} component={child.component} />);

          if (route.component && route.children) {
            return <Route key={`${paths}`} exact path={paths} component={() => createElement(route.component!, { children })} />;
          }

          return <Route key={`${paths}`} exact path={paths} component={route.component} />;
        })}
      </Switch>
    </BrowserRouter>
  </ConfigProvider>
);

ReactDOM.render(<App />, document.querySelector(`#${globalConfig.theme.rootId}`));
