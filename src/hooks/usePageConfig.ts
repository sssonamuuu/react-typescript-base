import * as React from 'react';
import Incorrect from 'classes/Incorrect';
import { errorCode } from 'configs/enumerations';

interface UsePageStatusOption {
  /** 页面标题 */
  documentTitle?: string;
  /** 页面 loading 的文本 */
  loadingText?: string;
}

export default function usePageConfig ({
  documentTitle,
  loadingText,
}: UsePageStatusOption) {
  const [pageStatus, setPageStatus] = React.useState<Incorrect | null>(new Incorrect(errorCode.loading.code, loadingText));

  React.useEffect(() => {
    documentTitle && (document.title = documentTitle);
    return () => {
      document.title = '加载中...';
    };
  }, [documentTitle]);

  return { pageStatus, setPageStatus };
}
