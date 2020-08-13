import * as React from 'react';
import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';

interface BaseFormItemProps<T> extends Omit<FormItemProps, 'name'> {
  name?: keyof T;
}

export default function BaseFormItem<T> (props: BaseFormItemProps<T>) {
  return <Form.Item {...props as unknown as FormItemProps} />;
}

