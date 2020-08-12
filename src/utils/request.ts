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

export default function request <T> ({ disableErrorMessage, ...option }: RequestModel): Promise<T> {
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
