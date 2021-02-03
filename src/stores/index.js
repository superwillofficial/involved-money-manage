import React from 'react';
import { useLocalStore } from 'mobx-react';
import { observable } from 'mobx';

// 扩展
import AppFrame from './AppFrame';
import CaseDetail from './CaseDetail';
import Request from './Request';
import { SYSYTEM_NAME } from '@config/sysConsts';

/**
 * 全局 store
 */
class Store {
  @observable name = SYSYTEM_NAME; // 保留对mobx的观察引用

  constructor() {
    this.appStore = new AppFrame(this);
    this.caseStore = new CaseDetail(this);
    this.requestStore = new Request(this);
  }
}
const storeContext = React.createContext(null);
export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) { throw new Error('useStore must be used within a StoreProvider.'); }
  return store;
};

export default ({ children }) => {
  const store = useLocalStore(() => (new Store()));
  return (
    <storeContext.Provider value={store}>
      {children}
    </storeContext.Provider>
  );
};
