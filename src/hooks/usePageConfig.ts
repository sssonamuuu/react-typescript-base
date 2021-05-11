import configs from 'configs';
import { useEffect, useMemo, useCallback } from 'react';

interface UsePageConfigProps {
  /** 添加根节点的 class， 离开页面后移除 */
  rootClassName?: string | string[];
}

export default function usePageConfig ({
  rootClassName = [],
}: UsePageConfigProps) {
  const root = useMemo(() => document.querySelector(`#${configs.theme.rootId}`), []);

  const disablePageScroll = useCallback(() => document.querySelector('html')!.style.overflow = 'hidden', []);
  const enablePageScroll = useCallback(() => document.querySelector('html')!.style.overflow = 'auto', []);

  useEffect(() => {
    /** 兼容ie，classList.add/remove 只能是单个参数 */
    (Array.isArray(rootClassName) ? rootClassName : [rootClassName]).forEach(className => {
      root?.classList.add(className);
    });

    return () => {
      (Array.isArray(rootClassName) ? rootClassName : [rootClassName]).forEach(className => root?.classList.remove(className));
    };
  }, []);

  return { disablePageScroll, enablePageScroll };
}
