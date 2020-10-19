import * as React from 'react';
import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import style from './index.less';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  path?: string;
  breadcrumbName: string;
  children?: Omit<Breadcrumb, 'children'>[];
}

interface BasePageHeaderProps extends Omit<PageHeaderProps, 'breadcrumb'>{
  fixed?: boolean;
  breadcrumb?: Breadcrumb[];
}

export default function BasePageHeader ({ className = '', fixed = false, breadcrumb, ...props }: React.PropsWithChildren<BasePageHeaderProps>) {
  const currentBreadcrumb = React.useMemo<PageHeaderProps['breadcrumb']>(() => ({
    routes: breadcrumb as any,
    // 面包屑默认使用hash跳转，需要处理
    itemRender: (route, params, routes, paths) =>
      /** 最后一个或者没有地址的，不使用link */
      !route.path || routes.indexOf(route) === routes.length - 1 ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
    ,
  }), [breadcrumb]);
  return (
    <PageHeader {...props} breadcrumb={currentBreadcrumb} ghost={false} className={`${style.header} ${fixed ? style.fixed : ''} ${className}`} />
  );
}
