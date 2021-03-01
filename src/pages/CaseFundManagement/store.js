import React from 'react';
import { useLocalStore } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import _ from 'lodash';
import { useStore as useGlobalStore } from '@stores';
import BaseStore from '@stores/BaseStore';

/**
 * 案件资金管理
 * @class Store
 */
class Store extends BaseStore {
  @observable _cases = [];
  @observable _page = {
    total: 0,
    pageSize: 10,
    current: 1,
  };
  @observable _query = {};
  @observable _type = 'input';

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get type() {
    return this._type;
  }

  @computed
  get page() {
    return toJS(this._page);
  }

  @computed
  get cases() {
    return toJS(this._cases);
  }

  @computed
  get typeDesc() {
    return this._type === 'input' ? '案件录入' : '';
  }

  @computed
  get caseStore() {
    return this.global.caseStore;
  }

  @action
  getCases = async (query = {
    start: moment(0).format('YYYY-MM-DD HH:mm:ss'),
    end: moment().format('YYYY-MM-DD HH:mm:ss')
  }) => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.baseUrl}/api/v1/case`,
      query: {
        ...query,
        showVictim: true,
        // pageSize: this.page.pageSize,
        // pageIndex: this.page.current,
      },
    });
    this
      .setValue('cases', _.get(res, 'data', []))
      .setPatch('page',
        {
          current: _.get(res.pageInfo, 'pageIndex'),
          pageSize: _.get(res.pageInfo, 'pageSize'),
          total: _.get(res.pageInfo, 'total')
        });
  }

  @action
  getCasesByParty = async (query) => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.baseUrl}/api/v1/case/findByParty`,
      query: {
        ...query,
        showVictim: true,
        pageSize: this.page.pageSize,
        pageIndex: this.page.current,
      },
    });
    this
      .setValue('cases', _.get(res, 'data', []))
      .setPatch('page',
        {
          current: _.get(res.pageInfo, 'pageIndex'),
          pageSize: _.get(res.pageInfo, 'pageSize'),
          total: _.get(res.pageInfo, 'total')
        });
  }

  @action
  onConfirm = async (id) => {
    const res = await this.axios({
      method: 'PUT',
      url: `${this.baseUrl}/api/v1/case-fund/confirm/${id}`
    });
    this.getCases();
    return this.onHandleResult(res);
  }

  @action
  setCase = async (body) => {
    const res = await this.axios({
      method: 'POST',
      url: `${this.baseUrl}/api/v1/case`,
      body: {
        ...body,
      },
    });
    this.getCases();
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