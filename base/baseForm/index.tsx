import React from 'react';
import Form, { FormProps } from 'antd/lib/form';
import BaseFormItem, { BaseFormInstance } from './baseFormItem';

export interface BaseFormProps<T> extends Omit<FormProps, 'form'> {
  initialValues?: Partial<T>;
  onValuesChange?: (changeValue: Partial<T>, values: T) => void;
  form?: BaseFormInstance<T>;
}

/** 默认label为固定宽度，如果不需要，添加 BaseForm.DEFAULT_CLASSNAME 类 */
export default function BaseForm <T> (props: BaseFormProps<T>) {
  return <Form {...props as unknown as FormProps} />;
}

BaseForm.useForm = Form.useForm as unknown as <T>() => [BaseFormInstance<T>];
BaseForm.Item = BaseFormItem;
BaseForm.DEFAULT_CLASSNAME = 'default';
