import React from 'react';
import globalStyle from 'index.less';
import { Row, Col } from 'antd';

type Layout = 'vertial' | 'horizontal';
type Align = 'left' | 'center' | 'right';

interface BaseDescriptionsItem {
  className?: string;
  label?: React.ReactNode;
  value?: React.ReactNode;
  layout?: Layout;
  labelAlign?: Align;
  labelWidth?: number | string;
  span?: number;
}

interface BaseDescriptionsProps {
  className?: string;
  layout?: Layout;
  labelAlign?: Align;
  /** 垂直布局或者水平布局label居左不生效 */
  labelWidth?: number | string;
  descriptions?: BaseDescriptionsItem[];
  span?: number;
}

export default function BaseDescriptions ({
  descriptions = [],
  layout = 'horizontal',
  className = '',
  labelAlign = 'left',
  labelWidth = 150,
  span,
}: BaseDescriptionsProps) {
  return (
    <Row gutter={[10, 20]} className={`${className}`}>
      {descriptions.map(({
        label,
        value,
        className: itemClassName = '',
        span: itemSpan = span,
        labelAlign: itemLabelAlign = labelAlign,
        layout: itemLayout = layout,
        labelWidth: itemLabelWidth = labelWidth,
      }) => (
        <Col
          style={{ flexDirection: itemLayout === 'horizontal' ? 'row' : 'column' }}
          className={`${globalStyle.dFlex} ${itemClassName}`}
          span={itemSpan}
          key={`${label}`}>
          <span
            className={`${globalStyle.mr10} ${globalStyle.flexShrink0} ${globalStyle.fcLabel}`}
            style={{
              textAlign: itemLabelAlign,
              width:
                  itemLayout === 'horizontal'
                    ? itemLabelAlign === 'left'
                      ? 'auto'
                      : itemLabelWidth
                    : '100%',
            }}>
            {label}
          </span>
          <span style={{ flex: 1, marginTop: itemLayout === 'horizontal' ? 0 : 10 }}>
            {value}
          </span>
        </Col>
      ))}
    </Row>
  );
}
