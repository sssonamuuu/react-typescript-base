import enummapping from 'enummapping';
/**
 * 错误码
 *
 * 负数为前端定义错误码
 *
 * 正数为 `http` 请求返回 `code` 码或者 `http` 状态码
 */
export const errorCode = enummapping({
  nodata: { code: -3, label: '暂无数据' },
  default: { code: -2, label: '请求异常' },
  loading: { code: -1, label: '数据加载中...' },
});
