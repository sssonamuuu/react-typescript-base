import React from 'react';
import { Card } from 'antd';
import BasePage from 'components/basePage';

export default (() => (
  <BasePage
    fullContent
    header={(
      <BasePage.Header title="首页" />
    )}>
    <Card>首页</Card>
  </BasePage>
));
