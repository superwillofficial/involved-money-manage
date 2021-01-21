import { observable, action, toJS, computed } from 'mobx';
import _ from 'lodash';

import BaseStore from '@stores/BaseStore';

/**
 * 当前案件详情
 * @class Store
 */
export default class CaseDetail extends BaseStore {
  @observable _case = {};

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get case() {
    return toJS(this._case);
  }

  @action
  setCase = (data) => {
    this.setValue('_case', data);
  }
};
