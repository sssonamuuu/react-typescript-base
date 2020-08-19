import * as React from 'react';
import Form, { FormProps } from 'antd/lib/form';
import BaseFormItem, { BaseFormInstance } from './BaseFormItem';

export interface BaseFormProps<T> extends Omit<FormProps, 'form'> {
  initialValues?: T;
  form?: BaseFormInstance<T>;
}

export default function BaseForm <T> (props: BaseFormProps<T>) {
  return <Form {...props as unknown as FormProps} />;
}

BaseForm.useForm = Form.useForm as unknown as <T>() => [BaseFormInstance<T>];
BaseForm.Item = BaseFormItem;
