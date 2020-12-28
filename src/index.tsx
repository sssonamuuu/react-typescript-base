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
import Layout from 'layouts/default';

message.config({ prefixCls: `${globalConfig.theme['ant-prefix']}-message` });

const Index = () => (
  <React.Fragment>
    {routes.map(route => {
      const paths = route.routes.reduce<string[]>((p, c) => [...p, ...Array.isArray(c.path) ? c.path : c.path ? [c.path] : []], []);
      const children = route.routes.map(child => <Route key={`${child.path}`} exact path={child.path} component={child.component} />);

      if (route.layout) {
        return (
          <Route key={`${paths}`} exact path={paths}>
            {createElement(Layout, { children })}
          </Route>
        );
      }

      return children;
    })}
  </React.Fragment>
);

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
    locale={zhCN}
    prefixCls={globalConfig.theme['ant-prefix']}
    getPopupContainer={() => document.querySelector(`.${ANTD_POPUP_CONTAINER}`) || document.body}>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Index} />
      </Switch>
    </BrowserRouter>
  </ConfigProvider>
);

ReactDOM.render(<App />, document.querySelector(`#${globalConfig.theme.rootId}`));
