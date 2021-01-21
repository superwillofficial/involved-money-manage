/**
 * 系统通用常量配置
 */
const keyMirror = (options) => _.reduce(options, (p, v) => (p[v] = `${v}`, p), {});

/**
 * 通用判断
 */
export const ENABLED = {
  YES: 'YES',
  NO: 'NO',
};
export const ENABLED_DESC = {
  [ENABLED.YES]: '是',
  [ENABLED.NO]: '否',
};

/**
 * 月份
 */
export const MONTHS = {
  Jan: '1月',
  Feb: '2月',
  Mar: '3月',
  Apr: '4月',
  May: '5月',
  Jun: '6月',
  Jul: '7月',
  Aug: '8月',
  Sep: '9月',
  Oct: '10月',
  Nov: '11月',
  Dec: '12月',
};

/**
 * 性别
 */
export const GENDER = {
  MALE: 1,         // 男性
  FEMALE: 2,     // 女性
};
export const GENDER_DESC = {
  [GENDER.MALE]: '男',
  [GENDER.FEMALE]: '女',
};

/**
 * 案件状态(待设计)
 */
export const CASESTATUS = {
  INIT: 1,
  UNPAID: 2,
  FAILED: 0,
  WARNING: -2,
};

export const CASESTATUS_DESC = {
  [CASESTATUS.INIT]: '初录入',
  [CASESTATUS.UNPAID]: '待缴费',
  [CASESTATUS.FAILED]: '失败',
  [CASESTATUS.WARNING]: '警告',
};

export const CASESTATUS_COLOR = {
  [CASESTATUS.INIT]: 'default',
  [CASESTATUS.UNPAID]: 'processing',
  [CASESTATUS.FAILED]: 'error',
  [CASESTATUS.WARNING]: 'warning',
};
/**
 * 结算方式
 */
export const SETTLETYPE = {
  CASH: '01',
  TRANSFER: '02',
  CHEQUE: '03',
};

export const SETTLETYPE_DESC = {
  [SETTLETYPE.CASH]: '现金',
  [SETTLETYPE.TRANSFER]: '转账',
  [SETTLETYPE.CHEQUE]: '支票',
};

/**
 * 当事人类型
 */
export const PARTY = {
  SUSPECT: 1,
  VICTIM: 2,
};
export const PARTY_DESC = {
  [PARTY.SUSPECT]: '赔偿方',
  [PARTY.VICTIM]: '受偿方',
};

/**
 * 数据请求返回码(错误类型)
 */
export const RESMSG = {
  DATABASE_EXCEPTION: -1,
  SUCCESS: 1,
  USERNAME_NOEXIST: 1001,
  PASSWORD_ERROR: 1002,
  NOLOGIN: 1003,
  UPDATE_FAIL: 1005,
  ERROR: 1006,
  AVAILABLE: 1100,
  UNAVAILABLE: 1101,
  PHONE_UNAVAILABLE: 1102,
  USERNAME_UNAVAILABLE: 1103,
  REGISTER_FAIL: 1104,
  NOAUTH: 401,
  NOT_FOUND: 404,
  INVALID: 4003,
  EXPIRE: 4001,
  FAIL: 4002
};
export const RESMSG_DESC = {
  [RESMSG.DATABASE_EXCEPTION]: '数据库异常或请求失败',
  [RESMSG.SUCCESS]: '成功',
  [RESMSG.USERNAME_NOEXIST]: '账号不存在',
  [RESMSG.PASSWORD_ERROR]: '密码错误',
  [RESMSG.UPDATE_FAIL]: '更新信息失败',
  [RESMSG.NOLOGIN]: '未登陆状态',
  [RESMSG.ERROR]: '系统错误',
  [RESMSG.AVAILABLE]: '账号手机都可用',
  [RESMSG.UNAVAILABLE]: '账号手机均不可用',
  [RESMSG.PHONE_UNAVAILABLE]: '手机号不可用',
  [RESMSG.USERNAME_UNAVAILABLE]: '账号不可用',
  [RESMSG.REGISTER_FAIL]: '注册失败',
  [RESMSG.NOAUTH]: '无操作权限',
  [RESMSG.NOT_FOUND]: '页面没找到',
  [RESMSG.INVALID]: 'Token无效',
  [RESMSG.EXPIRE]: 'Token过期',
  [RESMSG.FAIL]: '验证不通过'
};

// 可见数据类型
export const VISIBLE_TYPE = {
  GROUP: 1,
  SELF: 2,
};

export const VISIBLE_TYPE_DESC = {
  [VISIBLE_TYPE.GROUP]: "本组及下属分组",
  [VISIBLE_TYPE.SELF]: "仅见本人",
};

/**

 * 权限类型
 */
export const AUTH_TYPE = {
  CLASS: 'class',
  PAGE: 'page',
  API: 'api',
  BTN: 'btn'
};
export const AUTH_TYPE_DESC = {
  [AUTH_TYPE.CLASS]: '一级模块',
  [AUTH_TYPE.PAGE]: '页面',
  [AUTH_TYPE.API]: 'api',
  [AUTH_TYPE.BTN]: '按钮',
};
