import _ from 'lodash';
import dayjs from 'dayjs';
/**
 * 邮箱正则匹配
 */
export const REGEXP_EMAIL = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;

/**
 * 手机号码正则匹配表达式
 */
export const REGEXP_PHONE = /^1(3|4|5|6|7|8|9)\d{9}$/g;

/**
 * 邮箱安全字符替换
 * @param {String} email      邮箱
 * @param {RegExp} [regex]    正则表达式
 * @param {String} [place]    替换字符
 * @return {String} 替换后的邮箱
 */
export const onReplaceEmail = (email, regex, place) => {
  if (!email) return '';
  if (regex && place) return email.replace(regex, place);
  return email.replace(/(.{3}).+(.{2}@.+)/g, "$1****$2");
};

/**
 * 手机号安全字符替换
 * @param {String} phone      手机号码
 * @param {RegExp} [regex]    正则表达式
 * @param {String} [place]    替换字符
 * @return {String} 替换后的手机号码
 */
export const onReplacePhone = (phone, regex, place) => {
  if (!phone) return '';
  if (regex && place) return phone.replace(regex, place);
  return phone.replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2');
};

/**
 * 金额格式化
 *
 * @export
 * @param {*} amount
 * @returns
 */
export function fmoney(amount) {
  amount = `${parseFloat(_.round(amount, 2)).toFixed(2)}`;
  let t = '';
  let m = amount.substring(0, 1);
  if (m === '-') {
    amount = amount.substring(1);
  } else {
    m = '';
  }
  let l = amount.split('.')[0].split('').reverse();
  let r = amount.split('.')[1];
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
  }
  return `${m}${t.split('').reverse().join('')}.${r}`;
}

/**
 * 日期格式化
 *
 * @export
 * @param {*} time
 * @returns
 */
export function dateFormat(time, format = 'YYYY-MM-DD') {
  if (!time || !dayjs(time).isValid()) return '-';
  return dayjs(time).format(format);
}

/**
 * 创建uuid
 */
export const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );

/**
 * 去掉空值
 */
export const removeEmpty = (values) => {
  for (let v in values) {
    if (["", undefined, null].includes(values[v])) {
      delete values[v];
    }
  };
  return values;
};

/**
 * 获取文件排序号
 */
export const genFileIndex = (lastLength) => {
  lastLength = Number(lastLength) || 1;
  return (Math.pow(10, 4) + lastLength).toFixed().substr(1, 4);
};
