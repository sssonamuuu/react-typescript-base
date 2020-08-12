import * as React from 'react';
import { Button } from 'antd';
import * as style from './index.less';
import * as globalStyle from 'index.less';
import globalConfig from 'config.toml';
import Page from 'components/Page';
import { hot } from 'react-hot-loader/root';

export default hot(() => (
  <Page>
    <Button>antd主色调测试</Button>
    <p className={style.testColor}>less 主色调测试</p>
    <p className={globalStyle.fcPrimary}>global style 主色调测试</p>
    <p style={{ color: globalConfig.theme['primary-color'] }}>js 主色调测试</p>
  </Page>
));
