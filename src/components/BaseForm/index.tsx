import * as React from 'react';
import Form, { FormProps } from 'antd/lib/form';
import BaseFormItem from './BaseFormItem';

interface BaseFormInstance<T> {
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

export interface BaseFormProps<T> extends Omit<FormProps, 'form'> {
  initialValues?: T;
  form?: BaseFormInstance<T>;
}

export default function BaseForm <T> (props: BaseFormProps<T>) {
  return <Form {...props as unknown as FormProps} />;
}

BaseForm.useForm = Form.useForm as unknown as <T>() => [BaseFormInstance<T>];
BaseForm.Item = BaseFormItem;
