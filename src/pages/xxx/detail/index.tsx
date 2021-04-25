import React, { useMemo } from 'react';
import BasePage from 'components/basePage';
import { Card } from 'antd';
import { navigation } from 'utils/navigation';

export interface XxxDetailPageQuery {
  id?: number;
}

export default function XxxDetailPage () {
  const query = useMemo(() => navigation.getQuery<XxxDetailPageQuery>({ id: 'number' }), []);

  return (
    <BasePage
      fullContent
      header={(
        <BasePage.Header title="XXX详情" />
      )}>
      <Card>{query.id}</Card>
    </BasePage>
  );
}
