import style from './index.less';
import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import usePageConfig from 'hooks/usePageConfig';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';
import keyboardEventUtils from 'utils/keyboardEventUtils';
import { Spin } from 'antd';
import { getFileIconType } from 'base/baseAttachment';

export type BaseFileIconType = 'img' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'xls' | 'xlsx' | 'pdf' | 'zip' | 'unknown';

export interface BasePreviewItemProps {
  key: string;
  order?: number;
  title?: string;
  src: string;
  /** 扩展名，用于部分无法确定fileIcon的地方传入，如：文件上传 */
  ext?: string;
  /** 如果不传入该字段，如果有 ext 通过 ext 获取，如果无通过 src 获取，最后 unknown， */
  type?: BaseFileIconType;
}

interface BasePreviewItemWithInfoProps extends BasePreviewItemProps {
  status: 'loading' | 'loaded' | 'error';
  type: BaseFileIconType;
}

interface BasePreviewContextProps {
  add(item: BasePreviewItemProps): void;
  remove(key: string): void;
  show(key: string): void;
}

const BasePreviewContext = React.createContext<BasePreviewContextProps>({ add: () => void 0, remove: () => void 0, show: () => void 0 });

interface BasePreviewConsumerProps extends Omit<BasePreviewItemProps, 'key'> {
  children: React.ReactElement;
}

export function BasePreviewConsumer ({ children, ...props }: BasePreviewConsumerProps) {
  const key = useMemo(() => Math.random().toString(16), []);
  const context = useContext(BasePreviewContext);

  useEffect(() => {
    context.add({ ...props, key });
    return () => {
      context.remove(key);
    };
  }, []);

  return React.cloneElement(children, {
    onClick: () => {
      context.show(key);
      children.props.onClick?.();
    },
  });
}

interface PreviewProviderProps {}

/** 点击如果在当前class包含内容内，不进行关闭 */
const CONTENT_CLASSNAME = 'preview-content-classname-not-close';

export function BasePreviewProvider ({ children }: PropsWithChildren<PreviewProviderProps>) {
  const { disablePageScroll, enablePageScroll } = usePageConfig({});
  const [showDesc, setShowDesc] = useState(true);
  const [show, setShow] = useState(false);
  const [list, setList] = useState<BasePreviewItemWithInfoProps[]>([]);
  const [currentKey, setCurrentKey] = useState<string>();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseDownX, setMouseDownX] = useState(0);
  const [currentMouseX, setCurrentMouseX] = useState(0);

  const orderedList = useMemo(() => list.sort((a, b) => Number(a.order) - Number(b.order)), [list]);

  const currentIndex = useMemo(() => {
    const index = orderedList.findIndex(item => item.key === currentKey);
    return ~index ? index : 0;
  }, [orderedList, currentKey]);

  const current = useMemo<BasePreviewItemWithInfoProps | void>(() => orderedList[currentIndex], [orderedList, currentIndex]);

  function onClose () {
    setShow(false);
    setShowDesc(true);
    enablePageScroll();
  }

  function onPrev () {
    if (currentIndex > 0) {
      setCurrentKey(orderedList[currentIndex - 1].key);
    }
  }

  function onNext () {
    if (currentIndex < orderedList.length - 1) {
      setCurrentKey(orderedList[currentIndex + 1].key);
    }
  }

  useEffect(() => {
    function onKeyDown (e: KeyboardEvent) {
      if (show && !isMouseDown) {
        keyboardEventUtils.isEsc(e) && onClose();
        keyboardEventUtils.isArrowLeft(e) && onPrev();
        keyboardEventUtils.isArrowRight(e) && onNext();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [show, isMouseDown, orderedList, currentIndex]);

  function onMouseDown (e: React.MouseEvent) {
    if (e.button === 0) {
      setIsMouseDown(true);
      const x = e.clientX || e.pageX || e.screenX;
      setMouseDownX(x);
      setCurrentMouseX(x);
    }
  }

  function onMouseMove (e: React.MouseEvent) {
    if (isMouseDown && e.button === 0) {
      setCurrentMouseX(e.clientX || e.pageX || e.screenX);
    }
  }

  function onClick (e: React.MouseEvent<HTMLLIElement>) {
    if ([...document.querySelectorAll(`.${CONTENT_CLASSNAME}`)].some(element => element.contains(e.target as any))) {
      setShowDesc(!showDesc);
    } else {
      onClose();
    }
  }

  function onMouseUp (e: React.MouseEvent<HTMLLIElement>) {
    if (isMouseDown && e.button === 0) {
      const dx = currentMouseX - mouseDownX;
      if (Math.abs(dx) <= 10) {
        onClick(e);
      } else {
        dx < 0 ? onNext() : onPrev();
      }
      setIsMouseDown(false);
      setMouseDownX(0);
      setCurrentMouseX(0);
    }
  }

  let currentMarginLeft = '';

  if (!isMouseDown || currentIndex === 0 && currentMouseX - mouseDownX >= 0 || currentIndex === orderedList.length - 1 && currentMouseX - mouseDownX <= 0) {
    currentMarginLeft = `${-currentIndex * 100}%`;
  } else {
    currentMarginLeft = `calc(${-currentIndex * 100}% + ${currentMouseX - mouseDownX}px)`;
  }

  return (
    <BasePreviewContext.Provider value={{
      add: item => {
        const type = item.type || (item.ext ? getFileIconType(item.ext) : getFileIconType(item.src));
        setList(prev => [...prev, { ...item, status: type === 'img' ? 'loading' : 'loaded', type }]);
      },
      remove: key => setList(prev => prev.filter(item => item.key !== key)),
      show: key => {
        disablePageScroll();
        setCurrentKey(key);
        setShow(true);
      },
    }}>
      {children}
      {currentKey ? (
        <div hidden={!show} className={style.cover}>
          <ul
            className={`${style.list} ${isMouseDown ? style.mousedown : ''}`}
            style={{
              width: `${orderedList.length * 100}%`,
              marginLeft: currentMarginLeft,
            }}>
            {orderedList.map(item => (
              <li key={item.key} className={style.item} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
                {(() => {
                  if (item.type === 'img') {
                    return (
                      <React.Fragment>
                        {item.status === 'loading' ? <Spin className={CONTENT_CLASSNAME} /> : null}

                        <img
                          onDragStart={e => e.preventDefault()}
                          src={item.src}
                          className={`${style.image} ${CONTENT_CLASSNAME}`}
                          hidden={item.status !== 'loaded'}
                          onLoad={() => setList(orderedList.map(data => ({ ...data, status: data.key === item.key ? 'loaded' : data.status })))}
                          onError={() => setList(orderedList.map(data => ({ ...data, status: data.key === item.key ? 'error' : data.status })))} />

                        {item.status === 'error' ? <img className={CONTENT_CLASSNAME} onDragStart={e => e.preventDefault()} src={require('../../images/file-icon/file-img-fill.svg')} width={150} /> : null}
                      </React.Fragment>
                    );
                  }

                  return (
                    <div className={`${style.cantPreviewFile} ${CONTENT_CLASSNAME}`}>
                      <img onDragStart={e => e.preventDefault()} src={require(`../../images/file-icon/file-${item.type}-fill.svg`)} width={150} />
                      <p>
                        <span>当前文件不支持预览，您可以</span>
                        <a target="_blank" href={item.src} download>点击下载</a>
                      </p>
                    </div>
                  );
                })()}
              </li>
            ))}
          </ul>

          <div className={style.head} hidden={!showDesc}>
            <span>{`${currentIndex + 1}/${orderedList.length}`}</span>
            <div className={style.title}>{current ? current.title : null}</div>
            <CloseOutlined className={style.icon} onClick={onClose} />
          </div>
          <div className={style.leftBox} onClick={onPrev} hidden={!showDesc || currentIndex === 0}>
            <ArrowLeftOutlined className={style.ctrlBox} />
          </div>
          <div className={style.rightBox} onClick={onNext} hidden={!showDesc || currentIndex === orderedList.length - 1}>
            <ArrowRightOutlined className={style.ctrlBox} />
          </div>
        </div>
      ) : null}
    </BasePreviewContext.Provider>
  );
}
