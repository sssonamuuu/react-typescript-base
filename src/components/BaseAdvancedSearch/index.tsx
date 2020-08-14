import * as React from 'react';
import BaseForm, { BaseFormProps } from 'components/BaseForm';
import { Row, Col, Button } from 'antd';
import globalStyle from 'index.less';
import style from './index.less';
import { ButtonProps } from 'antd/es/button';

interface BaseAdvancedSearchProps<T> extends BaseFormProps<T> {
  children?: React.ReactElement<BaseFormProps<T> & {label?: string}>[];
  resetBtnProps?: ButtonProps;
  searchBtnProps?: ButtonProps;
}

export default function BaseAdvancedSearch <T> ({
  children,
  className = '',
  resetBtnProps: { ...resetBtnProps } = {},
  searchBtnProps: { className: searchBtnClassName = '', ...searchBtnProps } = {},
  ...props
}: BaseAdvancedSearchProps<T>) {
  return (
    <BaseForm {...props} className={`${style.searchBox} ${className}`}>
      <Row gutter={10}>
        {React.Children.map(children, child => child ? (
          <Col span={8}>
            {React.cloneElement(child)}
          </Col>
        ) : null)}
        <Col span={8}>
          <div className={style.searchCtrlBox}>
            <Button {...resetBtnProps}>重置</Button>
            <Button type="primary" className={`${globalStyle.ml10} ${searchBtnClassName}`} {...searchBtnProps}>查询</Button>
          </div>
        </Col>
      </Row>
    </BaseForm>
  );
}

BaseAdvancedSearch.Item = BaseForm.Item;
BaseAdvancedSearch.useForm = BaseForm.useForm;
