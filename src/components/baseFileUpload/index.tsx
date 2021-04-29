import globalStyle from 'index.less';
import style from './index.less';
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BaseImage from 'components/baseImage';
import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import Incorrect from 'classes/Incorrect';

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
    if (`${datasRef.current.map(item => item.url)}` !== `${datas.map(item => item.url)}`) {
      const urlFiles = datasRef.current.reduce((p, item) => ({ ...p, [item.url]: item.file }), {});
      setDatas(value?.map(item => ({ url: item, file: urlFiles[item] })) || []);
    }
  }, [value]);

  useEffect(() => {
    if (`${datasRef.current.map(item => item.url)}` !== `${datas.map(item => item.url)}`) {
      onChange?.(datas.map(item => item.url));
    }
    /** 重新生成一个，避免使用push改变了 datasRef.current 导致上述判断未生效 */
    datasRef.current = [...datas];
  }, [datas]);

  function onSelectImage (e: React.ChangeEvent<HTMLInputElement>, index?: number) {
    const files = e.target.files;

    if (files?.length) {
      const filesArr = [...files];
      if (size && filesArr.some(file => file.size > size * 1024 * 1024)) {
        message.error(`单个文件大小不能超过${size}M！`);
      } else {
        /** 如果有限制，裁剪多余的文件 */
        limit && filesArr.splice(limit - datas.length + (index !== void 0 ? 1 : 0));
        const filesDatas: DataItem[] = filesArr.map(item => ({ url: URL.createObjectURL(item), file: item }));
        index === void 0 ? datas.push(...filesDatas) : datas.splice(index, 1, ...filesDatas);
        setDatas([...datas]);
      }
    }

    /** 清空当前input，避免重选同一张图不触发onchange事件 */
    e.target.value = '';
  }

  function onDelete (index: number) {
    datas.splice(index, 1);
    setDatas([...datas]);
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
            /** 重新生成一个，避免使用push改变了 datasRef.current 导致上述判断未生效 */
            const datasCopy = [...datasRef.current];
            datasCopy[index] = { url };
            setDatas([...datasCopy]);
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
    <BaseImage.PhotoProvider>
      <div className={style.box}>
        {datas.map((item, index) => (
          <BaseImage className={style.item} key={item.url} width={width} height={height} src={item.url}>
            <div className={style.ctrl}>
              <span onClick={() => onDelete(index)}>删除</span>
              <label>
                <span>替换</span>
                <input accept={accept} multiple hidden type="file" onChange={e => onSelectImage(e, index)} />
              </label>
            </div>
          </BaseImage>
        ))}
        {/* 没有限制或者没有超过限制才能继续添加 */}
        {!limit || limit - datas.length > 0 ? (
          <label className={`${style.item} ${style.upload}`} style={{ width, height }}>
            <PlusOutlined className={globalStyle.fs30} />
            <input accept={accept} multiple hidden type="file" onChange={onSelectImage} />
          </label>
        ) : null}
      </div>
    </BaseImage.PhotoProvider>
  );
});

export default BaseFileUpload;
