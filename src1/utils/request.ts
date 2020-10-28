import axios, { AxiosRequestConfig } from 'axios';
import Incorrect from 'classes/Incorrect';
import { errorCode } from 'configs/enumerations';
import { message } from 'antd';

interface RequestModel extends AxiosRequestConfig {
  /** 默认错误会进行 `message.error` 提示，是否禁用 */
  disableErrorMessage?: boolean;
}

interface ResponseModel<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

function request <T> ({ disableErrorMessage, ...option }: RequestModel): Promise<T> {
  return axios
    .request<ResponseModel<T>>(option)
    .then(({ data }) => {
      if (data.success) {
        return data.data;
      }
      throw new Incorrect(data.code, data.message ?? errorCode[data.code]?.label ?? errorCode.default.label);
    }).catch(e => {
      const error = e instanceof Incorrect ? e : new Incorrect(errorCode.default.code, e?.message ?? e ?? errorCode.default.label);
      !disableErrorMessage && message.error(error.messge);
      // TODO 部分特殊 `code` 处理
      throw error;
    });
}

function mergeParam (...o: Partial<RequestModel>[]): RequestModel {
  let res: RequestModel = {};
  o.forEach(item => res = { ...res, ...item });
  return res;
}

type DIS_KEYS = 'url' | 'data' | 'params' | 'method';

export default {
  get<R = void, P = void>(url: string, option: Omit<RequestModel, DIS_KEYS> = {}) {
    return (param: Omit<RequestModel, DIS_KEYS> & (P extends null | void | undefined ? {} : { params: P })) =>
      request<R>(mergeParam({ url, method: 'GET' }, option, param));
  },
  post<R = void, D = void, P = void>(url: string, option: Omit<RequestModel, DIS_KEYS> = {}) {
    return (param: Omit<RequestModel, DIS_KEYS> & (P extends void | void | undefined ? {} : { params: P }) & (D extends void | void | undefined ? {} : { data: D })) =>
      request<R>(mergeParam({ url, method: 'POST' }, option, param));
  },
};
