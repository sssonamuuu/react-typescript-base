import * as React from 'react';
import { Button } from 'antd';
import * as style from './index.less';
import * as globalStyle from 'index.less';
import globalConfig from 'config.toml';

export default function HomeIndexPage () {
  return (
    <div className={`${globalStyle.px20} ${globalStyle.py20}`}>
      <Button>antd主色调测试</Button>
      <p className={style.testColor}>less 主色调测试</p>
      <p style={{ color: globalConfig.theme['primary-color'] }}>js 主色调测试</p>
    </div>
  );
}
