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
  @observable _page = {
    total: 0,
    pageSize: 10,
    current: 1
  };

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
  get typeDesc() {
    return this._type === "create" ? "新增" : "编辑";
  }

  @computed
  get optionStore() {
    return this.global.optionStore;
  }

  @action
  onOrgList = async (name = '') => {
    return await axios({
      methods: "GET",
      // url: `${this.baseUrl}/organization`,
      url: `http://101.132.98.20:3001/mock/57/api/v1/organization/list`,
      query: {
        name,
        pageSize: this.page.pageSize,
        pageIndex: this.page.current,
      }
    }).then(res => {
      // console.log(res);
      this.setValue("orgList", _.get(res, "data"))
        .setPatch('page', _.get(res, 'page', {}));
    });
  };

  @action
  onOrgCreate = async body => {
    console.log(body);
    return await axios({
      method: "POST",
      // url: `${this.baseUrl}/organization`,
      url: `http://101.132.98.20:3001/mock/57/api/v1/organization`,
      body: body
    }).then(async (res) => {
      await this.onOrgList();
      return res;
    });
  };

  @action
  onOrgDelete = async id => {
    console.log(id);
    return await axios({
      method: "DELETE",
      // url: `${this.baseUrl}/organization`,
      url: `http://101.132.98.20:3001/mock/57/api/v1/organization/:${id}`,
      query: { id: id }
    }).then(async (res) => {
      await this.onOrgList();
      return res;
    });
  };

  @action
  onOrgUpdate = async body => {
    // console.log(await axios({
    //   method: "PUT",
    //   url: `${this.baseUrl}/organization/${body.id}`,
    //   body: body
    // }).then());
    console.log(body);
    return await axios({
      method: "PUT",
      // url: `${this.baseUrl}/organization/${body.id}`,
      url: `http://101.132.98.20:3001/mock/57/api/v1/organization/:${body.id}`,
      body: body
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
