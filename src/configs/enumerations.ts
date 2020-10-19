import enumeration from 'utils/enumeration';

/**
 * 错误码
 *
 * 负数为前端定义错误码
 *
 * 正数为 `http` 请求返回 `code` 码或者 `http` 状态码
 */
export const errorCode = enumeration({
  default: { code: -1, label: '请求异常' },
  loading: { code: 0, label: '加载中...' },
  unauthorized: { code: 401, label: '无权限' },
  signatureFailed: { code: 402, label: '验签失败' },
  unknow: { code: 999999, label: '未知异常' },
  unLogin: { code: 100001, label: '未登录' },
  noAuth: { code: 100002, label: '无权限' },
  paramError: { code: 100003, label: '参数非法' },
  dataNotExists: { code: 100004, label: '数据不存在' },
  dataIsDuplicate: { code: 100005, label: '数据重复' },
});
