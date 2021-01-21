import axios from 'axios';
import qs from 'qs';
import { createHashHistory } from 'history';
import { message } from 'antd';
import { RESP_CODE } from '@config/sysConsts';
const history = createHashHistory();

/**
 * 参数序列化
 * @param {Object} params 参数
 * @return 序列化后参数
 */
function queryParams(params) {
  return qs.stringify(params, { indices: false });
};

/**
 * axios请求
 * @param {String} method  请求方法
 * @param {String} url     请求地址
 * @param {Object} query   请求参数
 * @param {Object} body    发送内容
 * @param {Object} header  请求头
 * @param {Object} configs axios配置
 */
async function axiosRequest(method, url, query, param, body, header, configs = {}) {
  let request;
  let params = Object.assign({}, query);
  const token = localStorage.getItem('token');
  const authObj = token && { Authorization: token };

  let headers = header || {
    Accept: 'application/json, */*',
    'Content-Type': 'application/json',
  };
  headers = { ...headers, ...authObj };

  let data;
  if (headers['Content-Type'] === 'application/json') {
    data = JSON.stringify(body);
  } else if (headers['Content-Type'] ===
    'application/x-www-form-urlencoded') {
    data = queryParams(body);
  } else {
    data = body;
  }
  // let data = headers['Content-Type'] === 'application/json' ? JSON.stringify(body) : body;
  const paramsSerializer = (params) => queryParams(params);
  const config = Object.assign({}, {
    timeout: 10000000000,
    withCredentials: false,
    responseType: 'json',
    maxContentLength: 2000,
    maxRedirects: 5,
  }, configs);

  let path = `${url}`;

  let instance = axios.create(config);

  //拦截器request
  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  //拦截器response
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  let axiosConfig = {
    method,
    url: path,
    params,
    paramsSerializer,
    headers,
  };

  switch (method) {
    case 'GET':
      request = instance({ ...axiosConfig });
      break;
    default:
      request = instance({ ...axiosConfig, data });
      break;
  }

  return request
    .then(res => {
      if (_.get(res, 'data.respCode') === RESP_CODE.REJECT) {
        message.destroy();
        message.info('身份已过期，请重新登录');
        localStorage.clear();
        const timer = setTimeout(() => {
          clearTimeout(timer);
          history.push('/login');
        }, 1000);
        return Promise.reject('身份已过期，请重新登录');
      } else {
        return res;
      }
      return res;
    })
    .then(res => res.data);
};

export default async (queryParams) => {
  const { method, url, query, param, body, header, configs } = queryParams;

  return await axiosRequest(method, url, query, param, body, header, configs);
};
