import React from 'react';

interface UsePageStatusOption {
  /** 页面标题 */
  documentTitle?: string;
}

export default function usePageConfig ({
  documentTitle,
}: UsePageStatusOption) {
  useEffect(() => {
    documentTitle && (document.title = documentTitle);
    return () => {
      document.title = '加载中...';
    };
  }, [documentTitle]);
}
