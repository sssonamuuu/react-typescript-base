import { Card, CardProps } from 'antd';
import React from 'react';

export interface BaseCardProps extends CardProps {

}

export default function BaseCard (props: BaseCardProps) {
  return <Card {...props} />;
}
