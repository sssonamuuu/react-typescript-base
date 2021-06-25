import React, { Fragment } from 'react';
import globalStyle from 'index.less';
import Incorrect from 'classes/Incorrect';
import style from './index.less';
import { Spin, Button, Empty } from 'antd';
import errorCode from 'enumerations/errorCode';

interface BasePlaceholderProps {
  status: Incorrect;
  height?: number | string;
}

export default function BasePlaceholder ({ status, height }: BasePlaceholderProps) {
  return (
    <div className={style.box} style={{ height }}>
      {(() => {
        if (errorCode.loading.$eq(status.code)) {
          return (
            <Fragment>
              <Spin />
              <span className={`${globalStyle.fcLabel} ${globalStyle.mt5}`}>{status.messge}</span>
            </Fragment>
          );
        }

        if (errorCode.nodata.$eq(status.code)) {
          return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={status.messge} />
          );
        }

        return (
          <Fragment>
            <div className={style.errorIcon} />
            <span className={`${globalStyle.fcLabel} ${globalStyle.mt5}`}>{status.messge}</span>
            <div className={`${globalStyle.mt20}`}>
              <Button onClick={() => location.href = '/'}>返回首页</Button>
              <Button onClick={() => location.reload()} type="primary" className={globalStyle.ml10}>刷新页面</Button>
            </div>
          </Fragment>
        );
      })()}
    </div>
  );
}
