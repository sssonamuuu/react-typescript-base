import { Modal, ModalProps } from 'antd';
import React, { PropsWithChildren, useState } from 'react';

interface BaseModalProps extends Omit<ModalProps, 'visible' | 'onCancel' | 'onOk'> {
  content: React.ReactElement;
  /** 抛出错误会阻止弹窗关闭 */
  onOk?(): Promise<void> | void;
}

export default function BaseModal ({ content, onOk, okButtonProps, cancelButtonProps, ...props }: PropsWithChildren<BaseModalProps>) {
  const [loading, setLoading] = useState(false);
  const [_visible, setVisible] = useState(false);

  async function _onClick () {
    await content.props.onClick?.();
    setVisible(true);
  }

  async function _onOk () {
    try {
      setLoading(true);
      await onOk?.();
      setVisible(false);
    } catch {}
    setLoading(false);
  }

  return (
    <React.Fragment>
      <Modal
        width={750}
        visible={_visible}
        maskClosable={false}
        keyboard={false}
        onCancel={() => setVisible(false)}
        {...props}
        onOk={_onOk}
        okButtonProps={{ ...okButtonProps, loading }}
        cancelButtonProps={{ ...cancelButtonProps, disabled: loading }} />
      {React.cloneElement(content, { onClick: _onClick })}
    </React.Fragment>
  );
}
