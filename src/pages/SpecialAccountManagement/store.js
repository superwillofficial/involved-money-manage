import React from 'react';
import { useLocalStore } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';
import _ from 'lodash';
import { useStore as useGlobalStore } from '@stores';
import BaseStore from '@stores/BaseStore';

/**
 * 专户管理
 * @class Store
 */
class Store extends BaseStore {
  @observable _mainAccts = [];
  @observable _subAccts = [];
  @observable _currentAcct = {};
  @observable _type = '';
  @observable _accountType = 'main';

  // 子账号明细分页
  @observable _page = {
    total: 0,
    pageSize: 10,
    current: 1,
  };

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get type() {
    return this._type;
  }

  @computed
  get accountType() {
    return this._accountType;
  }

  @computed
  get mainAccts() {
    return toJS(this._mainAccts);
  }

  @computed
  get subAccts() {
    return toJS(this._subAccts);
  }

  @computed
  get currentAcct() {
    return toJS(this._currentAcct);
  }

  @computed
  get page() {
    return toJS(this._page);
  }

  // 查询主账户
  @action
  getMainAccts = async () => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.baseUrl}/api/v1/mainAcct`,
    });
    this
      .setValue('mainAccts', _.get(res, 'data', []));
  }

  // 查询子账户
  @action
  getSubAccts = async (id) => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.baseUrl}/api/v1/subAcct/${id || this.currentAcct.id}`,
      query: {
        // pageSize: this.page.pageSize,
        // pageIndex: this.page.current,
      }
    });
    this
      .setValue('subAccts', _.get(res, 'data', []))
      .setPatch('page',
        {
          current: _.get(res.pageInfo, 'pageIndex'),
          pageSize: _.get(res.pageInfo, 'pageSize'),
          total: _.get(res.pageInfo, 'total')
        });
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