import 'index.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Layout from 'pages/Layout';
import asyncLoadComponent from 'utils/asyncLoadComponent';
import { ConfigProvider } from 'antd';
import { hot } from 'react-hot-loader/root';
import { ANTD_POPUP_CONTAINER } from 'components/Page';

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
    getPopupContainer={() => document.querySelector(`.${ANTD_POPUP_CONTAINER}`) || document.body}>
    <BrowserRouter>
      <Switch>
        <Route
          path="/"
          component={() => (
            <Layout>
              <Route path="/" exact component={asyncLoadComponent(() => import(/* webpackChunkName: "page-home" */ 'pages/Home'))} />
            </Layout>
          )} />
      </Switch>
    </BrowserRouter>
  </ConfigProvider>
));

ReactDOM.render(<App />, document.querySelector('#app'));
