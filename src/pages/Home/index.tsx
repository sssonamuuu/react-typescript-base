import * as React from 'react';
import { Card } from 'antd';
import BasePage from 'components/BasePage';
import { hot } from 'react-hot-loader/root';
import BasePlaceholder from 'components/BasePlaceholder';
import usePageConfig from 'hooks/usePageConfig';

export default hot(() => {
  const { pageStatus, setPageStatus } = usePageConfig({ documentTitle: '首页' });

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
        <BasePage.Header title="首页" />
      )}>
      <Card>首页</Card>
    </BasePage>
  );
});
