import * as React from 'react';
import { Layout } from 'antd';
import globalStyle from 'index.less';
import Header from './Header';
import Menu from './Menu';

export default function LayoutPage ({ children }: React.PropsWithChildren<{}>) {
  /** 使用了 layout 使用局部滚动，隐藏全局滚动 */
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    () => document.body.style.overflow = 'auto';
  }, []);

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
