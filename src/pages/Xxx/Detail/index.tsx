import * as React from 'react';
import BasePage from 'components/BasePage';
import { hot } from 'react-hot-loader/root';
import { Card } from 'antd';
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
        <BasePage.Header title="XXX详情" />
      )}>
      <Card>XXX详情</Card>
    </BasePage>
  );
});
