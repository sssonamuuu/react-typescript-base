import * as React from 'react';
import Page from 'components/Page';
import { hot } from 'react-hot-loader/root';
import { Card, Table } from 'antd';
import { Link } from 'react-router-dom';

const TITLE = 'XXX列表';

export default hot(() => (
  <Page
    title={TITLE}
    fullContent
    header={(
      <Page.Header title={TITLE} />
    )}>
    <Card>
      <Table
        dataSource={[{ id: 1, name: 'XXX' }]}
        rowKey="id"
        columns={[
          {
            title: 'id',
            dataIndex: 'id',
          },
          {
            title: 'name',
            dataIndex: 'name',
            render (name: string) {
              return <Link to="/xxx-detail">{name}</Link>;
            },
          },
        ]} />
    </Card>
  </Page>
));
