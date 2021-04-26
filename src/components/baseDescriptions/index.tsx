import React, { ReactNode } from 'react';
import globalStyle from 'index.less';
import { Row, Col } from 'antd';

type Layout = 'vertial' | 'horizontal';
type Align = 'left' | 'center' | 'right';

interface BaseDescriptionsItem {
  className?: string;
  label?: ReactNode;
  value?: ReactNode;
  layout?: Layout;
  labelAlign?: Align;
  labelWidth?: number | string;
  span?: number;
  /** 仅在 空字符串 undefined null 时显示，默认：'--' */
  defaultValue?: string;
  /** 是否显示冒号，默认显示 */
  colon?: boolean;
}

interface BaseDescriptionsProps {
  className?: string;
  layout?: Layout;
  labelAlign?: Align;
  /** 垂直布局或者水平布局label居左不生效 */
  labelWidth?: number | string;
  descriptions?: BaseDescriptionsItem[];
  span?: number;
  /** 仅在 空字符串 undefined null 时显示，默认：'--' */
  defaultValue?: string;
  /** 是否显示冒号，默认显示 */
  colon?: boolean;
  /** 带有副标题的缩进 */
  indent?: boolean;
}

export default function BaseDescriptions ({
  descriptions = [],
  layout = 'horizontal',
  className = '',
  labelAlign = 'left',
  labelWidth,
  span,
  defaultValue = '--',
  colon = true,
  indent = true,
}: BaseDescriptionsProps) {
  return (
    <Row gutter={[10, 20]} className={`${className} ${indent ? globalStyle.px10 : ''}`}>
      {descriptions.map(({
        label,
        value,
        className: itemClassName = '',
        span: itemSpan = span,
        labelAlign: itemLabelAlign = labelAlign,
        layout: itemLayout = layout,
        labelWidth: itemLabelWidth = labelWidth,
        defaultValue: itemDefaultValue = defaultValue,
        colon: itemColon = colon,
      }) => (
        <Col
          style={{ flexDirection: itemLayout === 'horizontal' ? 'row' : 'column' }}
          className={`${globalStyle.dFlex} ${itemClassName}`}
          span={itemSpan}
          key={`${label}`}>
          <span
            className={`${globalStyle.flexShrink0} ${globalStyle.fcLabel} c-base-description-label`}
            style={{
              textAlign: itemLabelAlign,
              width: itemLabelAlign === 'left' ? 'auto' : itemLabelWidth,
            }}>
            {label}
            <span className={`${globalStyle.pl2} ${globalStyle.pr8}`} style={{ visibility: itemColon ? 'visible' : 'hidden' }}>:</span>
          </span>
          <span className={`${globalStyle.wbBreakAll} ${globalStyle.flex1} ${itemLayout === 'horizontal' ? globalStyle.mt0 : globalStyle.mt10}`}>
            {value === '' || value === void 0 || value === null ? itemDefaultValue : value}
          </span>
        </Col>
      ))}
    </Row>
  );
}
