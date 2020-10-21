import 'index.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import zhCN from 'antd/es/locale/zh_CN';

import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Layout from 'pages/Layout';
import { ConfigProvider } from 'antd';
import { ANTD_POPUP_CONTAINER } from 'components/BasePage';

import { hot } from 'react-hot-loader/root';
import { routerWithInLayout, routerWithOutLayout } from 'configs/routres';
import globalConfig from 'config.toml';

const App = hot(() => (
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
        {routerWithOutLayout.map(route => <Route key={`${route.path}`} {...route} />)}
        <Route
          path="/"
          component={() => (
            <Layout>
              {routerWithInLayout.map(route => <Route key={`${route.path}`} {...route} />)}
            </Layout>
          )} />
      </Switch>
    </BrowserRouter>
  </ConfigProvider>
));

ReactDOM.render(<App />, document.querySelector(`#${globalConfig.theme.rootId}`));
