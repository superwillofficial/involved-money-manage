import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useObserver } from "mobx-react-lite";

import { Layout } from 'antd';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import GlobalLoading from './GlobalLoading';

import { useStore } from '@stores/';
import './index.less';

// 获取有效路由列表
const getRouters = (routers) => {
  const routerList = [];
  for (let router of Object.keys(routers)) {
    // 链接权限服务 parent !== 'null'
    // 未连接权限服务 parent !== 'Root'
    if (
      routers[router].path &&
      routers[router].parent !== "null"
    ) {
      routerList.push({
        key: router,
        path: routers[router].path,
        exact: routers[router].exact,
        redirect: routers[router].redirect,
        component: routers[router].component,
      });
    }
  }
  return routerList;
};

// 获取页面以及父级页面(链级)
const getRouterChain = (currRoute = {}, routers) => {
  const routerList = [{
    path: currRoute.path,
    text: currRoute.text,
    icon: currRoute.icon,
  }];
  const parent = (parentName) => {
    const val = routers[parentName];
    // 链接权限服务 parent !== 'null'
    // 未连接权限服务 parent !== 'Root'
    if (
      parentName !== 'Index' &&
      (val && val.parent !== 'null')
    ) {
      routerList.unshift({
        path: val.path,
        text: val.text,
        icon: val.icon,
      });
      parent(val.parent);
    }
  };
  parent(currRoute.parent);
  return routerList;
};

// 过滤出有效的RouterTree
const getRouteTree = (routeTree = []) => {
  const loop = (data) => {
    return data.map((item, index) => {
      const val = {
        key: item.name,
        title: item.text,
        url: item.path,
        icon: item.icon,
        className: item.className,
      };
      if (item.children) {
        val.children = loop(item.children);
      }
      return val;
    });
  };
  return loop(routeTree);
};

const useRoutes = () => {
  const store = useStore();
  const location = useLocation();
  const { appStore } = store;
  const { routeHelper } = appStore;
  // 当前路由
  useEffect(() => {
    const { routeName = null } = routeHelper.matchRoute(location.pathname);
    // 根目录路由
    let rootRoute = routeHelper.findRouteByName('Index');
    let rootRouteName = rootRoute ? rootRoute.routeName : null;
    // 获取路由树
    const leftNavInfo = routeHelper.getRouteTree(rootRouteName, routeName);
    // 生成路由树
    const routerTree = getRouteTree(leftNavInfo.routeTree);
    // 设置菜单
    appStore.setValue('menus', routerTree);
    // 获取路由列表
    const routerList = getRouters(routeHelper._routes);
    // 设置路由
    appStore.setValue('routes', routerList);

  }, [location.pathname, appStore.routeHelper]);
};

const useUser = () => {
  const store = useStore();
  const history = useHistory();
  const { appStore } = store;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const onLogout = () => history.push('/login');
    if (!token) {
      onLogout();
    } else {
      appStore
        .getUser()
        .then(appStore.getMenus);
    }
    return () => false;
  }, []);
};

export default () => useObserver(() => {
  const store = useStore();
  // 获取用户
  useUser();
  // 设置路由
  useRoutes();
  // 用户加载进度
  if (_.isEmpty(_.get(store, 'appStore.user'))) {
    return (
      <GlobalLoading />
    );
  }
  return (
    <Layout className="app-block">

      {/* 头部 */}
      <Header />

      {/* 主体 */}
      <Main />

      {/* 全局遮罩 */}
      <GlobalLoading />

    </Layout>
  );
});
