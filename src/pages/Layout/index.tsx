import * as React from 'react';
import { Layout } from 'antd';
import * as globalStyle from 'index.less';
import Header from './Header';
import Menu from './Menu';

export default function LayoutPage ({ children }: React.PropsWithChildren<{}>) {
  return (
    <Layout className={globalStyle.fullHeight}>
      <Header />
      <Layout>
        <Menu />
        {children}
      </Layout>
    </Layout>
  );
}
