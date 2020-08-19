import * as React from 'react';
import Incorrect from 'classes/Incorrect';
import { errorCode } from 'configs/enumerations';
import globalStyle from 'index.less';
import { Input } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

interface BaseFormPlaceholderProps {
  status: Incorrect;
  onReload?(): void;
}

export default function BaseFormPlaceholder ({ status }: BaseFormPlaceholderProps) {
  if (errorCode[status.code]?.is('loading')) {
    return <Input disabled value="正在加载努力数据" />;
  }

  return <Input disabled value={status.messge} addonAfter={<RedoOutlined className={globalStyle.cup} />} />;
}
