import globalStyle from 'index.less';
import style from './index.less';
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import Incorrect from 'classes/Incorrect';
import Attachment from 'components/attachment';
import { FileIconType } from 'components/preview';

/** 通过mimetype的/截取，后半截无法判断FileIconType的文件 */
const mimetype: { [key: string]: FileIconType } = {
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};

interface BaseFileUploadProps {
  value?: string[];
  onChange?(value?: string[]): void;
  /** 最大文件数，0表示不限 */
  limit?: number;
  /** 大小限制, 默认10M，单位 M */
  size?: number;
  /** 每一项的宽度，默认 100 */
  width?: number;
  /** 每一项的高度，默认 100 */
  height?: number;
  /** 默认错误会进行 `message.error` 提示，false 表示不提示 */
  errorMessage?: false | string;
  accept?: string;
}

interface DataItem {
  url: string;
  /** 如果没有 file 表示为回显数据，不需要上传 */
  file?: File;
}

export interface BaseFileUploadRef {
  upload(): Promise<void>;
}

const BaseFileUpload = forwardRef(({
  value,
  limit,
  size = 10,
  width = 100,
  height = 100,
  errorMessage = '上传失败',
  accept = '*',
  onChange,
}: BaseFileUploadProps, ref: Ref<BaseFileUploadRef>) => {
  /** 在上传的回调中 无法获取到最新的 datas */
  const datasRef = useRef<DataItem[]>([]);
  const [datas, setDatas] = useState<DataItem[]>([]);

  useEffect(() => {
    if (`${datasRef.current.map(item => item.url)}` !== `${value}`) {
      const urlFiles = datasRef.current.reduce((p, item) => ({ ...p, [item.url]: item.file }), {});
      setDatas(datasRef.current = value?.map(item => ({ url: item, file: urlFiles[item] })) || []);
    }
  }, [value]);

  function onSelectImage (e: React.ChangeEvent<HTMLInputElement>, index?: number) {
    const files = e.target.files;

    if (files?.length) {
      const filesArr = [...files];
      if (size && filesArr.some(file => file.size > size * 1024 * 1024)) {
        message.error(`单个文件大小不能超过${size}M！`);
      } else if (accept && filesArr.some(file => !new RegExp(accept.replace(/\*/g, '.*').replace(/, */, '|')).test(file.type))) {
        message.error(`仅支持文件格式为：${accept}`);
      } else {
        const currentData = datasRef.current;
        /** 如果有限制，裁剪多余的文件 */
        limit && filesArr.splice(limit - currentData.length + (index !== void 0 ? 1 : 0));
        const filesDatas: DataItem[] = filesArr.map(item => ({ url: URL.createObjectURL(item), file: item }));
        index === void 0 ? currentData.push(...filesDatas) : currentData.splice(index, 1, ...filesDatas);
        onChange?.(currentData.map(item => item.url));
        setDatas([...currentData]);
      }
    }

    /** 清空当前input，避免重选同一张图不触发onchange事件 */
    e.target.value = '';
  }

  function onDelete (index: number) {
    const currentData = datasRef.current;
    currentData.splice(index, 1);
    onChange?.(currentData.map(item => item.url));
    setDatas([...currentData]);
  }

  async function upload () {
    try {
      /** 仅针对有file字段的进行上传 */
      await Promise.all(datas.map((item, index) => {
        if (!item.file) {
          return Promise.resolve();
        }
        return Promise.resolve('TODO:图片上传接口')
          .then(url => {
            const currentData = datasRef.current;
            currentData[index] = { url };
            onChange?.(currentData.map(item => item.url));
            setDatas([...currentData]);
          });
      }));
    } catch (e) {
      errorMessage && message.error(errorMessage);
      /** 抛出错误，让后续操作终止 */
      throw Incorrect.formatTryCatchError(e);
    }
  }

  useImperativeHandle(ref, () => ({ upload }));

  return (
    <Attachment.PreviewProvider>
      <div className={style.box}>
        {datas.map((item, index) => (
          <Attachment
            className={style.item}
            key={item.url}
            width={width}
            height={height}
            src={item.url}
            order={index}
            ext={item.file ? mimetype[item.file.type] || item.file.type.split('/')[1] : void 0}>
            <div className={style.ctrl}>
              <span onClick={() => onDelete(index)}>删除</span>
              <label>
                <span>替换</span>
                <input accept={accept} multiple hidden type="file" onChange={e => onSelectImage(e, index)} />
              </label>
            </div>
          </Attachment>
        ))}
        {/* 没有限制或者没有超过限制才能继续添加 */}
        {!limit || limit - datas.length > 0 ? (
          <label className={`${style.item} ${style.upload}`} style={{ width, height }}>
            <PlusOutlined className={globalStyle.fs30} />
            <input accept={accept} multiple hidden type="file" onChange={onSelectImage} />
          </label>
        ) : null}
      </div>
    </Attachment.PreviewProvider>
  );
});

export default BaseFileUpload;
