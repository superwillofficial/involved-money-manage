import React from 'react';
import { useLocalStore } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';
import _ from 'lodash';
import { useStore as useGlobalStore } from '@stores';
import BaseStore from '@stores/BaseStore';

/**
 * 非税账户管理
 * @class Store
 */
class Store extends BaseStore {
  @observable _nonTexAccts = [];
  @observable _type = '';
  @observable _nonTex = {};

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get type() {
    return this._type;
  }

  @computed
  get nonTex() {
    return this._nonTex;
  }


  @computed
  get nonTexAccts() {
    return toJS(this._nonTexAccts);
  }

  @computed
  get typeDesc() {
    return this._type === 'create' ? '新增非税账户' : '编辑非税账户';
  }

  // 列表查询非税账户（不分页）
  @action
  getNonTexAccts = async () => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.baseUrl}/api/v1/nonTaxAcct`,
    });
    this
      .setValue('nonTexAccts', _.get(res, 'data', []));
  }
  
  // 新增非税账户
  @action
  setNonTexAcct = async (body) => {
    const res = await this.axios({
      method: 'POST',
      url: `${this.baseUrl}/api/v1/nonTaxAcct`,
      body: {
        ...body,
      },
    });
    this.getNonTexAccts();
  }
  // 修改非税账户
  @action
  updateNonTexAcct = async (body) => {
    const id = this._nonTex.id;
    const res = await this.axios({
      method: 'PUT',
      url: `${this.baseUrl}/api/v1/nonTaxAcct/${id}`,
      body: {
        ...body,
      },
    });
    this.getNonTexAccts();
  }

  // 删除非税账户
  @action
  removeAcct = async (id) => {
    const res = await this.axios({
      method: 'DELETE',
      url: `${this.baseUrl}/api/v1/nonTaxAcct/${id}`,
    });
    this.getNonTexAccts();
  }

  // 启用非税账户
  @action
  enableAcct = async (id) => {
    const res = await this.axios({
      method: 'PUT',
      url: `${this.baseUrl}/api/v1/nonTaxAcct/enable/${id}`,
    });
    this.getNonTexAccts();
  }

  // 停用用非税账户
  @action
  disableAcct = async (id) => {
    const res = await this.axios({
      method: 'PUT',
      url: `${this.baseUrl}/api/v1/nonTaxAcct/disable/${id}`,
    });
    this.getNonTexAccts();
  }

  onHandleResult = (res) => {
    return _.get(res, 'code') === this.sysConsts.RESP_CODE.SUCCESS;
  }

  @action
  resetPage = () => {
    return this.setValue('page', {
      total: 0,
      pageSize: 10,
      current: 1,
    });
  }

}

const storeContext = React.createContext(null);

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) { throw new Error('You have forgot to use StoreProvider, shame on you.'); }
  return store;
};

export default (props) => {
  const global = useGlobalStore();
  const store = useLocalStore(() => (new Store(global)));
  return (
    <storeContext.Provider value={store}>
      {props.children}
    </storeContext.Provider>
  );
};