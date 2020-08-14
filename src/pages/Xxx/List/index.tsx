import * as React from 'react';
import BasePage from 'components/BasePage';
import { hot } from 'react-hot-loader/root';
import { Card, Table } from 'antd';
import { Link } from 'react-router-dom';
import usePageConfig from 'hooks/usePageConfig';
import BasePlaceholder from 'components/BasePlaceholder';

export default hot(() => {
  const { pageStatus, setPageStatus } = usePageConfig({ documentTitle: 'XXX详情' });

  React.useEffect(() => {
    setTimeout(() => {
      setPageStatus(null);
    }, 1000);
  }, []);

  if (pageStatus) {
    return <BasePlaceholder status={pageStatus} />;
  }

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
    </BasePage>
  );
});
