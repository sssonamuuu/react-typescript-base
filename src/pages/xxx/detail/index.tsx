import React from 'react';
import BasePage from 'components/basePage';
import { Card } from 'antd';

export default () => (
  <BasePage
    fullContent
    header={(
      <BasePage.Header title="XXX详情" />
    )}>
    <Card>XXX详情</Card>
  </BasePage>
);
