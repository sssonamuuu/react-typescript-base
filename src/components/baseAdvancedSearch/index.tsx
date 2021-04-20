import React, { cloneElement, ReactElement, Children } from 'react';
import BaseForm, { BaseFormProps } from 'components/baseForm';
import { Row, Col, Button } from 'antd';
import globalStyle from 'index.less';
import style from './index.less';
import { ButtonProps } from 'antd/es/button';
import BaseCard, { BaseCardProps } from 'components/baseCard';

interface BaseAdvancedSearchProps<T> extends BaseFormProps<T> {
  children?: ReactElement<BaseFormProps<T> & {label?: string}>[];
  resetBtnProps?: Omit<ButtonProps, 'onClick'>;
  searchBtnProps?: Omit<ButtonProps, 'onClick'>;
  onSearch?(): void;
  onReset?(): void;
}

export default function BaseAdvancedSearch <T> ({
  children,
  className = '',
  resetBtnProps: { ...resetBtnProps } = {},
  searchBtnProps: { className: searchBtnClassName = '', ...searchBtnProps } = {},
  onSearch,
  onReset,
  ...props
}: BaseAdvancedSearchProps<T>) {
  return (
    <BaseForm {...props} className={className}>
      <Row gutter={10}>
        {Children.map(children, child => child ? (
          <Col span={6}>
            {cloneElement(child)}
          </Col>
        ) : null)}
        <Col span={6}>
          <div className={style.searchCtrlBox}>
            <Button {...resetBtnProps} onClick={onReset}>重置</Button>
            <Button type="primary" className={`${globalStyle.ml10} ${searchBtnClassName}`} {...searchBtnProps} onClick={() => onSearch?.()}>查询</Button>
          </div>
        </Col>
      </Row>
    </BaseForm>
  );
}

BaseAdvancedSearch.Item = BaseForm.Item;
BaseAdvancedSearch.useForm = BaseForm.useForm;
BaseAdvancedSearch.Wrap = (props: BaseCardProps) => <BaseCard {...props} bodyStyle={{ ...props.bodyStyle, paddingBottom: 0 }} />;
