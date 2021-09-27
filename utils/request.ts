import axios, { AxiosRequestConfig } from 'axios';
import Incorrect from 'classes/Incorrect';
import { errorCode } from 'datas/enums';
import { message } from 'antd';
import qs from 'qs';
import { DEFAULT_PAGESIZE } from 'datas/consts';

interface RequestModel extends AxiosRequestConfig {
  /** 默认错误会进行 `message.error` 提示，是否禁用 */
  disableErrorMessage?: boolean;
  isFormUrlencoded?: boolean;
  isFormData?: boolean;
  intercept? (res: any): ResponseModel<any>;
}

interface ResponseModel<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

function request <T> ({
  disableErrorMessage,
  isFormData,
  isFormUrlencoded,
  intercept,
  ...option
}: RequestModel): Promise<T> {
  if (isFormData) {
    option.headers = { ...option.headers, 'Content-Type': 'multipart/form-data' };
    const formdata = new FormData();
    for (const key in option.data || {}) {
      formdata.append(key, option.data[key]);
    }
    option.data = formdata;
  }

  if (isFormUrlencoded) {
    option.headers = { ...option.headers, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
    option.data = qs.stringify(option.data);
  }

  return axios
    .request<ResponseModel<T>>(option)
    .then(({ data }) => {
      data = intercept ? intercept(data) : data;

      if (data.success) {
        return data.data;
      }

      throw new Incorrect(data.code, data.message ?? errorCode[data.code]?.label ?? errorCode.default.label);
    }).catch(e => {
      const error = Incorrect.formatTryCatchError(e);
      !disableErrorMessage && message.error(error.messge);
      throw error;
    });
}

function mergeParam (...o: Partial<RequestModel>[]): RequestModel {
  let res: RequestModel = {};
  o.forEach(item => res = { ...res, ...item });
  return res;
}

type OPTION_DISABLED_KEYS = 'url' | 'data' | 'params' | 'method';
type PARAMS_DISABLED_KEYS= 'url' | 'data' | 'params' | 'method' | 'isFormData';

export default {
  get<R = void, P = void>(url: string, option: Omit<RequestModel, OPTION_DISABLED_KEYS> = {}) {
    return (param: Omit<RequestModel, PARAMS_DISABLED_KEYS> & (P extends null | void | undefined ? {} : { params: P })) =>
      request<R>(mergeParam({ url, method: 'GET' }, option, param));
  },
  post<R = void, D = void, P = void>(url: string, option: Omit<RequestModel, OPTION_DISABLED_KEYS> = {}) {
    return (param: Omit<RequestModel, PARAMS_DISABLED_KEYS> & (P extends null | void | undefined ? {} : { params: P }) & (D extends null | void | undefined ? {} : { data: D })) =>
      request<R>(mergeParam({ url, method: 'POST' }, option, param));
  },
  pagination<R = void, D = void, P = void>(url: string, option: Omit<RequestModel, OPTION_DISABLED_KEYS> = {}) {
    return (param: Omit<RequestModel, PARAMS_DISABLED_KEYS> & (P extends null | void | undefined ? {} : { params: P }) & (D extends null | void | undefined ? {} : { data: PaginationReq<D> })) => {
      const _data = mergeParam({ url, method: 'POST' }, option, param);
      _data.data.pageSize ??= DEFAULT_PAGESIZE;
      return request<PaginationRes<R>>(_data);
    };
  },
};
