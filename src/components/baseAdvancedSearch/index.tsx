import React, { cloneElement, ReactElement, Children } from 'react';
import BaseForm, { BaseFormProps } from 'components/baseForm';
import { Row, Col, Button, Grid } from 'antd';
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
  const screen = Grid.useBreakpoint();

  const itemCountePreLine = screen.xxl ? 4 : 3;
  const childCount = Children.count(children) + 1;
  const offset = (Math.ceil(childCount / itemCountePreLine) * itemCountePreLine - childCount) * (24 / itemCountePreLine);

  return (
    <BaseForm {...props} className={className}>
      <Row gutter={10}>
        {Children.map(children, child => child ? (
          <Col span={8} xxl={6}>
            {cloneElement(child)}
          </Col>
        ) : null)}
        <Col span={8} xxl={6} offset={offset}>
          <BaseForm.Item>
            <div className={style.searchCtrlBox}>
              <Button {...resetBtnProps} onClick={onReset}>重置</Button>
              <Button type="primary" className={`${globalStyle.ml10} ${searchBtnClassName}`} {...searchBtnProps} onClick={() => onSearch?.()}>查询</Button>
            </div>
          </BaseForm.Item>
        </Col>
      </Row>
    </BaseForm>
  );
}

BaseAdvancedSearch.Item = BaseForm.Item;
BaseAdvancedSearch.useForm = BaseForm.useForm;
BaseAdvancedSearch.Wrap = (props: BaseCardProps) => <BaseCard {...props} bodyStyle={{ ...props.bodyStyle, paddingBottom: 0 }} />;
