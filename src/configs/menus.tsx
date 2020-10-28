import React, { ReactNode } from 'react';
import { HomeOutlined } from '@ant-design/icons';

interface MenuProps {
  title: string;
  key: number;
  path?: string;
  icon?: ReactNode;
  children?: MenuProps[];
}

const menus: MenuProps[] = [
  {
    key: 1,
    title: '首页',
    path: '/',
    icon: <HomeOutlined />,
  },
  {
    key: 2,
    title: 'XXX管理',
    icon: <HomeOutlined />,
    children: [
      {
        key: 21,
        title: 'XXX列表',
        path: '/xxx',
      },
    ],
  },
];

export default menus;
