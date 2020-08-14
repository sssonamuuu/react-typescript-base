import * as React from 'react';
import BasePage from 'components/BasePage';
import { hot } from 'react-hot-loader/root';
import usePageConfig from 'hooks/usePageConfig';
import BasePlaceholder from 'components/BasePlaceholder';

export default hot(() => {
  const { pageStatus, setPageStatus } = usePageConfig({ documentTitle: '登录' });

  React.useEffect(() => {
    setTimeout(() => {
      setPageStatus(null);
    }, 1000);
  }, []);

  if (pageStatus) {
    return <BasePlaceholder status={pageStatus} />;
  }

  return <BasePage>Login</BasePage>;
});
