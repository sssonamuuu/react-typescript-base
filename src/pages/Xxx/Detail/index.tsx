import * as React from 'react';
import Page from 'components/Page';
import { hot } from 'react-hot-loader/root';
import { Card } from 'antd';

const TITLE = 'XXX详情';

export default hot(() => (
  <Page
    title={TITLE}
    fullContent
    header={(
      <Page.Header title={TITLE} />
    )}>
    <Card>XXX详情</Card>
  </Page>
));
