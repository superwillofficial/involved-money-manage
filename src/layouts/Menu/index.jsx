import React, { useState, useCallback, useEffect } from 'react';
import { useObserver } from "mobx-react-lite";
import { useHistory, useLocation, matchPath } from 'react-router-dom';
import _ from 'lodash';
import { Menu } from 'antd';
import { useStore } from '@stores';
import './index.less';

const { SubMenu } = Menu;

const useMenuDomTree = (menus) => {
  // 获取叶节点
  const getMenuItem = menu => (
    <Menu.Item className="menu-block-branch-leaf" key={menu.key}> {menu.title} </Menu.Item>
  );
  // 获取菜单树
  const getMenuTree = menus => menus.map(menu => {
    if (menu.children && menu.children.length) {
      return (
        <SubMenu
          key={menu.key}
          title={menu.title}
          popupClassName="menu-block-branch"
        >
          { getMenuTree(menu.children)}
        </SubMenu>
      );
    } else {
      return getMenuItem(menu);
    }
  });
  return getMenuTree(menus);
};

export default () => useObserver(() => {
  const store = useStore();
  const { appStore } = store;
  const history = useHistory();
  const [selectedKeys, setSelectedKeys] = useState([]);
  // 菜单DOM树
  const menuDomTree = useMenuDomTree(appStore.menus);
  // 页面跳转
  const pathTo = useCallback((selectedKeys) => {
    const current = _.last(selectedKeys);
    const route = appStore.routes.find(r => r.component === current);
    localStorage.setItem('route', route.path);
    history.push(route.path);
  }, []);
  // 选择菜单项
  const onSelect = useCallback(({ selectedKeys }) => {
    setSelectedKeys(selectedKeys);
    pathTo(selectedKeys);
  }, [selectedKeys]);
  // 当前菜单选中
  const location = useLocation();
  useEffect(() => {
    const route = appStore.routes.find(route =>
      matchPath(route.path, { path: location.pathname, exact: true, strict: true }));
    route && setSelectedKeys([route.component]);
  }, [location.pathname, appStore.routes]);
  return (
    <Menu
      mode="horizontal"
      // theme="dark"
      className="menu-block"
      onSelect={onSelect}
      selectedKeys={selectedKeys}
    >
      { menuDomTree }
    </Menu>
  );
});
