import enumeration from 'utils/enumeration';

/**
 * 错误码
 *
 * 负数为前端定义错误码
 *
 * 正数为 `http` 请求返回 `code` 码或者 `http` 状态码
 */
export const errorCode = enumeration({
  nodata: { code: -2, label: '暂无数据' },
  default: { code: -1, label: '请求异常' },
  loading: { code: 0, label: '数据加载中...' },
});
