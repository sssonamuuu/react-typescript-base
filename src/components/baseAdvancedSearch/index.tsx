import React, { cloneElement, ReactElement, Children, useState } from 'react';
import BaseForm, { BaseFormProps } from 'components/baseForm';
import { Row, Col, Button, Grid } from 'antd';
import globalStyle from 'index.less';
import style from './index.less';
import { ButtonProps } from 'antd/es/button';
import BaseCard, { BaseCardProps } from 'components/baseCard';

type BaseAdvancedSearchItem<T> = ReactElement<BaseFormProps<T> & {label?: string}>;

interface BaseAdvancedSearchProps<T> extends BaseFormProps<T> {
  children?: BaseAdvancedSearchItem<T> | BaseAdvancedSearchItem<T>[];
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
  const [loading, setLoading] = useState(false);
  const screen = Grid.useBreakpoint();

  const itemCountePreLine = screen.xxl ? 4 : 3;
  const childCount = Children.count(children) + 1;
  const offset = (Math.ceil(childCount / itemCountePreLine) * itemCountePreLine - childCount) * (24 / itemCountePreLine);

  async function _onSearch () {
    setLoading(true);
    try {
      await onSearch?.();
    } catch {}
    setLoading(false);
  }

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
              <Button {...resetBtnProps} onClick={onReset} disabled={loading}>重置</Button>
              <Button type="primary" className={`${globalStyle.ml10} ${searchBtnClassName}`} {...searchBtnProps} loading={loading} onClick={_onSearch}>查询</Button>
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
