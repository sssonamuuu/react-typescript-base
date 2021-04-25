import React, { useMemo } from 'react';
import { Table } from 'antd';
import { TableProps, ColumnType } from 'antd/lib/table';

interface BaseColumnType<T> extends Omit<ColumnType<T>, 'dataIndex'> {
  dataIndex?: keyof T;
  hidden?: boolean;
}

interface BaseColumnGroupType<T> extends Omit<BaseColumnType<T>, 'dataIndex'> {
  children: BaseColumnsType<T>[];
  hidden?: boolean;
}

type BaseColumnsType<T> = (BaseColumnGroupType<T> | BaseColumnType<T>)[];

interface BaseTableProps<T = unknown> extends Omit<TableProps<T>, 'children' | 'columns' | 'rowKey'> {
  rowKey?: keyof T;
  columns?: BaseColumnsType<T>;
}

function formatColumns<T> (columns: BaseColumnsType<T> = []): BaseColumnsType<T> {
  return columns.reduce<BaseColumnsType<T>>((p, { hidden, ...c }) => hidden ? p : [...p, { ...c, children: 'children' in c && c.children.length ? formatColumns(c.children as any) : void 0 }], []);
}

export default function BaseTable<T> ({ columns, ...props }: BaseTableProps<T>) {
  const _columns = useMemo(() => formatColumns(columns), [columns]);
  return <Table {...props as any} columns={_columns} />;
}
