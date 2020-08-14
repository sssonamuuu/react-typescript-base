import * as React from 'react';
import style from './index.less';
import globalStyle from 'index.less';
import BasePageHeader from './BasePageHeader';
import { PageHeaderProps } from 'antd/lib/page-header';

export const ANTD_POPUP_CONTAINER = 'JS-antd-popup-container';

/** 为保证页面使用多个块时保证间距一直，使用此处到处的值，如果有传入则使用页面自己的间距 */
export const CONTENT_SPACE_DEFAULT = 10;

interface BasePageProps {
  header?: React.FunctionComponentElement<PageHeaderProps>;
  className?: string;
  contentSpace?: React.CSSProperties['padding'];
  contentClassName?: string;
  /** 是否是满屏布局，不需要滚动条，除去header区域内容铺满 */
  fullContent?: boolean;
}

export default function BasePage ({ children, className = '', contentClassName = '', header, contentSpace = CONTENT_SPACE_DEFAULT, fullContent = false }: React.PropsWithChildren<BasePageProps>) {
  return (
    <main className={`${fullContent ? style.full : ANTD_POPUP_CONTAINER} ${style.container} ${className}`}>
      {header}
      <section style={{ padding: contentSpace }} className={`${contentClassName} ${globalStyle.flex1}`}>
        {children}
      </section>
    </main>
  );
}

BasePage.Header = BasePageHeader;
