import * as React from 'react';
import { Button } from 'antd';
import * as style from './index.less';

export default function HomeIndexPage () {
  return (
    <div>
      <Button>antd主色调测试</Button>
      <p className={style.testColor}>stylus 主色调测试</p>
    </div>
  );
}
