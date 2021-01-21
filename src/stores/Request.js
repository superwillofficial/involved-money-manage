import { observable, action, computed, toJS, when, reaction } from 'mobx';
import _ from 'lodash';
import axios from '@utils/axios';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import { message, Modal } from 'antd';
import { RESP_CODE } from '@config/sysConsts';
import { RESMSG_DESC } from '@config/consts';

const TIMEOUT = 300;
/**
 * 请求 store
 */
class RequestStore {

  @observable timeout = TIMEOUT;
  @observable _requests = [];

  constructor() {
    reaction(() => this.requests, this.logs);
    reaction(
      () => this.timeout,
      (timeout) => {
        if (timeout <= 0) {
          this.clearRequest();
        }
      },
    );
  }

  logs = () => {
    console.group('%c 网络请求队列', 'color:#31d88ccc');
    console.log('网络请求队列:', this.requests);
    console.log('网络请求数:', this.requests.length);
    console.groupEnd('网络请求队列');
  }

  @computed
  get inRequest() {
    return this.requests.length;
  }

  @computed
  get requests() {
    return toJS(this._requests);
  }

  @action
  startTime = () => {
    this.timeout = TIMEOUT;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeout--;
    }, 1000);
  }

  @action
  clearRequest = () => {
    const requests = this._requests;
    requests.map(request => this.showMsg('error', `网络请求${request.url || ''}请求错误`));
    this._requests = [];
    this.timeout = TIMEOUT;
    clearInterval(this.timer);
  }

  @action
  startRequest = (enable, params) => {
    if (enable) {
      this._requests.push(params);
      this.startTime();
    }
  }

  @action
  finalRequest = (uuid) => {
    this._requests = this.requests.filter(v => v.uuid !== uuid);
  }

  @action
  axios = async (params, enable = true) => {
    const uuid = uuidv4();
    enable && this.startRequest(enable, { ...params, uuid });
    return axios(params)
      .then(this.handleResult)
      .then((res) => {
        enable && this.finalRequest(uuid);
        return res;
      }).catch((err) => {
        this.finalRequest(uuid);
        const errMsg = _.get(err, 'errors.detail') || _.get(err, 'message') ||
          RESMSG_DESC[_.get(err, 'respCode')] || '服务错误';
        this.showMsg('error', errMsg);
        return Promise.reject(err);
      });
  }

  @action
  uploadFile = async ({ file, action, data }) => {
    let formData = new FormData();
    // 合并请求参数
    formData.append('file', file);
    _.forEach(data, (v, k) => formData.append(k, v));
    // 加入请求队列
    const uuid = uuidv4();
    const params = {};
    formData.forEach((v, k) => params[k] = v);
    this.startRequest(true, { ...params, uuid });
    // 上传
    return await axios({
      url: action,
      method: 'POST',
      body: formData,
      header: { 'Content-Type': 'multipart/form-data' },
    })
      .then(this.handleResult)
      .then((res) => {
        this.finalRequest(uuid);
        this.showMsg('success', '导入成功');
        return res;
      }).catch((err) => {
        this.finalRequest(uuid);
        const errMsg = _.get(err, 'errors.detail') || _.get(err, 'message') ||
          RESMSG_DESC[_.get(err, 'respCode')] || '服务错误';
        this.showMsg('error', errMsg);
        return Promise.reject(err);
      });
  }

  @action
  showMsg = (type, description) => {
    return (message[type] && message[type](description), this);
  }

  @action
  showVerifyErrs = (baseErrs, totalErrs) => {
    const errs1 = baseErrs || [];
    const errs2 = totalErrs || [];
    const errMsg = errs1.concat(errs2);
    return (Modal.error({
      title: '校验失败',
      content: (<div style={{
        width: '90%', fontSize: '12px',
        maxHeight: '450px', overflow: 'scroll'
      }}>
        {errMsg.map(item => { return <p>{item}</p>; })}
      </div>)
    }), this);
  }

  handleResult = async (res) => {
    let respCode;
    if (res.respCode || res.respCode === 0) respCode = res.respCode;
    if (res.status || res.status === 0) respCode = res.status;
    if (res.code || res.code === 0) respCode = res.code;
    if (respCode !== RESP_CODE.SUCCESS) {
      if (res.baseErrs || res.totalErrs) {
        this.showVerifyErrs.bind(this)(res.baseErrs, res.totalErrs);
      }
      return Promise.reject(res);
    }
    return res;
  }
}

export default RequestStore;
