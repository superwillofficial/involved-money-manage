/**
 * 系统名称
 */
export const SYSYTEM_NAME = '涉案资金管理系统';

/**
 * 响应状态码
 */
export const RESP_CODE = {
  SUCCESS: 0,  // 成功
  FAILD: 1,    // 失败
  REJECT: -1,  // 拒绝
};

/**
 * 请求响应成功状态码
 */
export const HTTP_SUCCESS_CODE = 200;

/**
 * 默认分页配置
 */
export const DEFAULT_PAGE = { total: 0, pageSize: 10, pageIndex: 1 };

/**
 * 权限服务接口地址
 */
export const AUTH_URL = `${process.env.REACT_APP_AUTH_SERVICE}/api/v1/auth`;

/**
 * 后台服务接口地址
 */
export const BACK_END_URL = `${process.env.REACT_APP_BACK_END_SERVICE}`;
