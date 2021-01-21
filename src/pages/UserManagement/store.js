import React from 'react';
import { useLocalStore } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';

import _ from 'lodash';
import axios from '@utils/axios';
import { useStore as useGlobalStore } from '@stores';
import BaseStore from '@stores/BaseStore';

/**
 * 用户管理
 * @class Store
 */
class Store extends BaseStore {
  @observable _users = [];
  @observable _detail = {};
  @observable _type = 'create';
  @observable _orgs = [];
  @observable _roles = [];
  @observable _message;
  @observable _page = {
    total: 0,
    pageSize: 10,
    current: 1,
  };
  @observable _query = {};

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get optionStore() {
    return this.global.optionStore;
  }

  @computed
  get users() {
    return toJS(this._users);
  }

  @computed
  get page() {
    return toJS(this._page);
  }

  @computed
  get roles() {
    return toJS(this._roles);
  }

  @computed
  get orgs() {
    return toJS(this._orgs);
  }

  @computed
  get detail() {
    return toJS(this._detail);
  }

  @computed
  get type() {
    return this._type;
  }

  @computed
  get message() {
    return this._message;
  }

  @computed
  get typeDesc() {
    return this._type === 'create' ? '新增' : '编辑';
  }

  @action
  getUsers = async (query = {}) => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.authUrl}/user/list`,
      query: {
        ...query,
        num: this.page.pageSize,
        current: this.page.current,
      },
    });
    this
      .setValue('users', _.get(res, 'data', []))
      .setPatch('page', _.get(res, 'page', {}));
  }

  @action
  getRoles = async () => {
    return await this.axios({
      method: 'GET',
      url: `${this.authUrl}/role/list`,
    }).then((res) => {
      this.setValue('roles', _.get(res, 'data', []));
    });
  }

  // @action
  // getOrgs = async () => {
  //   return await this.axios({
  //     method: 'GET',
  //     url: 'http://101.132.98.20:3001/mock/57/api/v1/organization/list',
  //     query: {
  //       name: '',
  //       pageIndex: this.page.current,
  //       pageSize: this.page.pageSize
  //     }
  //   }).then((res) => {
  //     // console.log(res);
  //     this.setValue('orgs', _.get(res, 'data', []));
  //   }).catch(err => {
  //     this.setValue('orgs', _.get(err, 'data', []));
  //   });
  // }

  onHandleResult = (res) => {
    this.setValue('message', _.get(res, 'message'));
    return _.get(res, 'respCode') === this.sysConsts.RESP_CODE.SUCCESS;
  }

  @action
  onCreate = async (body) => {
    return await axios({
      method: 'POST',
      url: `${this.authUrl}/user/add`,
      query: body,
    }).then(this.onHandleResult);
  }

  @action
  onEdit = async (body) => {
    return await axios({
      method: 'PUT',
      url: `${this.authUrl}/user/update-info`,
      // header: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // },
      body: {
        user: {
          id: this.detail.id,
          ..._.omit(body, 'roleList'),
        },
        roleList: [this.roles.find(item => item.roleCode === body.roleCode)],
      },
    }).then(this.onHandleResult);
  }

  @action
  onDelete = async (id) => {
    return this.axios({
      method: 'PUT',
      url: `${this.authUrl}/user/delete-binduser`,
      body: { userId: id },
    }).then(this.onHandleResult);
  }

  @action
  onResetPw = async (id) => {
    return this.axios({
      method: 'POST',
      url: `${this.authUrl}/user/reset-password`,
      query: { id: id },
    }).then(this.onHandleResult);
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
