import React, { CSSProperties } from 'react';
import Incorrect from 'classes/Incorrect';
import errorCode from 'enumerations/errorCode';
import globalStyle from 'index.less';
import { Input } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

interface BaseFormPlaceholderProps {
  status: Incorrect;
  onReload?(): void;
  style?: CSSProperties;
}

export default function BaseFormPlaceholder ({ status, onReload, style }: BaseFormPlaceholderProps) {
  if (errorCode[status.code]?.$is('loading')) {
    return <Input disabled value="正在加载努力数据" style={style} />;
  }

  return <Input style={style} disabled value={status.messge} addonAfter={<RedoOutlined className={globalStyle.cup} onClick={onReload} />} />;
}
