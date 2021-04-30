import globalStyle from 'index.less';
import React, { useMemo } from 'react';
import { Table, Tooltip } from 'antd';
import { TableProps, ColumnType } from 'antd/lib/table';

interface BaseColumnType<T> extends Omit<ColumnType<T>, 'dataIndex' | 'ellipsis'> {
  dataIndex?: keyof T;
  /** 默认值，可以覆盖 table 上的设置 */
  defalutValue?: string;
  /** 超出几行显示 ... */
  ellipsis?: boolean | {
    /** 默认 1 */
    lines?: 1 | 2 | 3;
    /** 是否显示 tooltip的内容，默认和渲染内容一致，可以通过 string 变更 */
    showTooltips?: boolean | ((_: any, item: T, index: number) => React.ReactNode);
  };
  hidden?: boolean;
}

interface BaseColumnGroupType<T> extends Omit<BaseColumnType<T>, 'dataIndex' | 'ellipsis'> {
  children: BaseColumnsType<T>[];
}

type BaseColumnsType<T> = (BaseColumnGroupType<T> | BaseColumnType<T>)[];

interface BaseTableProps<T = unknown> extends Omit<TableProps<T>, 'children' | 'columns' | 'rowKey'> {
  rowKey?: keyof T;
  /** 默认值，-- */
  defalutValue?: string;
  columns?: BaseColumnsType<T>;
}

function formatColumns<T> (columns: BaseColumnsType<T> = [], defalutValue: string = '--'): BaseColumnsType<T> {
  return columns.reduce<BaseColumnsType<T>>((p, { hidden, render, defalutValue: itemDefalutValue = defalutValue, ...c }) => {
    let ellipsis: BaseColumnType<T>['ellipsis'] = false;
    if ('ellipsis' in c) {
      ellipsis = c.ellipsis;
      delete c.ellipsis;
    }

    return hidden ? p : [...p, {
      ...c,
      /** 分组不处理 */
      render: 'children' in c ? render : (...args) => {
        const content = render ? render(...args) : c.dataIndex ? args[1][c.dataIndex] : '';

        if (content === '' || content === void 0 || content === null) {
          return itemDefalutValue;
        }

        if (!ellipsis) {
          return content;
        }

        const lines = ellipsis === true || !ellipsis.lines ? 1 : ellipsis.lines;
        const showTooltips = ellipsis === true || ellipsis.showTooltips === void 0 || ellipsis.showTooltips === true ? content : ellipsis.showTooltips === false ? '' : ellipsis.showTooltips(...args);

        const contentEle = <div className={globalStyle[`toe${lines}`]}>{content}</div>;

        if (!showTooltips) {
          return contentEle;
        }

        return <Tooltip placement="topLeft" overlay={showTooltips}>{contentEle}</Tooltip>;
      },
      children: 'children' in c && c.children.length ? formatColumns(c.children as any, itemDefalutValue) : void 0,
    }];
  }, []);
}

export default function BaseTable<T> ({ columns, defalutValue, ...props }: BaseTableProps<T>) {
  const _columns = useMemo(() => formatColumns(columns, defalutValue), [columns]);
  return <Table {...props as any} columns={_columns} />;
}
