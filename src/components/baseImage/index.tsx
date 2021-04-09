import React, { CSSProperties, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import style from './index.less';
import 'react-photo-view/dist/index.css';
import { PhotoProvider, PhotoConsumer } from 'react-photo-view';

export interface BaseImageProps {
  src?: string;
  alt?: string;
  /** 是否是头像，头像默认圆角 */
  avatar?: boolean;
  className?: string;
  radius?: CSSProperties['borderRadius'];
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
}

export default function BaseImage ({
  src,
  className = '',
  alt,
  avatar = false,
  radius = avatar ? '50%' : 0,
  width = '100%',
  height = '100%',
  children,
}: PropsWithChildren<BaseImageProps>) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const realSrc = useMemo(() => !src ? '' : /^(https|blob|data):/.test(src) ? src : `http://TODO:图片地址前缀${src}`, [src]);
  useEffect(() => setStatus('loading'), [realSrc]);
  return (
    <div
      className={`${style.picture} ${className}`}
      style={{ width, height, borderRadius: radius }}>
      {realSrc ? (
        <PhotoConsumer src={realSrc}>
          <img
            src={realSrc}
            alt={alt}
            className={style.img}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')} />
        </PhotoConsumer>
      ) : null}
      {status === 'loaded' ? null : (
        <div className={style.placeholder}>
          <img className={avatar ? style.avatar : ''} src={avatar ? require('./avatar.png') : require('./default.svg')} alt={alt} />
        </div>
      )}
      {children}
    </div>
  );
}

BaseImage.PhotoProvider = PhotoProvider;
