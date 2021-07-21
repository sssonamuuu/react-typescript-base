import style from './index.less';
import { Card, CardProps } from 'antd';
import React from 'react';

export interface BaseCardProps extends CardProps {

}

export default function BaseCard (props: BaseCardProps) {
  return <Card {...props} />;
}

BaseCard.SubTitle = function ({ children, isTop }: React.PropsWithChildren<{ isTop?: boolean }>) {
  return <div className={`${style.subtitle} ${isTop ? style.isTop : ''}`}>{children}</div>;
};
