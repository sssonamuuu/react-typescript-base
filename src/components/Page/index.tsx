import * as React from 'react';
import * as style from './index.less';
import * as globalStyle from 'index.less';
import PageHeader from './PageHeader';
import { PageHeaderProps } from 'antd/lib/page-header';

export const ANTD_POPUP_CONTAINER = 'JS-antd-popup-container';

interface PageProps {
  /** document.title 显示的标题 */
  title?: string;
  header?: React.FunctionComponentElement<PageHeaderProps>;
  className?: string;
  contentSpace?: React.CSSProperties['padding'];
  contentClassName?: string;
  /** 是否是满屏布局，不需要滚动条，除去header区域内容铺满 */
  fullContent?: boolean;
}

export default function Page ({ children, className = '', contentClassName = '', title, header, contentSpace = 20, fullContent = false }: React.PropsWithChildren<PageProps>) {
  React.useEffect(() => {
    title && (document.title = title);
    return () => {
      document.title = '加载中...';
    };
  }, []);

  return (
    <main className={`${fullContent ? style.full : ANTD_POPUP_CONTAINER} ${style.container} ${className}`}>
      {header}
      <section style={{ padding: contentSpace }} className={`${contentClassName} ${globalStyle.flex1}`}>
        {children}
      </section>
    </main>
  );
}

Page.Header = PageHeader;
