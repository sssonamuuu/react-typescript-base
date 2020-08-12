import * as React from 'react';
import { PageHeader as AntdPageHeader } from 'antd';
import { PageHeaderProps as AntdPageHeaderProps } from 'antd/lib/page-header';
import * as style from './index.less';

interface PageHeaderProps extends AntdPageHeaderProps{
  fixed?: boolean;
}

export default function PageHeader ({ className = '', fixed = false, ...props }: React.PropsWithChildren<PageHeaderProps>) {
  return (
    <AntdPageHeader {...props} ghost={false} className={`${style.header} ${fixed ? style.fixed : ''} ${className}`} />
  );
}
