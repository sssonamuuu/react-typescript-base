import * as React from 'react';
import BasePage from 'components/BasePage';
import { hot } from 'react-hot-loader/root';
import { Card } from 'antd';

const TITLE = 'XXX详情';

export default hot(() => (
  <BasePage
    title={TITLE}
    fullContent
    header={(
      <BasePage.Header title={TITLE} />
    )}>
    <Card>XXX详情</Card>
  </BasePage>
));
