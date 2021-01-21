import React from 'react';
import { useLocalStore } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';

import _ from 'lodash';
import { useStore as useGlobalStore } from '@stores';
import BaseStore from '@stores/BaseStore';

/**
 * 角色权限管理
 * @class Store
 */
class Store extends BaseStore {
  // 角色列表
  @observable _type;
  @observable _roles = [];
  @observable _roleSelectedKeys = [];
  @observable _currentRole = {};
  // 菜单树配件
  @observable _menus = [];
  @observable _expandedMenuKeys = [];
  @observable _selectedMenuKeys = [];
  @observable _checkedMenuKeys = [];
  @observable _halfCheckedMenuKeys = [];
  // 功能树配件
  @observable _ops = [];
  @observable _expandedOpKeys = [];
  @observable _selectedOpKeys = [];
  @observable _checkedOpKeys = [];

  constructor(global) {
    super();
    this.global = global;
  }

  @computed
  get optionStore() {
    return this.global.optionStore;
  }

  @computed
  get type() {
    return this._type;
  }

  @computed
  get roles() {
    return toJS(this._roles);
  }

  @computed
  get roleSelectedKeys() {
    return toJS(this._roleSelectedKeys).map(key => String(key));
  }

  @computed
  get currentRole() {
    return toJS(this._currentRole);
  }

  @computed
  get menus() {
    const loop = (menu) => {
      menu.title = menu.description;
      menu.key = menu.actionCode;
      if (menu.child && menu.child.length) {
        menu.children = menu.child;
        for (let child of menu.children) {
          loop(child);
        }
      }
      return menu;
    };
    return toJS(this._menus).map(menu => loop(menu));
  }

  @computed
  get flatMenus() {
    const menus = [];
    const loop = (menu) => {
      menu.title = menu.description;
      menu.key = menu.actionCode;
      menus.push(menu);

      if (menu.child && menu.child.length) {
        menu.children = menu.child;
        for (let child of menu.child) {
          loop(child);
        }
      }
    };
    toJS(this._menus).forEach(m => loop(m));
    return menus;
  }

  @computed
  get ops() {
    const loop = (op) => {
      op.title = op.description;
      op.key = op.actionCode;
      if (op.child && op.child.length) {
        op.children = op.child;
        for (let child of op.children) {
          loop(child);
        }
      }
      return op;
    };
    return toJS(this._ops).map(menu => loop(menu));
  }

  @computed
  get expandedMenuKeys() {
    return toJS(this._expandedMenuKeys);
  }

  @computed
  get selectedMenuKeys() {
    return toJS(this._selectedMenuKeys);
  }

  @computed
  get checkedMenuKeys() {
    return _.uniq(toJS(this._checkedMenuKeys));
  }

  @computed
  get halfCheckedMenuKeys() {
    return _.uniq(toJS(this._halfCheckedMenuKeys));
  }

  @computed
  get expandedOpKeys() {
    return toJS(this._expandedOpKeys);
  }

  @computed
  get selectedOpKeys() {
    return toJS(this._selectedOpKeys);
  }

  @computed
  get checkedOpKeys() {
    return toJS(this._checkedOpKeys);
  }

  @action
  getRoles = async () => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.authUrl}/role/list`,
    });
    const defaultKey = _.get(res, 'data.0.roleCode');
    this
      .setValue('roles', _.get(res, 'data', []))
      .setValue('roleSelectedKeys', defaultKey ? [defaultKey] : []);
  }

  @action
  getMenus = async () => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.authUrl}/menu/menu-tree`,
      query: { roleCode: this.roleSelectedKeys[0] },
    });
    const menus = _.get(res, 'data', []);
    this.setValue('menus', menus);

    const { halfCheckedKeys, checkedKeys } = this.getAllMenuTreeNodeKeys(this.flatMenus);
    this
      .setValue('checkedMenuKeys', checkedKeys)
      .setValue('halfCheckedMenuKeys', halfCheckedKeys);
  }

  // 获取所有节点的key { halfCheckedKeys: 半勾选的key,  CheckedKeys: 全勾选key }
  getAllMenuTreeNodeKeys = (flatMenus = []) => {
    // 所有节点全部为true则全选
    const isTotalEnabled = flatMenus.every(menu => menu.enable === 'true');
    if (isTotalEnabled) {
      return {
        checkedKeys: flatMenus.map(menu => menu.key),
        halfCheckedKeys: [],
      };
    }
    // 获取自身及所有子节点key
    const getChildren = (node, keys = []) => {
      keys.push({ key: node.key, enable: node.enable });
      if (!(node.children && node.children.length)) return keys;
      for (let child of node.children) {
        getChildren(child, keys);
      }
      return keys;
    };
    // 存在非勾选状态的节点
    let halfCheckedKeys = [];
    let checkedKeys = [];
    const loop = (menu) => {
      // 1. 获取当前节点下的所有子节点
      const children = getChildren(menu);
      // 2. enable字段全为true, 则为勾选状态, 否则为半勾选状态
      const allChecked = children.every(child => child.enable === 'true');
      const allUnChecked = children.every(child => child.enable !== 'true');
      if (allChecked) {
        checkedKeys.push(menu.key);
      } else {
        // 子节点的长度大于1(包含自己),则为半勾选, 否则不勾选
        (!allUnChecked && children.length > 1) && halfCheckedKeys.push(menu.key);
      }

      // 存在下级子节点 进行递归
      if (menu.children && menu.children.length) {
        for (let child of menu.children) {
          loop(child);
        }
      }
    };
    flatMenus.forEach(menu => loop(menu));
    return {
      checkedKeys,
      halfCheckedKeys,
    };
  }

  @action
  getOps = async () => {
    const res = await this.axios({
      method: 'GET',
      url: `${this.authUrl}/action/action-tree`,
      query: { roleCode: this.roleSelectedKeys[0] },
    });
    const ops = _.get(res, 'data', []);
    this.setValue('ops', ops);
  }

  @action
  addRole = async (body) => {
    return await this.axios({
      method: 'POST',
      url: `${this.authUrl}/role/add`,
      query: body,
    });
  };

  @action
  editRole = async (body) => {
    return await this.axios({
      method: 'PUT',
      url: `${this.authUrl}/role/update`,
      body: {
        ...body,
        id: this.currentRole.id,
      },
    });
  };

  @action
  deleteRole = async (id) => {
    return await this.axios({
      method: 'DELETE',
      url: `${this.authUrl}/role/delete`,
      query: { id },
    });
  }

  @action
  getZones = async () => {
    await this.axios({
      method: 'GET',
      url: `${this.authUrl}/zone`,
    });
  }

  @action
  saveMenus = async () => {
    return await this.axios({
      method: 'PUT',
      url: `${this.authUrl}/menu/change-auth`,
      query: { roleCode: this.roleSelectedKeys[0] },
      body: { actionCode: this.checkedMenuKeys.concat(this.halfCheckedMenuKeys) },
    });
  };

  @action
  saveOps = async () => {
    return await this.axios({
      method: 'PUT',
      url: `${this.authUrl}/action/change-auth`,
      query: { roleCode: this.roleSelectedKeys[0] },
      body: { actionCode: this.checkedOpKeys },
    });
  };
}

const StoreContext = React.createContext(null);
export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) { throw new Error('You have forgot to use StoreProvider, shame on you.'); }
  return store;
};

export default (props) => {
  const global = useGlobalStore();
  const store = useLocalStore(() => (new Store(global)));
  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};
