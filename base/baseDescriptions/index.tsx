import style from './index.module.less';
import React, { ReactNode } from 'react';
import globalStyle from 'index.module.less';
import { Row, Col, Tooltip } from 'antd';
import { isNullOrUndefined } from 'utils/dataTypeTools';

type Layout = 'vertial' | 'horizontal';
type Align = 'left' | 'center' | 'right';

interface BaseDescriptionsItem extends Pick<BaseDescriptionsProps, 'ellipsis' | 'showTooltips'> {
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
  hidden?: boolean;
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
  labelClassName?: string;
  contentClassName?: string;
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
  /**
   * 统一配置是否超出省略
   *
   * true 表示 1
   *
   * @default false
   */
  ellipsis?: boolean | 1 | 2 | 3;
  /**
    * 统一配置和是否显示tooltip的内容
    *
    * @default false/true(if ellipsis = true)
    */
  showTooltips?: boolean | React.ReactNode;
}

export default function BaseDescriptions ({
  descriptions = [],
  layout = 'horizontal',
  className = '',
  labelClassName = '',
  contentClassName = '',
  labelAlign = 'left',
  labelWidth,
  span,
  defaultValue = '--',
  colon = true,
  indent,
  ellipsis,
  showTooltips,
}: BaseDescriptionsProps) {
  return (
    <Row gutter={[10, 20]} className={`${className} ${indent ? globalStyle.px10 : ''}`}>
      {descriptions.map(({
        label,
        value,
        hidden,
        className: itemClassName = '',
        labelClassName: itemLabelClassName = labelClassName,
        contentClassName: itemContentClassName = contentClassName,
        span: itemSpan = span,
        labelAlign: itemLabelAlign = labelAlign,
        layout: itemLayout = layout,
        labelWidth: itemLabelWidth = labelWidth,
        defaultValue: itemDefaultValue = defaultValue,
        colon: itemColon = colon,
        ellipsis: itemEllipsis = ellipsis,
        showTooltips: itemShowTooltips = showTooltips ?? !!itemEllipsis,
      }) => {
        const content = value === '' || isNullOrUndefined(value) ? itemDefaultValue : value;

        const contentEl = (
          <span className={`${style.content} ${itemEllipsis ? globalStyle[`toe${+itemEllipsis}`] : ''} ${itemContentClassName} ${itemLayout === 'horizontal' ? globalStyle.mt0 : globalStyle.mt10}`}>
            {content}
          </span>
        );

        const tooltipsEl = (
          <Tooltip placement="topLeft" overlay={itemShowTooltips === true ? content : itemShowTooltips} overlayStyle={{ maxWidth: 450 }}>
            {contentEl}
          </Tooltip>
        );

        return (
          <Col
            hidden={hidden}
            style={{ flexDirection: itemLayout === 'horizontal' ? 'row' : 'column' }}
            className={`${style.description} ${itemClassName}`}
            span={itemSpan}
            key={`${label}`}>
            <span
              className={`${style.label} c-base-description-label ${itemLabelClassName}`}
              style={{
                textAlign: itemLabelAlign,
                width: itemLabelAlign === 'left' ? 'auto' : itemLabelWidth,
              }}>
              {label}
              <span className={style.colon} style={{ visibility: itemColon ? 'visible' : 'hidden' }}>:</span>
            </span>
            {itemShowTooltips ? tooltipsEl : contentEl}
          </Col>
        );
      })}
    </Row>
  );
}
