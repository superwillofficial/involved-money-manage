import React from 'react';
import { useLocalStore } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';

import _ from 'lodash';
import { useStore as useGlobalStore } from '@stores';
import BaseStore from '@stores/BaseStore';

/**
 * 案件详情管理
 * @class Store
 */
class Store extends BaseStore {
  @observable _case = {};
  @observable _suspect = {};
  @observable _id = '';
  @observable _page = {
    total: 0,
    pageSize: 10,
    current: 1,
  };
  @observable _query = {};
  @observable _type = 'add';

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get type() {
    return this._type;
  }

  @computed
  get id() {
    return this._id;
  }

  @computed
  get page() {
    return toJS(this._page);
  }

  @computed
  get case() {
    return toJS(this._case);
  }

  @computed
  get suspect() {
    return toJS(this._suspect);
  }

  @action
  getCaseDetail = async (id) => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.baseUrl}/api/v1/caseDetail/${id}`,
      query: {},
    });
    // console.log("res========", res);
    this.setValue('case', _.get(res, 'data', {}));
  }

  @action
  addParty = async (party) => {
    const res = await this.axios({
      method: 'POST',
      url: `${this.baseUrl}/api/v1/case-party/${this.id}`,
      body: [
        ...party,
      ],
    });
    this.getCaseDetail(this.id);
    return this.onHandleResult(res);
  }

  @action
  editParty = async (party) => {
    const res = await this.axios({
      method: 'PUT',
      url: `${this.baseUrl}/api/v1/case-party/${this.id}/${this.suspect.partyId}`,
      body: {
        ...party,
      },
    });
    this.getCaseDetail(this.id);
    return this.onHandleResult(res);
  }

  @action
  onDelete = async (id) => {
    const res = await this.axios({
      method: 'DELETE',
      url: `${this.baseUrl}/api/v1/case-party/${this.id}`,
      body: [
        id
      ]
    });
    this.getCaseDetail(this.id);
  }

  // 分配子账户
  @action
  distSubAcct = async (party) => {
    const res = await this.axios({
      method: 'POST',
      url: `${this.baseUrl}/api/v1/case/sub-acct`,
      body: {
        caseId: this.case.id,
        partyId: party,
        mainAcctId: 1, // 后续接收参数扩充
      },
    });
    this.getCaseDetail(this.id);
    return this.onHandleResult(res);
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