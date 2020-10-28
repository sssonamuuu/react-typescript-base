import React from 'react';
import { Card } from 'antd';
import BasePage from 'components/basePage';
import { hot } from 'react-hot-loader/root';

export default hot(() => (
  <BasePage
    fullContent
    header={(
      <BasePage.Header title="首页" />
    )}>
    <Card>首页</Card>
  </BasePage>
));
