import React from 'react';
import { useLocalStore } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';

import _ from 'lodash';
import { useStore as useGlobalStore } from '@stores';
import BaseStore from '@stores/BaseStore';

/**
 * 案件资金详情
 * @class Store
 */
class Store extends BaseStore {
  @observable _case = {};
  @observable _originalFund = [];
  @observable _fund = [];
  @observable _suspect = {};
  @observable _currentVictim = {};
  @observable _currentFundManagement = {};
  @observable _id = '';
  @observable _currentSubAcct = '';
  @observable _page = {
    total: 0,
    pageSize: 10,
    current: 1,
  };
  @observable _query = {};
  @observable _type = '';

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
  get currentSubAcct() {
    return this._currentSubAcct;
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
  get originalFund() {
    return toJS(this._originalFund);
  }

  @computed
  get fund() {
    return toJS(this._fund);
  }

  @computed
  get suspect() {
    return toJS(this._suspect);
  }

  @computed
  get currentVictim() {
    return toJS(this._currentVictim);
  }

  @computed
  get currentFundManagement() {
    return toJS(this._currentFundManagement);
  }

  @computed
  get caseStore() {
    return this.global.caseStore;
  }

  @action
  getCaseDetail = async (id) => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.baseUrl}/api/v1/caseDetail/${id}`,
      query: {
        showVictim: true,
      },
    });
    this.setValue('case', _.get(res, 'data', {}));
  }

  @action
  getCaseFundDetail = async (id) => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.baseUrl}/api/v1/case-fund/detail/${id}`,
      query: {},
    });
    this.setValue('originalFund', _.get(res, 'data', []));
    this.setValue('fund', _.get(res, 'data', []));
  }

  @action
  onApply= async () => {
    const res = await this.axios({
      method: 'PUT',
      url: `${this.baseUrl}/api/v1/case-fund/apply/${this.case.id}`,
    });
    return this.onHandleResult(res);
  }

  @action
  onAudit= async (body) => {
    const res = await this.axios({
      method: 'PUT',
      url: `${this.baseUrl}/api/v1/case-fund/audit/${this.case.id}`,
      body: {
        ...body
      },
    });
    return this.onHandleResult(res);
  }

  @action
  addParty = async (party) => {
    const res = await this.axios({
      method: 'POST',
      url: `${this.baseUrl}/api/v1/case-party/${this.case.id}`,
      body: [
        ...party,
      ],
    });
    return this.onHandleResult(res);
  }

  @action
  editParty = async (party) => {
    const res = await this.axios({
      method: 'PUT',
      url: `${this.baseUrl}/api/v1/case-party/${this.case.id}/${this.currentVictim.partyId}`,
      body: {
        ...party,
      },
    });
    return this.onHandleResult(res);
  }

  @action
  deleteParty = async (partyId) => {
    const res = await this.axios({
      method: 'DELETE',
      url: `${this.baseUrl}/api/v1/case-party/${this.case.id}`,
      body: [
        ...partyId,
      ],
    });
    this.getCaseDetail(this.case.id);
    this.getCaseFundDetail(this.case.id);
    return this.onHandleResult(res);
  }

  @action
  onDelete = async (id) => {
    const res = await this.axios({
      method: 'DELETE',
      url: `${this.baseUrl}/api/v1/case-party/${id}`,
    });
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