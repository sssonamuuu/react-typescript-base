import React, { cloneElement, ReactElement, Children } from 'react';
import { Row, Col, Button } from 'antd';
import globalStyle from 'index.module.less';
import style from './index.module.less';
import { ButtonProps } from 'antd/es/button';
import BaseCard, { BaseCardProps } from '../baseCard';
import { BaseFormItemProps } from '../baseForm/baseFormItem';
import BaseForm, { BaseFormProps } from '../baseForm';
import { ColProps } from 'antd/es/grid/col';

interface GridProps extends ColProps {}

type BaseAdvancedSearchItemProps<T> = BaseFormItemProps<T> & {
  grid?: GridProps;
};

interface BaseAdvancedSearchProps<T> extends BaseFormProps<T> {
  children?: ReactElement<BaseAdvancedSearchItemProps<T>> | ReactElement<BaseAdvancedSearchItemProps<T>>[];
  resetBtnProps?: Omit<ButtonProps, 'onClick'>;
  searchBtnProps?: Omit<ButtonProps, 'onClick'>;
  grid?: GridProps;
  operateGrid?: GridProps;
  loading?: boolean;
  onSearch?(): void;
  onReset?(): void;
}

export default function BaseAdvancedSearch <T> ({
  children,
  className = '',
  resetBtnProps: { ...resetBtnProps } = {},
  searchBtnProps: { className: searchBtnClassName = '', ...searchBtnProps } = {},
  loading,
  onSearch,
  onReset,
  grid = { span: 8, xxl: 6 },
  operateGrid = grid,
  ...props
}: BaseAdvancedSearchProps<T>) {
  return (
    <BaseForm {...props} className={className}>
      <Row gutter={10}>
        {Children.map(children, child => child ? (
          <Col {...child.props.grid || grid}>
            {cloneElement(child)}
          </Col>
        ) : null)}
        <Col style={{ marginLeft: 'auto', ...operateGrid.style }} {...operateGrid}>
          <BaseForm.Item>
            <div className={style.searchCtrlBox}>
              <Button {...resetBtnProps} onClick={onReset} disabled={loading ?? resetBtnProps.disabled}>重置</Button>
              <Button type="primary" className={`${globalStyle.ml10} ${searchBtnClassName}`} {...searchBtnProps} onClick={() => onSearch?.()} loading={loading ?? searchBtnProps.loading}>查询</Button>
            </div>
          </BaseForm.Item>
        </Col>
      </Row>
    </BaseForm>
  );
}

BaseAdvancedSearch.Item = BaseForm.Item as <T> (props: BaseAdvancedSearchItemProps<T>) => ReactElement<BaseAdvancedSearchItemProps<T>>;
BaseAdvancedSearch.useForm = BaseForm.useForm;
BaseAdvancedSearch.Wrap = (props: BaseCardProps) => <BaseCard {...props} bodyStyle={{ ...props.bodyStyle, paddingBottom: 0 }} />;
