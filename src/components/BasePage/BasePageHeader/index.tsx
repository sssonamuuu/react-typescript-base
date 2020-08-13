import * as React from 'react';
import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import style from './index.less';

interface BasePageHeaderProps extends PageHeaderProps{
  fixed?: boolean;
}

export default function BasePageHeader ({ className = '', fixed = false, ...props }: React.PropsWithChildren<BasePageHeaderProps>) {
  return (
    <PageHeader {...props} ghost={false} className={`${style.header} ${fixed ? style.fixed : ''} ${className}`} />
  );
}
