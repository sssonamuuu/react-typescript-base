window.Promise = Promise;

import 'index.less';

import React, { createElement, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { ANTD_POPUP_CONTAINER } from 'components/basePage';
import routes from 'routers';
import globalConfig from 'configs';
import useHistory from 'hooks/useHistory';
import moment from 'moment';
import { StoreContext, storeDefaultValue, storeReducer } from 'stores';

moment.locale('zh-cn');

message.config({ prefixCls: `${globalConfig.theme['ant-prefix']}-message` });

const Index = () => {
  const history = useHistory();

  function findCurrentRoute (pathname: string) {
    for (const route of routes) {
      for (const child of route.routes) {
        if (Array.isArray(child.path) ? child.path.includes(pathname) : child.path === pathname) {
          return child;
        }
      }
    }
    return void 0;
  }

  function setTitle (title?: string) {
    document.title = title || 'unset';
  }

  useEffect(() => {
    setTitle(findCurrentRoute(history.location.pathname)?.title);
    history.listen((s: any) => setTitle(findCurrentRoute(s.pathname)?.title));
  }, []);

  return (
    <React.Fragment>
      {routes.map(route => {
        const paths = route.routes.reduce<string[]>((p, c) => [...p, ...Array.isArray(c.path) ? c.path : c.path ? [c.path] : []], []);
        const children = route.routes.map(child => <Route key={`${child.path}`} exact path={child.path} component={child.component} />);

        return route.layout ? (
          <Route key={`${paths}`} exact path={paths}>
            {createElement(route.layout, { children })}
          </Route>
        ) : children;
      })}
    </React.Fragment>
  );
};

const App = () => {
  const [stores, reducer] = useReducer(storeReducer, storeDefaultValue);

  /**
     * 设置滚动区域
     *
     * 如果是带有 layout 的页面使用 layout 上的 class JS-antd-popup-container
     *
     * 否则为 body 滚动
     *
     */
  return (

    <ConfigProvider
      locale={zhCN}
      prefixCls={globalConfig.theme['ant-prefix']}
      getPopupContainer={() => document.querySelector(`.${ANTD_POPUP_CONTAINER}`) || document.body}>
      <StoreContext.Provider value={{ stores, reducer }}>
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Index} />
          </Switch>
        </BrowserRouter>
      </StoreContext.Provider>
    </ConfigProvider>
  );
};

ReactDOM.render(<App />, document.querySelector(`#${globalConfig.theme.rootId}`));
