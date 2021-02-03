import { observable, action, computed, toJS } from 'mobx';
import _ from 'lodash';

import * as Consts from '@config/consts';
import * as sysConsts from '@config/sysConsts';

/**
 * 基础store
 * @class Store
 */
class Store {
  @observable _modal = {};

  constructor() {
    this.consts = Consts;
    this.sysConsts = sysConsts;
  }

  @action
  setValue = (name, value) => {
    if (this.hasOwnProperty(`_${name}`)) {
      return (this[`_${name}`] = value, this);
    }
    return (this[name] = value, this);
  }

  @action
  setPatch = (name, value) => (this[`_${name}`] = { ...this[`_${name}`], ...value }, this)

  @action
  openModal = (name) => (this._modal[name] = true, this)

  @action
  closeModal = (name) => (this._modal[name] = false, this)

  @computed
  get baseUrl() {
    return this.sysConsts.BACK_END_URL;
  }

  @computed
  get authUrl() {
    return this.sysConsts.AUTH_URL;
  }

  @computed
  get modal() {
    return toJS(this._modal);
  }

  @computed
  get organizationInfo() {
    return toJS(this._organizationInfo);
  };

  @computed
  get axios() {
    if (!this.global) {
      throw Error('global.requestStore 不存在,请先配置全局store');
    }
    return this.global.requestStore.axios;
  }

  @computed
  get showMsg() {
    return this.global.requestStore.showMsg;
  }

  @computed
  get uploadFile() {
    if (!this.global) {
      throw Error('global.requestStore 不存在,请先配置全局store');
    }
    return this.global.requestStore.uploadFile;
  }
}

export default Store;
