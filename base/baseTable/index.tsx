import globalStyle from 'index.less';
import React, { useMemo } from 'react';
import { Table, Tooltip } from 'antd';
import { TableProps, ColumnType, ColumnsType } from 'antd/lib/table';
import { FetchesItemProps } from 'hooks/useRequest';
import { isNullOrUndefined } from 'utils/dataTypeTools';
import { DEFAULT_PAGESIZE, DEFAULT_STRING } from 'datas/consts';
import { GetRowKey } from 'rc-table/lib/interface';

interface BaseColumnType<T> extends Omit<ColumnType<T>, 'dataIndex' | 'ellipsis'> {
  dataIndex?: keyof T;
  /**
   * 默认值，可以覆盖 table 以及 group 上的配置
   *
   * @default '--'
  */
  defalutValue?: string;
  /**
   * 超出是否省略，可以覆盖 table 以及 group 上的配置
   *
   * @see {@link BaseTableProps.ellipsis}
   */
  ellipsis?: BaseTableProps<T>['ellipsis'];
  /**
   * 是否显示tooltips，如果有设置 ellipsis，默认 true，可以覆盖 table 以及 group 上的配置
   *
   * @see {@link BaseTableProps.showTooltips}
   */
  showTooltips?: boolean | ((_: any, item: T, index: number) => React.ReactNode);
  hidden?: boolean;
}

interface BaseColumnGroupType<T> extends Omit<BaseColumnType<T>, 'dataIndex'> {
  children: BaseColumnsType<T>;
}

type BaseColumnsType<T> = (BaseColumnGroupType<T> | BaseColumnType<T>)[];

interface BaseTableProps<T = unknown> extends Omit<TableProps<T>, 'children' | 'columns' | 'rowKey'> {
  rowKey?: keyof T | GetRowKey<T>;
  /**
   * 统一配置默认值，默认 --，可以通过 clomn 上的配置覆盖
   *
   * @default '--'
   */
  defalutValue?: string;
  /**
   * 统一配置是否超出省略
   *
   * true 表示 1
   *
   * @default false
   */
  ellipsis?: boolean | 1 | 2 | 3;
  /**
   * 统一配置和是否显示tooltip的内容
   *
   * @default false/true(if ellipsis)
   */
  showTooltips?: boolean;
  columns?: BaseColumnsType<T>;
  /**
   * 替代 loading dataSource pagination
   *
   * 如果存在：
   *  loading dataSource 无效
   *  pagination 回合并原有字段
   */
  request?: [request: FetchesItemProps<PaginationRes<T>>, onPaginationChange: ((pagination: PaginationReq<{}>) => void)];
}

function formatColumns<T> (
  columns: BaseColumnsType<T> = [],
  parentDefaultValue: string = DEFAULT_STRING,
  parentEllipsis: BaseTableProps<T>['ellipsis'],
  parentShowTooltips: BaseTableProps<T>['showTooltips'],
): ColumnsType<T> {
  return columns.reduce<ColumnsType<T>>((p, {
    hidden,
    ellipsis = parentEllipsis ?? false,
    /** 如果 有 超出隐藏，默认 showTooltips=true */
    showTooltips = parentShowTooltips ?? !!ellipsis,
    defalutValue = parentDefaultValue,
    ...c
  }) => {
    if (hidden) {
      return p;
    }

    if ('children' in c) {
      return [...p, { ...c, children: c.children.length ? formatColumns(c.children, defalutValue, ellipsis, parentShowTooltips) : void 0 }];
    }

    const { dataIndex, render, ...reset } = c;

    return [...p, { ...reset, dataIndex: `${dataIndex}`, render (...args) {
      const content = render ? render(...args) : dataIndex ? args[1][dataIndex] : '';

      if (isNullOrUndefined(content) || content === '') {
        return defalutValue;
      }

      const contentWithEllipsis = <div className={globalStyle[`toe${+ellipsis}`]}>{content}</div>;
      const tooltipsOverlay: React.ReactNode = showTooltips === false ? null : showTooltips === true ? content : showTooltips(...args);

      if (tooltipsOverlay) {
        return (
          <Tooltip placement="topLeft" overlay={tooltipsOverlay} overlayStyle={{ maxWidth: 450 }}>
            {ellipsis ? contentWithEllipsis : content}
          </Tooltip>
        );
      }

      return ellipsis ? contentWithEllipsis : content;
    } }];
  }, []);
}

export default function BaseTable<T extends object> ({ columns, defalutValue, rowKey, showTooltips, ellipsis, request, ...props }: BaseTableProps<T>) {
  const _columns = useMemo(() => formatColumns(columns, defalutValue, ellipsis, showTooltips), [columns]);
  return (
    <Table<T>
      {...props}
      rowKey={typeof rowKey === 'function' ? rowKey : `${rowKey}`}
      columns={_columns}
      loading={request ? request[0].loading : props.loading}
      dataSource={request && request[0].data ? request[0].data.list : props.dataSource}
      pagination={props.pagination !== false && request && request[0].data ? {
        current: request[0].data.current,
        pageSize: request[0].data.pageSize,
        total: request[0].data.total,
        onChange: (pageNum, pageSize) => request[1]({ pageNum, pageSize }),
        pageSizeOptions: [`${DEFAULT_PAGESIZE}`, '25', '50', '100'],
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
        showQuickJumper: true,
        ...props.pagination,
      } : props.pagination} />
  );
}
