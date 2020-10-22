import * as React from 'react';
import globalStyle from 'index.less';
import Incorrect from 'classes/Incorrect';
import style from './index.less';
import { Spin, Button } from 'antd';
import { errorCode } from 'configs/enumerations';
import useHistory from 'hooks/useHistory';

interface BasePlaceholderProps {
  status: Incorrect;
}

export default function BasePlaceholder ({ status }: BasePlaceholderProps) {
  const history = useHistory();

  if (errorCode[status.code]?.is('loading')) {
    return (
      <div className={style.box}>
        <Spin />
        <span className={`${globalStyle.fcLabel} ${globalStyle.mt5}`}>{status.messge}</span>
      </div>
    );
  }

  return (
    <div className={style.box}>
      <div className={style.errorIcon} />
      <div className={style['error-icon']} />
      <span className={`${globalStyle.fcLabel} ${globalStyle.mt5}`}>{status.messge}</span>
      <div className={`${globalStyle.mt20}`}>
        <Button onClick={() => history.push('/')}>返回首页</Button>
        <Button onClick={() => location.reload()} type="primary" className={globalStyle.ml10}>刷新页面</Button>
      </div>
    </div>
  );
}
