import BaseCard from 'components/baseCard';
import React, { useMemo } from 'react';
import { navigation } from 'utils/navigation';

export interface XxxDetailPageQuery {
  id?: number;
}

export default function XxxDetailPage () {
  const query = useMemo(() => navigation.getQuery<XxxDetailPageQuery>({ id: 'number' }), []);

  return (
    <BaseCard title="详情">{query.id}</BaseCard>
  );
}
