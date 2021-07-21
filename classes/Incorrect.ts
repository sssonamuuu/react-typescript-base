import errorCode from 'enumerations/errorCode';

export default class Incorrect {
  /** 格式化 try / catch 中的 error */
  static formatTryCatchError = (e?: any) => e instanceof Incorrect ? e : new Incorrect(errorCode.default.code, e?.message || e || errorCode.default.label);
  code: number;
  messge: string;
  constructor (code: number, message?: string) {
    this.code = code;
    this.messge = message || errorCode[code]?.label || errorCode.default.label;
  }
}
