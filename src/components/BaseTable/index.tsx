import * as React from 'react';
import { Table } from 'antd';
import { TableProps, ColumnType } from 'antd/lib/table';

interface BaseColumnType<T> extends Omit<ColumnType<T>, 'dataIndex'> {
  dataIndex?: keyof T;
}

interface BaseColumnGroupType<T> extends Omit<BaseColumnType<T>, 'dataIndex'> {
  children: BaseColumnsType<T>[];
}

type BaseColumnsType<T> = (BaseColumnGroupType<T> | BaseColumnType<T>)[];

interface BaseTableProps<T = unknown> extends Omit<TableProps<T>, 'children' | 'columns' | 'rowKey'> {
  rowKey?: keyof T;
  columns?: BaseColumnsType<T>;
}

export default function BaseTable<T> (props: BaseTableProps<T>) {
  return <Table {...props as any} />;
}
