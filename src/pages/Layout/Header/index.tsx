import * as React from 'react';
import { Layout } from 'antd';
import * as style from './index.less';

export default function Header () {
  return (
    <Layout.Header className={style.header}>标题</Layout.Header>
  );
}
