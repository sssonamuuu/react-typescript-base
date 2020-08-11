import * as React from 'react';
import { Layout } from 'antd';
import * as globalStyle from 'index.less';

export default function LayoutPage ({ children }: React.PropsWithChildren<{}>) {
  return (
    <Layout className={globalStyle.fullHeight}>
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Sider>menu</Layout.Sider>
        <Layout.Content>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
