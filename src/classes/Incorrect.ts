import { errorCode } from 'configs/enumerations';

export default class Incorrect {
  code: number;
  messge: string;
  constructor (code: number, message?: string) {
    this.code = code;
    this.messge = message || errorCode[code]?.label || errorCode.default.label;
  }
}
