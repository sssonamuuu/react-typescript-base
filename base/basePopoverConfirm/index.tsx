import React, { useState } from 'react';
import { Popover, Button, Space } from 'antd';
import { PopoverProps } from 'antd/lib/popover';
import globalStyle from 'index.less';
import style from './index.less';

interface BasePopoverConfirmProps extends Omit<PopoverProps, 'content'> {
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  onOk?(): void;
  onCancel?(): void;
}

export default function BasePopoverConfirm ({ title, message, okText = '确认', cancelText = '取消', onOk, onCancel, ...props }: BasePopoverConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);

  function onCancelClick () {
    onCancel?.();
    setVisible(false);
  }

  async function onOkClick () {
    setLoading(true);
    try {
      await onOk?.();
      setVisible(false);
    } catch {}
    setLoading(false);
  }

  return (
    <Popover
      trigger="click"
      placement="left"
      visible={visible}
      onVisibleChange={setVisible}
      {...props}
      content={(
        <div className={style.popover}>
          <Space direction="vertical" size={10}>
            {title ? <div className={style.title}>{title}</div> : null}
            {message ? <div className={style.content}>{message}</div> : null}
          </Space>
          <div className={style.ctrl}>
            <Button size="small" onClick={onCancelClick}>{cancelText}</Button>
            <Button type="primary" size="small" loading={loading} className={globalStyle.ml10} onClick={onOkClick}>{okText}</Button>
          </div>
        </div>
      )} />
  );
}
