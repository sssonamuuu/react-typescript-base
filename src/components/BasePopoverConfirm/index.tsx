import * as React from 'react';
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
  const [visible, setVisible] = React.useState<boolean>(false);

  function onCancelClick () {
    onCancel?.();
    setVisible(false);
  }

  async function onOkClick () {
    await onOk?.();
    setVisible(false);
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
            <div className={style.title}>{title}</div>
            <div className={style.content}>{message}</div>
          </Space>
          <div className={style.ctrl}>
            <Button size="small" onClick={onCancelClick}>{cancelText}</Button>
            <Button type="primary" size="small" className={globalStyle.ml10} onClick={onOkClick}>{okText}</Button>
          </div>
        </div>
      )} />
  );
}
