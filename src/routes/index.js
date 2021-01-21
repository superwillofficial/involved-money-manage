// 路由配置
module.exports = {
  Login: {
    text: '登录', path: '/login', parent: 'Root',
    component: 'Login', redirect: '/login',
    nav: false, exact: false,
  },

  Index: {
    text: '根目录', path: '/', parent: 'Root',
    component: 'AppFrame', redirect: '/case-management',
    nav: false, exact: false,
  },

  Home: {
    text: '首页', path: '/home', parent: 'Index',
    component: 'Home', redirect: '/case-management',
    nav: true, exact: false,
  },

  // 案件管理
  CaseManagement: {
    text: '案件管理', path: '/case-management', parent: 'Index',
    component: 'CaseManagement', nav: true, exact: true,
  },

  CaseDetailManagement: {
    text: '案件详情', path: '/case-detail/:id', parent: 'CaseManagement',
    component: 'CaseDetailManagement', nav: false, exact: true,
  },

  CaseInput: {
    text: '案件录入', path: '/case-input', parent: 'CaseManagement',
    component: 'CaseInput', nav: false, exact: true,
  },

  // 系统配置
  SystemManagement: {
    text: '系统管理', path: '/system-management', parent: 'Index',
    component: 'SystemManagement', icon: "iconyonghu-shezhi",
    nav: true, exact: true,
  },

  RoleManagement: {
    text: '角色权限管理', path: '/system-management/role', parent: 'SystemManagement',
    component: 'RoleManagement', nav: true, exact: true,
  },

  UserManagement: {
    text: '用户管理', path: '/system-management/user', parent: 'SystemManagement',
    component: 'UserManagement', nav: true, exact: true,
  },

  RegionManagement: {
    text: '地区管理', path: '/system-management/region', parent: 'SystemManagement',
    component: 'RegionManagement', nav: true, exact: true,
  },

  NotFound: {
    text: '404', path: '/404', parent: 'Index',
    component: 'NotFound',
    nav: false, exact: true,
  },
};
