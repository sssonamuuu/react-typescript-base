import * as React from 'react';
import { Card } from 'antd';
import BasePage from 'components/BasePage';
import { hot } from 'react-hot-loader/root';
import usePageStatus from 'hooks/usePageStatus';
import BasePlaceholder from 'components/BasePlaceholder';

const TITLE = '首页';

export default hot(() => {
  const { status, setStatus } = usePageStatus();

  React.useEffect(() => {
    setTimeout(() => {
      setStatus(null);
    }, 1000);
  }, []);

  if (status) {
    return <BasePlaceholder status={status} />;
  }

  return (
    <BasePage
      title={TITLE}
      fullContent
      header={(
        <BasePage.Header title={TITLE} />
      )}>
      <Card>首页</Card>
    </BasePage>
  );
});
