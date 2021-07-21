import React, { useCallback, useState } from 'react';
import { Layout, Menu as AntdMenu } from 'antd';
import menus from './menus';
import { Link } from 'react-router-dom';
import { useLocationChange } from 'utils/navigation';
import { routesArr } from 'routers';
import { singleOrArrayToArray } from 'utils/dataTypeTools';

export default function Menu () {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useLocationChange(() => {
    const pathname = location.pathname;

    /**
     * 找到当前地址需要活跃的地址
     *
     * 默认取当前页面的地址 `location.pathname`
     *
     * 如果对应的 `route` 设置有 `activeMenusPath`，取 `activeMenusPath`
     */
    let currentMenuActivePath: string = pathname;

    /** 查找当前路由，如果有 `activeMenusPath` 配置，修改其值 */
    for (const route of routesArr) {
      if (singleOrArrayToArray(route.path).includes(pathname) && route.activeMenusPath) {
        currentMenuActivePath = route.activeMenusPath;
      }
    }

    for (const menu of menus) {
      if (menu.path === currentMenuActivePath) {
        setSelectedKeys([`${menu.key}`]);
        break;
      }

      const child = (menu.children || []).find(mc => mc.path === currentMenuActivePath);

      if (child) {
        setOpenKeys([`${menu.key}`]);
        setSelectedKeys([`${child.key}`]);
        break;
      }
    }
  });

  const onOpenChange = useCallback((values: string[]) => setOpenKeys(values.length ? [values[values.length - 1]] : []), []);

  return (
    <Layout.Sider>
      <AntdMenu theme="dark" mode="inline" selectedKeys={selectedKeys} openKeys={openKeys} onOpenChange={values => onOpenChange(values as string[])}>
        {menus.map(menu => menu.children?.length ? (
          <AntdMenu.SubMenu key={menu.key} icon={menu.icon} title={menu.title}>
            {menu.children.map(child => (
              <AntdMenu.Item key={child.key} icon={child.icon}>
                {child.path ? <Link to={child.path}>{child.title}</Link> : child.title}
              </AntdMenu.Item>
            ))}
          </AntdMenu.SubMenu>
        ) : (
          <AntdMenu.Item key={menu.key} icon={menu.icon}>
            {menu.path ? <Link to={menu.path}>{menu.title}</Link> : menu.title}
          </AntdMenu.Item>
        ))}
      </AntdMenu>
    </Layout.Sider>
  );
}
