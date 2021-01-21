import { useLocalStore } from 'mobx-react';
import { observable, computed, action, toJS } from 'mobx';
import { useStore as useGlobalStore } from '@stores';

import _ from 'lodash';
import BaseStore from '@stores/BaseStore';

/**
 * 下拉选择库
 */
class Store extends BaseStore {
  @observable _options = [];
  @observable _params = {};

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get options() {
    return toJS(this._options);
  }

  @computed
  get params() {
    return { ...this._params, method: 'GET' };
  }

  @action
  getOptions = async () => {
    return await this.axios(this.params, false)
      .then(res => this.setValue('options', _.get(res, 'body.data', [])));
  }
}

/**
 * 使用store
 */
function useStore() {
  const global = useGlobalStore();
  const store = useLocalStore(() => new Store(global));
  return store;
};
export default useStore;
