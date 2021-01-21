/**
 * 获取cookie
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if (arr)
    return unescape(arr[2]);
  else
    return null;
}

/**
 * 设置cookie
 *
 * @export
 * @param {*} key
 * @param {*} val
 * @param {*} data
 * @param {*} path
 */
export function setCookie(key, val, data, path) {
  const dataStr = data ? `;expires=${data}` : ' ';
  const pathStr = path ? `;path=${path}` : ' ';
  document.cookie = `${key}=${val}${dataStr}${pathStr}`;
}

/**
 * 删除cookie
 *
 * @export
 * @param {*} key
 */
export function delCookie(key) { //删除cookie方法
  var date = new Date(); //获取当前时间
  date.setTime(date.getTime() - 10000); //将date设置为过去的时间
  document.cookie = `${key}=v;expires=${date.toGMTString()}`;  //设置cookie
}
