import style from './index.less';
import { BasePreviewConsumer, BasePreviewProvider, BaseFileIconType, BasePreviewItemProps } from 'base/basePreview';
import React, { CSSProperties, useEffect, useMemo, useState } from 'react';

export interface AttachmentProps extends Pick<BasePreviewItemProps, 'ext' | 'order' | 'type'> {
  /** 文件地址 */
  src?: string;
  /** 预览地址，默认同 src */
  previewSrc?: string;
  /** 是否是头像，头像默认图不一样并且默认 50% 圆角 */
  avatar?: boolean;
  /** 文件名，预览会作为标题显示 */
  title?: string;
  /** avatar 时，默认 50% */
  radius?: CSSProperties['borderRadius'];
  /** 当 width = height，可以通过设置一个值，但是优先级较低，会被 width/height 覆盖 */
  size?: CSSProperties['width'];
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  /** 是否显示标题，默认不显示 */
  showTitle?: 'all' | 'not-image';
  className?: string;
}

export function getAbsoluteSrc (src?: string) {
  return !src ? '' : /^(https?|blob|data):/.test(src) ? src : `TODO://绝对地址/${src}`;
}

export function getFileIconType (src: string = ''): BaseFileIconType {
  const ext = (src.match(/\.\w+(?=$|\?)/)?.[0] || '').replace(/^\./, '');

  if (/jpe?g|png|gif|tiff|pjp|jfif|svgz?|bmp|webp|ico|xbm|dib|tif|pjpeg|avif/.test(ext)) {
    return 'img';
  }

  if (/docx?|pptx?|xlsx?|pdf|zip/.test(ext)) {
    return ext as BaseFileIconType;
  }

  return 'unknown';
}

export default function Attachment ({
  src,
  previewSrc = src,
  avatar,
  title,
  radius = avatar ? '50%' : void 0,
  size = 100,
  width = size,
  height = size,
  order,
  ext,
  showTitle,
  type = ext ? getFileIconType(`.${ext}`) : getFileIconType(src) || 'unknow',
  className = '',
  children,
}: React.PropsWithChildren<AttachmentProps>) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const absoluteSrc = useMemo(() => getAbsoluteSrc(src), [src]);
  const absolutePreviewSrc = useMemo(() => getAbsoluteSrc(previewSrc), [previewSrc]);
  const isImg = type === 'img' || avatar;

  useEffect(() => setStatus(isImg ? 'loading' : 'loaded'), [absoluteSrc]);

  return (
    <div className={`${style.attachment} ${className}`} style={{ width, height }}>
      <BasePreviewConsumer src={absolutePreviewSrc} order={order} type={type} title={title}>
        <div className={style.attachmentInner} style={{ borderRadius: radius }} title={title}>
          {title && (showTitle === 'all' || showTitle === 'not-image' && !isImg) ? <div className={style.title} onClick={e => e.stopPropagation()}>{title}</div> : null}

          {isImg ? <img src={absoluteSrc} alt={title} className={style.image} onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} /> : null}

          {status === 'loaded' && isImg ? null : (
            <div className={style.placeholder} style={{ borderRadius: radius }}>
              <img className={avatar ? style.avatar : ''} src={avatar ? require('../../images/file-icon/avatar.png') : require(`../../images/file-icon/file-${type}-fill.svg`)} alt={title} />
            </div>
          )}
        </div>
      </BasePreviewConsumer>
      {children}
    </div>
  );
}

Attachment.PreviewProvider = BasePreviewProvider;
