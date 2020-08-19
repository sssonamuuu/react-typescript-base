import * as React from 'react';
import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';

export interface BaseFormInstance<T> {
  /** 获取某个字段的值 */
  getFieldValue: <K extends keyof T> (name: K) => T[K];
  /** 获取所有字段的值 */
  getFieldsValue: () => T;
  /** 获取某个字段的校验错误信息 */
  getFieldError: <K extends keyof T>(name: K) => string[];
  /** 获取某些字段的校验错误信息 */
  getFieldsError: <K extends keyof T>(nameList?: K[]) => string[];
  /** 重置所有(不传参数)/部分字段 */
  resetFields: <K extends keyof T>(fields?: K[]) => void;
  /** 设置字段 */
  setFieldsValue: (value: Partial<T>) => void;
  /** 校验所有(不传参数)/部分字段 */
  validateFields: <K extends keyof T>(names?: K[]) => Promise<T>;
}

interface BaseFormItemProps<T> extends Omit<FormItemProps, 'name' | 'shouldUpdate' | 'dependencies'> {
  name?: keyof T;
  children?: React.ReactNode | ((form: BaseFormInstance<T>) => React.ReactNode);
  shouldUpdate?: boolean | ((prev: T, next: T) => boolean);
  dependencies?: (keyof T)[];
}

export default function BaseFormItem<T> (props: BaseFormItemProps<T>) {
  return <Form.Item {...props as unknown as FormItemProps} />;
}

