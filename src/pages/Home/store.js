import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { observable, action, computed, toJS } from 'mobx';

import _ from 'lodash';
import { useStore as useGlobalStore } from '@stores';
import BaseStore from '@stores/BaseStore';

/**
 * 首页
 * @class Store
 */
class Store extends BaseStore {
  constructor(global) {
    super();
    this.global = global;
  }
};

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
