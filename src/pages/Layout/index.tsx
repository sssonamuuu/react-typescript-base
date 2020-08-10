import * as React from 'react';
import { Layout } from 'antd';

export default function LayoutPage ({ children }: React.PropsWithChildren<{}>) {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout.Content>
        <Layout.Sider>menu</Layout.Sider>
        <Layout.Content>
          {children}
        </Layout.Content>
      </Layout.Content>
    </Layout>
  );
}
