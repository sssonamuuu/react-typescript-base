import React from 'react';
import { Table } from 'antd';
import BaseLink from 'components/BaseLink';
import BaseCard from 'components/baseCard';

export default function XxxListPage () {
  return (
    <BaseCard title="列表">
      <Table
        dataSource={[{ id: 1, name: 'XXX' }]}
        rowKey="id"
        columns={[
          {
            title: 'id',
            dataIndex: 'id',
          }, {
            title: 'name',
            dataIndex: 'name',
            render (name: string) {
              return <BaseLink route="detail" query={{ id: 1 }}>{name}</BaseLink>;
            },
          },
        ]} />
    </BaseCard>
  );
}
