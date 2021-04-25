import React from 'react';
import BasePage from 'components/basePage';
import { Card, Table } from 'antd';
import BaseLink from 'components/BaseLink';

export default function XxxListPage () {
  return (
    <BasePage
      fullContent
      header={(
        <BasePage.Header title="XXX列表" />
      )}>
      <Card>
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
      </Card>
    </BasePage>
  );
}
