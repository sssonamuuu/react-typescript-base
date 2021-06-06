import React, { PropsWithChildren, useEffect } from 'react';
import { Layout } from 'antd';
import globalStyle from 'index.less';
import Header from './Header';
import Menu from './Menu';
import globalConfig from 'configs';

export default function LayoutPage ({ children }: PropsWithChildren<{}>) {
  /** 使用了 layout 使用局部滚动，隐藏全局滚动 */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    () => document.body.style.overflow = 'auto';
  }, []);

  return (
    <Layout className={globalStyle.fullHeight}>
      <Header />
      <Layout>
        <Menu />
        <Layout.Content className={globalConfig.theme.scrollRootClassName} style={{ padding: 16, overflow: 'auto' }}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
