import * as React from 'react';
import BasePage from 'components/BasePage';
import { hot } from 'react-hot-loader/root';
import { Card } from 'antd';

export default hot(() => (
  <BasePage
    fullContent
    header={(
      <BasePage.Header title="XXX详情" />
    )}>
    <Card>XXX详情</Card>
  </BasePage>
));
