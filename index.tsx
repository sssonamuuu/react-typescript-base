import 'index.less';

import React, { createElement, useMemo, useReducer } from 'react';
import ReactDOM from 'react-dom';

import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

import { Switch, Route, Router } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { RouteItemProps, routesArr } from 'routers';
import globalConfig from 'configs';
import moment from 'moment';
import { StoreContext, storeDefaultValue, storeReducer } from 'hooks/useStore';
import { navigation, useLocationChange } from 'utils/navigation';
import { singleOrArrayToArray } from 'utils/dataTypeTools';

moment.locale('zh-cn');

message.config({ prefixCls: `${globalConfig.theme['ant-prefix']}-message` });

const DEFAULT_LAYOUT_MAP_KEY = 'default';

const App = () => {
  const [stores, reducer] = useReducer(storeReducer, storeDefaultValue);

  const mapRoutes = useMemo(() => {
    const map = new Map<React.ComponentType<any> | typeof DEFAULT_LAYOUT_MAP_KEY, RouteItemProps[]>();
    routesArr.forEach(route => {
      const current = map.get(route.layout || DEFAULT_LAYOUT_MAP_KEY) || [];
      current.push(route);
      map.set(route.layout || DEFAULT_LAYOUT_MAP_KEY, current);
    });
    return map;
  }, []);

  useLocationChange(() => {
    const currentRoute = navigation.findCurrentRoute(location.pathname);

    document.title = currentRoute ? currentRoute.title : 'unknow';
  });

  return (
    <ConfigProvider
      locale={zhCN}
      prefixCls={globalConfig.theme['ant-prefix']}
      getPopupContainer={() => document.querySelector(`.${globalConfig.theme.scrollRootClassName}`) || document.body}>
      <StoreContext.Provider value={{ stores, reducer }}>
        <Router history={navigation.history}>
          <Switch>
            {[...mapRoutes.keys()].map(layout => {
              const routes = mapRoutes.get(layout) || [];
              const paths = routes.reduce<string[]>((p, c) => [...p, ...singleOrArrayToArray(c.path)], []);
              const children = routes.map(child => <Route key={`${child.path}`} exact path={child.path} component={child.component} />);

              return layout === DEFAULT_LAYOUT_MAP_KEY ? children : (
                <Route key={`${paths}`} exact path={paths}>
                  {createElement(layout, { children })}
                </Route>
              );
            })}
          </Switch>
        </Router>
      </StoreContext.Provider>
    </ConfigProvider>
  );
};

ReactDOM.render(<App />, document.querySelector(`#${globalConfig.theme.rootId}`));
