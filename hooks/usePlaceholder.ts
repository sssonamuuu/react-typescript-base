import Incorrect from 'classes/Incorrect';
import { errorCode } from 'datas/enums';
import { useState } from 'react';

export default function usePlaceholder (defaultValue: Incorrect | null = new Incorrect(errorCode.loading.code, '数据加载中...')) {
  return useState(defaultValue);
}
