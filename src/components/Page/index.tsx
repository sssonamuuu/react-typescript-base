import * as React from 'react';
// import * as globalStyle from 'index.less';
import * as style from './index.less';

export const ANTD_POPUP_CONTAINER = 'JS-antd-popup-container';

interface PageProps {
  title?: string;
  documentTitle?: string;
}

export default function Page ({ children, documentTitle }: React.PropsWithChildren<PageProps>) {
  React.useEffect(() => {
    if (documentTitle) {
      document.title = documentTitle;
    }
    return () => {
      document.title = '加载中...';
    };
  }, []);

  return (
    <main className={`${ANTD_POPUP_CONTAINER} ${style.container}`}>
      {children}
    </main>
  );
}
