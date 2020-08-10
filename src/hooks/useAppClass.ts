import * as React from 'react';

/**
 * 给 `#app` 添加类，在组件销毁时删除
 */
export default function useAppClass (...classNames: string[]) {
  const app = React.useRef(document.querySelector('#app'));

  React.useEffect(() => {
    app.current?.classList.add(...classNames);
    return () => app.current?.classList.remove(...classNames);
  }, []);
}
