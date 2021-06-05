import React, { useEffect } from 'react';
import { Card } from 'antd';
import BasePage from 'components/basePage';
import usePlaceholder from 'hooks/usePlaceholder';
import BasePlaceholder from 'components/basePlaceholder';

export default () => {
  const [placeholder, setPlaceholder] = usePlaceholder();

  useEffect(() => {
    setTimeout(() => {
      setPlaceholder(null);
    }, 1000);
  }, []);

  if (placeholder) {
    return <BasePlaceholder status={placeholder} />;
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
};
