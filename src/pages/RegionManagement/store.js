import React from "react";
import { useLocalStore } from "mobx-react";
import { observable, action, computed, toJS } from "mobx";

import _ from "lodash";
import axios from "@utils/axios";
import { useStore as useGlobalStore } from "@stores";
import BaseStore from "@stores/BaseStore";

/**
 * 机构管理
 *
 * @class Store
 * @extends {BaseStore}
 */
class Store extends BaseStore {
  @observable _orgList = [];
  @observable _type = "create";
  @observable _detail = {};

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get orgList() {
    return toJS(this._orgList);
  }

  @computed
  get detail() {
    return toJS(this._detail);
  }

  @computed
  get page() {
    return toJS(this._page);
  }

  @computed
  get type() {
    return this._type;
  }

  @computed
  get optionStore() {
    return this.global.optionStore;
  }

  @action
  onOrgList = async () => {
    return await axios({
      methods: "GET",
      url: `${this.baseUrl}/api/v1/dict/policeStation`,
    }).then(res => {
      // console.log(res);
      this.setValue("orgList", _.get(res, "data"));
    });
  };

  @action
  onOrgCreate = async (body) => {
    return await axios({
      method: "POST",
      url: `${this.baseUrl}/api/v1/dict`,
      body: {
        sub: 'policeStation',
        ...body
      }
    }).then(async (res) => {
      await this.onOrgList();
      return res;
    });
  };

  @action
  onOrgDelete = async (id) => {
    return await axios({
      method: "DELETE",
      url: `${this.baseUrl}/api/v1/dict/${id}`,
    }).then(async (res) => {
      await this.onOrgList();
      return res;
    });
  };

  @action
  onOrgUpdate = async (body) => {
    return await axios({
      method: "PUT",
      url: `${this.baseUrl}/api/v1/dict/${this.detail.id}`,
      body: {
        sub: 'policeStation',
        ...body
      }
    }).then(async (res) => {
      console.log(res);
      await this.onOrgList();
      return res;
    });
  };
}

const storeContext = React.createContext(null);

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error("You have forgot to use StoreProvider, shame on you.");
  }
  return store;
};

export default props => {
  const global = useGlobalStore();
  const store = useLocalStore(() => new Store(global));
  return (
    <storeContext.Provider value={store}>
      {props.children}
    </storeContext.Provider>
  );
};
