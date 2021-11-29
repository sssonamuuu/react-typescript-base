import globalStyle from 'index.less';
import style from './index.less';
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import fileServices from 'services/fileServices';
import { message } from 'antd';
import Incorrect from 'classes/Incorrect';
import BaseAttachment from 'base/baseAttachment';
import { BaseFileIconType } from 'base/basePreview';

/** 通过mimetype的/截取，后半截无法判断FileIconType的文件 */
const mimetype: { [key: string]: BaseFileIconType } = {
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/x-zip-compressed': 'zip',
};

export interface DataItem {
  url: string;
  name: string;
  /** 如果没有 file 表示为回显数据，不需要上传 */
  file?: File;
}

interface BaseFileUploadProps {
  value?: (DataItem | string)[];
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
  /** 禁用，仅作为展示 */
  disabled?: boolean;
}

export interface BaseFileUploadRef {
  /** 上传完成后会自动更新 `form` 中的值，会触发 `onChange` 事件，不需要手动接受返回值，仅在需要 names 时使用  */
  upload(): Promise<[urls: string[], names: string[]]>;
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
  disabled,
}: BaseFileUploadProps, ref: Ref<BaseFileUploadRef>) => {
  /** 在上传的回调中 无法获取到最新的 datas */
  const datasRef = useRef<DataItem[]>([]);
  const [datas, setDatas] = useState<DataItem[]>([]);

  useEffect(() => {
    if (`${datasRef.current.map(item => item.url)}` !== `${value?.map(item => typeof item === 'string' ? item : item.url)}`) {
      const urlFiles = datasRef.current.reduce<{ [url: string]: DataItem }>((p, item) => ({ ...p, [item.url]: item }), {});
      setDatas(datasRef.current = value?.map<DataItem>(item => {
        if (typeof item !== 'string') {
          return item;
        }
        const cache = urlFiles[item];
        return {
          url: item,
          file: cache?.file,
          name: cache?.name || item.split('?')[0].match(/(?:^|\/)[^/]*$/)?.[0].replace(/\//, '')!,
        };
      }) || []);
    }
  }, [value]);

  function onSelectFile (e: React.ChangeEvent<HTMLInputElement>, index?: number): void {
    const files = [...e.target.files || []];

    /** 清空当前input，避免重选同一张图不触发onchange事件 */
    e.target.value = '';

    if (size && files.some(file => file.size > size * 1024 * 1024)) {
      message.error(`单个文件大小不能超过${size}M！`);
      return;
    }

    if (accept) {
      const accArr = accept.split(',').map(item => item.trim());
      if (files.some(file => {
        const ext = file.name.split('.').pop();
        const type = file.type;
        return !accArr.some(acc => acc.startsWith('.') ? ext === acc.slice(1) : new RegExp(acc.replace(/\*/g, '.*')).test(type));
      })) {
        message.error(`文件格式不对！`);
        return;
      }
    }

    const currentData = datasRef.current;
    /** 如果有限制，裁剪多余的文件 */
    limit && files.splice(limit - currentData.length + (index !== void 0 ? 1 : 0));
    const filesDatas: DataItem[] = files.map(item => ({ url: URL.createObjectURL(item), file: item, name: item.name }));
    index === void 0 ? currentData.push(...filesDatas) : currentData.splice(index, 1, ...filesDatas);
    onChange?.(currentData.map(item => item.url));
    setDatas([...currentData]);
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
        return fileServices.uploadFile({ disableErrorMessage: true, data: { file: item.file } })
          .then(res => {
            const currentData = datasRef.current;
            currentData[index] = { name: res.original, url: res.url };
            onChange?.(currentData.map(item => item.url));
            setDatas([...currentData]);
          });
      }));
      return datasRef.current.reduce<[string[], string[]]>((p, c) => [p[0].concat(c.url), p[1].concat(c.name)], [[], []]);
    } catch (e) {
      errorMessage && message.error(errorMessage);
      /** 抛出错误，让后续操作终止 */
      throw Incorrect.formatTryCatchError(e);
    }
  }

  useImperativeHandle(ref, () => ({ upload }));

  return (
    <BaseAttachment.PreviewProvider>
      <div className={style.box}>
        {datas.map((item, index) => (
          <BaseAttachment
            key={item.url}
            className={style.item}
            width={width}
            height={height}
            src={item.url}
            order={index}
            title={item.name}
            ext={item.file ? mimetype[item.file.type] || item.file.type.split('/')[1] : void 0}>
            {!disabled ? (
              <div className={style.ctrl}>
                <span onClick={() => onDelete(index)}>删除</span>
                <label>
                  <span>替换</span>
                  <input accept={accept} multiple hidden type="file" onChange={e => onSelectFile(e, index)} />
                </label>
              </div>
            ) : null}
          </BaseAttachment>
        ))}
        {/* 没有限制或者没有超过限制才能继续添加 */}
        {!disabled && (!limit || limit - datas.length > 0) ? (
          <label className={`${style.item} ${style.upload}`} style={{ width, height }}>
            <PlusOutlined className={globalStyle.fs30} />
            <input accept={accept} multiple hidden type="file" onChange={onSelectFile} />
          </label>
        ) : null}
      </div>
    </BaseAttachment.PreviewProvider>
  );
});

export default BaseFileUpload;
import globalStyle from 'index.less';
import style from './index.less';
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import Incorrect from 'classes/Incorrect';
import BaseAttachment from 'base/baseAttachment';
import { BaseFileIconType } from 'base/basePreview';

/** 通过mimetype的/截取，后半截无法判断FileIconType的文件 */
const mimetype: { [key: string]: BaseFileIconType } = {
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/x-zip-compressed': 'zip',
};

export interface DataItem {
  url: string;
  name: string;
  /** 如果没有 file 表示为回显数据，不需要上传 */
  file?: File;
}

interface BaseFileUploadProps {
  value?: (DataItem | string)[];
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
  /** 禁用，仅作为展示 */
  disabled?: boolean;
}

export interface BaseFileUploadRef {
  /** 上传完成后会自动更新 `form` 中的值，会触发 `onChange` 事件，不需要手动接受返回值，仅在需要 names 时使用  */
  upload(): Promise<[urls: string[], names: string[]]>;
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
  disabled,
}: BaseFileUploadProps, ref: Ref<BaseFileUploadRef>) => {
  /** 在上传的回调中 无法获取到最新的 datas */
  const datasRef = useRef<DataItem[]>([]);
  const [datas, setDatas] = useState<DataItem[]>([]);

  useEffect(() => {
    if (`${datasRef.current.map(item => item.url)}` !== `${value?.map(item => typeof item === 'string' ? item : item.url)}`) {
      const urlFiles = datasRef.current.reduce<{ [url: string]: DataItem }>((p, item) => ({ ...p, [item.url]: item }), {});
      setDatas(datasRef.current = value?.map<DataItem>(item => {
        if (typeof item !== 'string') {
          return item;
        }
        const cache = urlFiles[item];
        return {
          url: item,
          file: cache?.file,
          name: cache?.name || item.split('?')[0].match(/(?:^|\/)[^/]*$/)?.[0].replace(/\//, '')!,
        };
      }) || []);
    }
  }, [value]);

  function onSelectFile (e: React.ChangeEvent<HTMLInputElement>, index?: number): void {
    const files = [...e.target.files || []];

    /** 清空当前input，避免重选同一张图不触发onchange事件 */
    e.target.value = '';

    if (size && files.some(file => file.size > size * 1024 * 1024)) {
      message.error(`单个文件大小不能超过${size}M！`);
      return;
    }

    if (accept) {
      const accArr = accept.split(',').map(item => item.trim());
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const type = file.type;

        if (accArr.some(acc => acc.startsWith('.') ? ext === acc.slice(1) : new RegExp(accept.replace(/\*/g, '.*')).test(type))) {
          continue;
        }

        message.error(`文件格式不对！`);
        return;
      }
    }

    const currentData = datasRef.current;
    /** 如果有限制，裁剪多余的文件 */
    limit && files.splice(limit - currentData.length + (index !== void 0 ? 1 : 0));
    const filesDatas: DataItem[] = files.map(item => ({ url: URL.createObjectURL(item), file: item, name: item.name }));
    index === void 0 ? currentData.push(...filesDatas) : currentData.splice(index, 1, ...filesDatas);
    onChange?.(currentData.map(item => item.url));
    setDatas([...currentData]);
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
            currentData[index] = { name: currentData[index].name, url };
            onChange?.(currentData.map(item => item.url));
            setDatas([...currentData]);
          });
      }));

      return datasRef.current.reduce<[string[], string[]]>((p, c) => [p[0].concat(c.url), p[1].concat(c.name)], [[], []]);
    } catch (e) {
      errorMessage && message.error(errorMessage);
      /** 抛出错误，让后续操作终止 */
      throw Incorrect.formatTryCatchError(e);
    }
  }

  useImperativeHandle(ref, () => ({ upload }));

  return (
    <BaseAttachment.PreviewProvider>
      <div className={style.box}>
        {datas.map((item, index) => (
          <BaseAttachment
            key={item.url}
            className={style.item}
            width={width}
            height={height}
            src={item.url}
            order={index}
            title={item.name}
            ext={item.file ? mimetype[item.file.type] || item.file.type.split('/')[1] : void 0}>
            {!disabled ? (
              <div className={style.ctrl}>
                <span onClick={() => onDelete(index)}>删除</span>
                <label>
                  <span>替换</span>
                  <input accept={accept} multiple hidden type="file" onChange={e => onSelectFile(e, index)} />
                </label>
              </div>
            ) : null}
          </BaseAttachment>
        ))}
        {/* 没有限制或者没有超过限制才能继续添加 */}
        {!disabled && (!limit || limit - datas.length > 0) ? (
          <label className={`${style.item} ${style.upload}`} style={{ width, height }}>
            <PlusOutlined className={globalStyle.fs30} />
            <input accept={accept} multiple hidden type="file" onChange={onSelectFile} />
          </label>
        ) : null}
      </div>
    </BaseAttachment.PreviewProvider>
  );
});

export default BaseFileUpload;
