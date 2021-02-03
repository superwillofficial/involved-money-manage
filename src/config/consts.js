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
 * 审核状态
 */
export const IS_AUDIT = {
  YES: 0,
  NO: 1,
};
export const IS_AUDIT_DESC = {
  [IS_AUDIT.YES]: '通过',
  [IS_AUDIT.NO]: '不通过',
};

/**
 * 案件状态
 */
export const CASESTATUS = {
  ABANDONED: -1,
  INPUTING: 0,
  INPUT_REVIEWING: 1,
  INPUT_REVIEW_FAILED: 2,
  UNPAID: 3,
  PAID: 4,
  RECHECKING: 5,
  RECHECK_FAILED: 6,
  RECHECKED: 7,
  PAYING: 8,
  PAYMENT_ERROR: 9,
  BILLING_ADJUSTMENT: 10,
  BILLING_RECHECKING: 11,
  COMPENSATED: 12,
};
export const CASESTATUS_DESC = {
  [CASESTATUS.ABANDONED]: '作废',
  [CASESTATUS.INPUTING]: '录入状态',
  [CASESTATUS.INPUT_REVIEWING]: '提交录入审核',
  [CASESTATUS.INPUT_REVIEW_FAILED]: '录入审核不通过',
  [CASESTATUS.UNPAID]: '待缴费',
  [CASESTATUS.PAID]: '确认缴费',
  [CASESTATUS.RECHECKING]: '提交复核',
  [CASESTATUS.RECHECK_FAILED]: '复核不通过',
  [CASESTATUS.RECHECKED]: '复核完成',
  [CASESTATUS.PAYING]: '支付中',
  [CASESTATUS.PAYMENT_ERROR]: '支付异常',
  [CASESTATUS.BILLING_ADJUSTMENT]: '出账调整',
  [CASESTATUS.BILLING_RECHECKING]: '出账调整复核中',
  [CASESTATUS.COMPENSATED]: '赔付完成',
};
export const CASESTATUS_COLOR = {
  [CASESTATUS.ABANDONED]: 'error',
  [CASESTATUS.INPUTING]: 'default',
  [CASESTATUS.INPUT_REVIEWING]: 'processing',
  [CASESTATUS.INPUT_REVIEW_FAILED]: 'error',
  [CASESTATUS.UNPAID]: 'processing',
  [CASESTATUS.PAID]: 'success',
  [CASESTATUS.RECHECKING]: 'processing',
  [CASESTATUS.RECHECK_FAILED]: 'error',
  [CASESTATUS.RECHECKED]: 'success',
  [CASESTATUS.PAYING]: 'processing',
  [CASESTATUS.PAYMENT_ERROR]: 'warning',
  [CASESTATUS.BILLING_ADJUSTMENT]: 'default',
  [CASESTATUS.BILLING_RECHECKING]: 'processing',
  [CASESTATUS.COMPENSATED]: 'success',
};

/**
 * 支付类型
 */
export const PAYMENT_TYPE = {
  TO_VICTIM: 0,
  TO_SUSPECT: 1,
  TO_TREASURY: 2,
  // SPECIAL: -1,
};
export const PAYMENT_TYPE_DESC = {
  [PAYMENT_TYPE.TO_VICTIM]: '赔偿支付',
  [PAYMENT_TYPE.TO_SUSPECT]: '退还',
  [PAYMENT_TYPE.TO_TREASURY]: '上缴/罚没',
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
  SUSPECT: '1',
  VICTIM: '2',
};
export const PARTY_DESC = {
  [PARTY.SUSPECT]: '赔偿方',
  [PARTY.VICTIM]: '受偿方',
};

/**
 * 启用状态
 */
export const ENABLE = {
  ENABLE: '0',
  DISABLE: '1',
};
export const ENABLE_DESC = {
  [ENABLE.ENABLE]: '启用',
  [ENABLE.DISABLE]: '停用',
};
export const ENABLE_COLOR = {
  [ENABLE.ENABLE]: 'processing',
  [ENABLE.DISABLE]: 'error',
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
