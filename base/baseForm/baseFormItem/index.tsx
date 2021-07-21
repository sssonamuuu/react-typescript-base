import globalStyle from 'index.less';
import React, { Fragment, ReactNode } from 'react';
import { Form, Tooltip, TooltipProps } from 'antd';
import { FormItemProps, RuleObject } from 'antd/lib/form';
import { QuestionCircleOutlined } from '@ant-design/icons';

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

export interface BaseFormItemProps<T> extends Omit<FormItemProps, 'name' | 'shouldUpdate' | 'dependencies' | 'rules'> {
  name?: keyof T;
  children?: ReactNode | ((form: BaseFormInstance<T>) => ReactNode);
  shouldUpdate?: boolean | ((prev: T, next: T) => boolean);
  dependencies?: (keyof T)[];
  question?: React.ReactNode;
  questionProps?: Omit<TooltipProps, 'overlay'>;
  rules?: Array<RuleObject | ((form: BaseFormInstance<T>) => RuleObject)>;
}

export default function BaseFormItem<T> ({ label, question, questionProps, ...props }: BaseFormItemProps<T>) {
  return (
    <Form.Item
      {...props as unknown as FormItemProps} label={label ? (
        <Fragment>
          {label}
          {question ? (
            <Tooltip overlay={question} {...questionProps} overlayStyle={{ maxWidth: 'unset', ...questionProps?.overlayStyle }}>
              <QuestionCircleOutlined className={globalStyle.px5} />
            </Tooltip>
          ) : null}
        </Fragment>
      ) : void 0} />
  );
}

